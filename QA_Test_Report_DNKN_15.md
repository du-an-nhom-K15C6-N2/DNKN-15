# BÁO CÁO KIỂM THỬ (QA TEST REPORT)
**Mã công việc:** DNKN-58  
**Thuộc User Story:** DNKN-15 - Thông báo rõ ràng khi truy cập nhầm chỗ hoặc không đủ quyền  
**Người thực hiện:** QA Tester / Frontend & Backend Team  
**Môi trường thử nghiệm:** Localhost (Node.js Server, Chrome/Edge)  
**Ngày thực hiện:** 01/10/2026  

---

## 1. Mục tiêu kiểm thử (Test Objectives)
Xác minh tính đúng đắn của toàn bộ luồng xử lý lỗi truy cập trong hệ thống:
- Kiểm tra mã phản hồi HTTP (403, 404).
- Kiểm tra giao diện hiển thị: mã lỗi, thông điệp hướng dẫn rõ ràng, không xuất hiện màn hình trắng.
- Kiểm tra tính tương tác của các hành động điều hướng (Quay lại trang trước, Về trang chủ / trang an toàn).
- Kiểm tra định dạng chuẩn hóa phản hồi lỗi từ API Backend.

---

## 2. Bảng Kịch bản Kiểm thử chi tiết (Test Cases Matrix)

| Test Case ID | Tên kịch bản | Các bước thực hiện (Test Steps) | Kết quả mong đợi (Expected Result) | Kết quả thực tế (Actual Result) | Đánh giá |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Truy cập đường dẫn không tồn tại (Trang 404 độc lập) | 1. Mở trình duyệt<br>2. Mở file `index.html` hoặc vào `http://localhost:3000/sai-link` | - Hiển thị mã 404 màu đỏ nổi bật.<br>- Tiêu đề: "Không tìm thấy trang yêu cầu".<br>- Có 2 nút: "Quay lại trang trước" và "Về trang chủ". | Giao diện hiển thị đúng chuẩn, không bị trang trắng. | **PASS** |
| **TC-02** | Điều hướng từ trang 404 | 1. Đang ở màn hình lỗi 404<br>2. Nhấp nút "Quay lại trang trước"<br>3. Nhấp nút "Về trang chủ" | - Trở về màn hình trước đó trong lịch sử duyệt web.<br>- Điều hướng về trang chủ hệ thống an toàn. | Nút bấm hoạt động đúng chức năng `history.back()` và link `/`. | **PASS** |
| **TC-03** | Truy cập khu vực cấm không đủ quyền (Trang 403 độc lập) | 1. Mở file `403.html`<br>2. Hoặc truy cập `http://localhost:3000/admin/dashboard?token=token-user` | - Hiển thị biểu tượng 🔒 và mã 403 màu cam.<br>- Thông báo rõ ràng: "Truy cập bị từ chối".<br>- Hộp gợi ý liên hệ Quản trị viên. | Hiển thị chính xác thông báo lỗi phân quyền. | **PASS** |
| **TC-04** | Kiểm tra màn hình lỗi chung theo Layout hệ thống (`error.html`) | 1. Mở file `error.html`<br>2. Kiểm tra Header và Sidebar<br>3. Bấm chuyển đổi nhanh giữa 403 và 404 | - Đồng bộ nhận diện hệ thống với thanh Navbar và Sidebar.<br>- Cho phép hiển thị linh hoạt nội dung lỗi 403 hoặc 404 tùy tham số. | Chuyển đổi trạng thái mượt mà, nội dung thay đổi đúng. | **PASS** |
| **TC-05** | Chuẩn hóa phản hồi API Backend (JSON Error Format) | 1. Gửi request `GET http://localhost:3000/api/duong-dan-sai`<br>2. Gửi request `GET http://localhost:3000/api/admin/dashboard` | - Trả về HTTP Status tương ứng (404, 401/403).<br>- Dữ liệu JSON nhất quán gồm: `success`, `statusCode`, `errorCode`, `message`, `timestamp`, `path`. | JSON trả về đúng chuẩn, không crash server. | **PASS** |
| **TC-06** | Middleware Backend tự động chặn và điều hướng về trang lỗi | 1. Chạy `node server.js`<br>2. Truy cập URL quản trị với user thông thường: `/admin/dashboard?token=token-user` | Middleware phát hiện thiếu quyền `admin` và tự động trả về trang giao diện `403.html`. | Tự động trả về trang 403, bảo vệ an toàn tuyến đường quản trị. | **PASS** |

---

## 3. Tổng kết nghiệm thu (Test Summary)
* **Tổng số test cases:** 06
* **Số ca đạt (Pass):** 06 / 06 (Tỷ lệ 100%)
* **Số ca lỗi (Fail/Defect):** 0
* **Kết luận:** Hệ thống đã đáp ứng đầy đủ tất cả các tiêu chí chấp nhận (Acceptance Criteria) của User Story **DNKN-15** và các subtask thành phần (DNKN-53, DNKN-54, DNKN-55, DNKN-56, DNKN-57). Đủ điều kiện đóng task và bàn giao.