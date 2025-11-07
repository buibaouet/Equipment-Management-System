# 🧩 Tài liệu mô tả Phân cấp người dùng hệ thống quản lý thiết bị

Hệ thống quản lý thiết bị được thiết kế nhằm hỗ trợ doanh nghiệp trong việc theo dõi, quản lý và vận hành các thiết bị nội bộ.  
Người dùng được phân chia theo 3 cấp độ quyền hạn chính: **User**, **Quản lý dự án (Manager)** và **Admin**.

Mỗi nhóm người dùng sẽ có quyền hạn, chức năng và giới hạn thao tác khác nhau trong hệ thống.

---

### 1. **User**
**Tài khoản mẫu:**  
- Username: `user01`  
- Mật khẩu: `Abc@123x`  

#### Chức năng chính
- **Đăng ký tài khoản**  
- **Đăng nhập / Đăng xuất / Đổi mật khẩu / Cập nhật thông tin cá nhân**

#### Quản lý thiết bị
- **Danh sách thiết bị:**  
  - Chỉ được phép xem toàn bộ danh sách thiết bị (không được thêm, sửa).  
  - Có thể thực hiện **mượn** hoặc **trả** thiết bị ngay tại màn hình này.  
  - Khi thao tác mượn/trả, hệ thống tự động **chuyển hướng** sang màn hình *Mượn - Trả thiết bị*.

- **Thiết bị của tôi:**  
  - Bao gồm:
    - Thiết bị **thuộc sở hữu của người dùng**.
    - Thiết bị **đang được mượn**.  
  - Cho phép:
    - **Trả thiết bị** (nếu đang mượn).  
    - **Báo hỏng / Bảo dưỡng** (nếu là thiết bị sở hữu).

- **Mượn - Trả thiết bị:**  
  - Hiển thị **lịch sử mượn - trả thiết bị**.  
  - Các trạng thái:
    - Chờ duyệt mượn  
    - Từ chối mượn  
    - Đang mượn  
    - Đã trả  
  - Chức năng:
    - **Mượn thiết bị:**  
      - Chỉ được mượn thiết bị **đang hoạt động** và **chưa bị ai mượn**.  
      - Khi tạo yêu cầu, cần nhập ngày hẹn trả → gửi duyệt cho người sở hữu hoặc quản lý.  
    - **Trả thiết bị:**  
      - Chọn trạng thái trả:
        - Đã hỏng  
        - Còn sử dụng tốt  
        - Hỏng một phần  

- **Duyệt yêu cầu mượn:**  
  - Được phép duyệt hoặc từ chối **các yêu cầu mượn** thiết bị của người khác (mượn các thiết bị thuộc quyền sở hữu của mình).  

---

### 2. **Quản lý dự án (Manager)**
**Tài khoản mẫu:**  
- Username: `manager`  
- Mật khẩu: `Abc@123x`

#### Chức năng chính
- **Đăng nhập / Đăng xuất / Đổi mật khẩu / Cập nhật thông tin cá nhân**

#### Quản lý thiết bị
- **Danh sách thiết bị:**  
  - Được phép **xem toàn bộ thiết bị**.  
  - Có thể **thêm mới / chỉnh sửa** thiết bị **thuộc dự án mình quản lý**.  
  - Khi thêm thiết bị, hệ thống tự động:
    - Gán **dự án mặc định** của người quản lý.
  - Cho phép thao tác **mượn / trả thiết bị** và chuyển hướng sang màn *Mượn - Trả thiết bị* khi cần.

- **Thiết bị của tôi:**  
  - Gồm:
    - Thiết bị sở hữu của người quản lý.  
    - Thiết bị đang được mượn.  
  - Cho phép:
    - Trả thiết bị đang mượn.  
    - Báo hỏng hoặc gửi yêu cầu bảo dưỡng đối với thiết bị sở hữu.

- **Mượn - Trả thiết bị:**  
  - Hiển thị **toàn bộ lịch sử mượn - trả** 
  - Các trạng thái:
    - Chờ duyệt mượn  
    - Từ chối mượn  
    - Đang mượn  
    - Đã trả
  - Chức năng:
    - **Mượn thiết bị:**  
      - Mượn thiết bị đang hoạt động và chưa bị ai mượn.  
      - Có ngày hẹn trả, gửi duyệt cho người sở hữu hoặc quản lý cấp trên.  
    - **Trả thiết bị:**  
      - Nhập tình trạng (Đã hỏng / Sử dụng tốt / Hỏng một phần)

- **Duyệt yêu cầu mượn:**  
  - Được duyệt / từ chối:
    - Yêu cầu mượn thiết bị **của người khác**.  
    - Yêu cầu **thuộc dự án mình quản lý**.  

- **Bảo dưỡng thiết bị:**  
  - Tạo **ticket bảo dưỡng** cho thiết bị thuộc dự án.  
  - Bao gồm:
    - Lý do bảo dưỡng.  
    - Ngày bắt đầu - Ngày kết thúc.  
  - Được phép chỉnh sửa thông tin ticket.

---

### 3. **Admin**
**Tài khoản mẫu:**  
- Username: `admin`  
- Mật khẩu: `Abc@123x`

#### Chức năng chính
- **Đăng nhập / Đăng xuất / Đổi mật khẩu / Cập nhật thông tin cá nhân**

#### Quản lý hệ thống
- **Danh sách thiết bị:**  
  - Toàn quyền thao tác: thêm, sửa, xóa.  
  - Cập nhật trạng thái thiết bị (hỏng, bảo dưỡng, đang hoạt động, …).  
  - Xuất danh sách thiết bị **đầy đủ thông tin & trạng thái**.

- **Duyệt yêu cầu mượn:**  
  - Có quyền **duyệt tất cả các yêu cầu mượn thiết bị** của toàn bộ người dùng trong hệ thống.

- **Bảo dưỡng thiết bị:**  
  - Quản lý toàn bộ ticket bảo dưỡng.  
  - Cho phép tạo, chỉnh sửa các ticket cho **mọi thiết bị trong hệ thống**.

- **Danh mục thiết bị:**  
  - Quản lý danh mục (thêm / sửa / xóa).

- **Phòng ban:**  
  - Quản lý danh sách phòng ban (thêm / sửa / xóa).

- **Người dùng:**  
  - Cập nhật thông tin người dùng, bao gồm:
    - Vai trò (Role).  
    - Dự án trực thuộc.

---

## 3. Tóm tắt quyền hạn theo cấp người dùng

| Chức năng | User | Quản lý dự án | Admin |
|------------|:----:|:-------------:|:-----:|
| Đăng nhập / Đăng xuất / Đổi mật khẩu | ✅ | ✅ | ✅ |
| Cập nhật thông tin cá nhân | ✅ | ✅ | ✅ |
| Xem danh sách thiết bị | ✅ | ✅ | ✅ |
| Thêm / Sửa / Xóa thiết bị | ❌ | ✅ (trong dự án) | ✅ (toàn hệ thống) |
| Mượn / Trả thiết bị | ✅ | ✅ | ✅ |
| Duyệt yêu cầu mượn / trả | ✅ (có giới hạn) | ✅ (trong dự án) | ✅ (tất cả) |
| Quản lý bảo dưỡng thiết bị | ❌ | ✅ (trong dự án) | ✅ (toàn hệ thống) |
| Quản lý danh mục thiết bị | ❌ | ❌ | ✅ |
| Quản lý phòng ban | ❌ | ❌ | ✅ |
| Quản lý người dùng | ❌ | ❌ | ✅ |

---