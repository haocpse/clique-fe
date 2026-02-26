# Clique - Frontend

## 🌟 Tổng Quan Hệ Thống (System Overview)
Clique là một nền tảng ứng dụng web hiện đại (Dating/Booking Platform) nơi người dùng có thể khám phá, kết nối và tương tác với nhau. Đặc điểm nổi bật của Clique là hệ thống phân quyền rõ ràng, cho phép người dùng bình thường có thể đăng ký nâng cấp thành **Đối tác (Partner)** để cung cấp thời gian/dịch vụ của mình, và **Quản trị viên (Admin)** sẽ kiểm duyệt các yêu cầu này.

Hệ thống được chia làm 3 vai trò (role) chính:
1. **Người dùng thông thường (USER)**: Tìm kiếm, quẹt/thích (swipe), xem thông tin và đặt lịch hẹn (book schedule) với Partner.
2. **Đối tác (PARTNER)**: Quản lý lịch trình cá nhân, tạo các khung giờ rảnh để người khác có thể đặt lịch.
3. **Quản trị viên (ADMIN)**: Phê duyệt hoặc từ chối các người dùng muốn trở thành Partner, kiểm tra thống kê trên hệ thống.

Công nghệ sử dụng:
- **Ngôn ngữ**: TypeScript
- **Framework**: ReactJS
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Lưu trữ trạng thái**: React Context API

---

## 📂 Trúc Thư Mục (Directory Structure)
Mã nguồn thư mục Frontend được tổ chức theo cấu trúc module hóa chuẩn trong thư mục `src`:

- `src/assets`: Chứa tài nguyên tĩnh (hình ảnh, icon svg,...).
- `src/components`: Chứa các thành phần UI dùng chung (`Button`, `Input`, `Modal`, các Guard components như `ProtectedRoute`, `GuestRoute`).
- `src/config`: Cấu hình môi trường (VD: `env.ts` định nghĩa biến Base URL).
- `src/constants`: Các hằng số, text tĩnh dùng chung.
- `src/contexts`: React Context để lưu trữ State toàn cục (Nổi bật nhất là `AuthContext` dùng để lưu trữ trạng thái phiên đăng nhập và Role của user).
- `src/hooks`: Các Custom React Hooks.
- `src/layouts`: Khung Layout chính của trang (VD: `MainLayout` bọc Header và Footer).
- `src/pages`: **Mục quan trọng nhất**, chứa giao diện và logic của từng Trang (Screen) (sẽ mô tả chi tiết ở phần dưới).
- `src/routes`: Cấu hình router cho app (Nơi định nghĩa Path nào thì sẽ render Page nào, nằm ở `index.tsx`).
- `src/services`: Cấu hình gọi API, tương tác với Backend (được chia nhỏ theo từng resource, ví dụ `auth.service.ts`, `user.service.ts`, `partner.service.ts`).
- `src/styles`: Các file CSS toàn cục.
- `src/types`: Chứa các TypeScript Interfaces/Types cho dữ liệu.
- `src/utils`: Các hàm tiện ích dùng chung (format ngày, chuỗi,...).

---

## 🗺️ Mô Tả Các Trang (Pages)

Dưới đây là mô tả chi tiết các trang trong hệ thống (nằm ở `src/pages`), giúp người tham gia dự án hiểu rõ mục đích của từng màn hình:

### 1. Các Trang Phổ Thông (Public / Khách)
- **Home (`/`)**: Trang chủ giới thiệu về nền tảng Clique (Landing Page). Giới thiệu sơ lược giúp định hướng người dùng.
- **Login (`/login`)**: Trang đăng nhập hệ thống. Khi đăng nhập thành công, hệ thống dựa vào role (USER, PARTNER, ADMIN) để điều hướng phù hợp.
- **Register (`/register`)**: Trang đăng ký tài khoản cho người dùng mới (Mặc định sẽ là role USER).
> **Lưu ý**: Các trang xác thực (Login, Register) được bọc bởi `GuestRoute` để ngăn người đã gửi đăng nhập rồi quay trở lại.

### 2. Các Trang Dành Cho Người Dùng (USER)
- **Create Profile (`/profile/create`)**: Yêu cầu người dùng mới đăng ký phải điền đầy đủ các thông tin cá nhân lần đầu trước khi tham gia nền tảng.
- **Edit Profile (`/profile/edit`)**: Màn hình cho phép người dùng thay đổi chỉnh sửa tiểu sử, thông tin cá nhân.
- **My Profile (`/profile/me`)**: Màn hình xem và quản lý hồ sơ cá nhân của mình, cho phép tải lên và xóa hình ảnh cá nhân.
- **Discover (`/discover`)**: Trang khám phá cốt lõi dành cho USER. Tại đây, người dùng có thể:
  - Xem danh sách các Partner (thẻ hiển thị sơ lược).
  - Tương tác (Swipe) Thích/Bỏ qua (Like/Dislike).
  - Mở các Popup xem chi tiết lịch khả dụng của Partner để lên lịch gặp.
- **Match Detail (`/match/:id`)**: Trang hiển thị thông tin chi tiết đầy đủ của một Partner cụ thể đã được người dùng tìm thấy, kèm theo một biểu đồ Lịch/Lịch hẹn (Calendar) thân thiện để Submit đặt lịch.

### 3. Các Trang Dành Cho Đối Tác (PARTNER)
- **Partner Register (`/partner/register`)**: Trang đăng ký dành cho một USER thông thường muốn nâng cấp trở thành PARTNER. Yêu cầu nhập các thông tin chuyên môn, mức phí (giá) thời gian phục vụ, và Submit lên hệ thống để Admin duyệt.
- **Partner Profile (`/partner/me`)**: Màn hình hồ sơ và quản lý đặc biệt chỉ dành cho role PARTNER. Cung cấp các công cụ như xem lịch/thời gian đã cấu hình, thông báo trạng thái hồ sơ của hành nghề của họ đang bị (Pending), đã đựợc (Approved), hoặc bị (Rejected).

### 4. Các Trang Dành Cho Quản Trị Viên (ADMIN)
- **Admin Dashboard (`/admin/dashboard`)**: Trang quản trị chính dành cho Admin.
  - Theo dõi tổng quan số lượng các đối tác đang ở các trạng thái.
  - Xem danh sách các USER vừa nộp đơn xin làm PARTNER.
  - Nút Action hỗ trợ tính năng Duyệt (Approve) hoặc Từ chối (Reject) ngay trên bảng.

### 5. Xử Lý Khác
- **NotFound (`*`)**: Trang lỗi 404, hiển thị thông báo thân thiện khi người dùng vô tình truy cập vào đường link không tồn tại.

---

## 🔒 Luồng Bảo Mật (Routing Guard)
- **`ProtectedRoute`**: Thành phần bọc quanh các trang cần yêu cầu đăng nhập (Discover, Profile, Admin Dashboard, v.v.). Nếu không có Token (chưa đăng nhập), người dùng lập tức bị điều hướng về `/login`.  
  Nhờ có Context, nó còn giúp ngăn chặn việc một người dùng bình thường cố tình gõ link vào trang `/admin/dashboard` bằng cách redirect về trang chủ nếu role không phù hợp.
