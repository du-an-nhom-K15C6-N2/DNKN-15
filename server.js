/**
 * Task DNKN-56: [BE] Tích hợp kiểm tra quyền và điều hướng về trang lỗi phù hợp
 * Sử dụng Middleware xác thực quyền (Role Check Middleware)
 */

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Hàm tiện ích: Trả về trực tiếp file giao diện HTML tương ứng
function serveHtmlPage(res, statusCode, fileName) {
  const filePath = path.join(__dirname, fileName);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Lỗi máy chủ không tìm thấy file giao diện.');
    }
    res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  });
}

// Giả lập danh sách tài khoản và phân quyền trong hệ thống
const USERS_DATABASE = {
  'token-admin': { id: 1, name: 'Quản trị viên', role: 'admin' },
  'token-user':  { id: 2, name: 'Người dùng sinh viên', role: 'user' }
};

// 1. MIDDLEWARE: Kiểm tra phân quyền truy cập
function authMiddleware(req, res, requiredRole, next) {
  const parsedUrl = url.parse(req.url, true);
  // Lấy token qua Query Parameter (?token=...) hoặc Header Authorization
  const token = parsedUrl.query.token || req.headers['authorization'];

  if (!token) {
    console.log(`[Middleware] Chặn truy cập: Chưa đăng nhập khi vào ${parsedUrl.pathname}`);
    // Điều hướng / Phục vụ trang 403 vì chưa xác thực quyền
    return serveHtmlPage(res, 403, '403.html');
  }

  const currentUser = USERS_DATABASE[token];
  if (!currentUser) {
    console.log(`[Middleware] Chặn truy cập: Token không hợp lệ`);
    return serveHtmlPage(res, 403, '403.html');
  }

  // Nếu route yêu cầu quyền admin mà người dùng chỉ có quyền user
  if (requiredRole && currentUser.role !== requiredRole) {
    console.log(`[Middleware] Chặn truy cập: User '${currentUser.name}' (role: ${currentUser.role}) không đủ quyền vào route yêu cầu role: ${requiredRole}`);
    // Trả về trang 403 kèm giao diện lỗi đã xây dựng
    return serveHtmlPage(res, 403, '403.html');
  }

  // Đủ quyền -> Cho phép đi tiếp
  req.user = currentUser;
  next();
}

// 2. SERVER CHÍNH
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Route 1: Trang chủ hệ thống
  if (pathname === '/' || pathname === '/home') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    return res.end(`
      <div style="font-family: Arial; padding: 40px; text-align: center;">
        <h2>Hệ thống Quản trị K15C6 - Backend Server</h2>
        <p>Bấm vào các link dưới đây để kiểm thử Middleware kiểm tra quyền:</p>
        <ul style="list-style: none; padding: 0; line-height: 2;">
          <li>👉 <a href="/admin/dashboard">1. Vào trang Quản trị (Không có token -> Bị đẩy về 403)</a></li>
          <li>👉 <a href="/admin/dashboard?token=token-user">2. Đăng nhập quyền 'User' vào trang Quản trị (Sai quyền -> Bị đẩy về 403)</a></li>
          <li>👉 <a href="/admin/dashboard?token=token-admin">3. Đăng nhập quyền 'Admin' vào trang Quản trị (Đúng quyền -> Thành công)</a></li>
          <li>👉 <a href="/duong-dan-khong-ton-tai">4. Vào đường dẫn sai (Bị đẩy về 404)</a></li>
        </ul>
      </div>
    `);
  }

  // Route 2: Khu vực nhạy cảm / Quản trị hệ thống (Yêu cầu role: admin)
  if (pathname.startsWith('/admin')) {
    return authMiddleware(req, res, 'admin', () => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <div style="font-family: Arial; padding: 40px; text-align: center; color: green;">
          <h1>✅ Xin chào ${req.user.name} (${req.user.role})!</h1>
          <p>Bạn đã vượt qua Middleware kiểm tra quyền và truy cập thành công trang Quản trị.</p>
          <a href="/">← Quay lại Menu kiểm thử</a>
        </div>
      `);
    });
  }

  // Route 3: Mặc định nếu truy cập nhầm đường dẫn không tồn tại -> Điều hướng về 404
  console.log(`[Router] Đường dẫn không tồn tại: ${pathname} -> Chuyển về 404.html`);
  return serveHtmlPage(res, 404, 'index.html');
});

server.listen(PORT, () => {
  console.log(`Server Backend kiểm tra quyền đang chạy tại: http://localhost:${PORT}`);
});