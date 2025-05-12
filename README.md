## V-Learn - Ứng dụng học từ vựng ngoại ngữ
V-Learn là một ứng dụng web giúp người dùng học từ vựng ngoại ngữ thông qua việc kiểm tra nhập từ tương ứng với nghĩa. Ứng dụng được xây dựng bằng React, TypeScript, Vite và Tailwind CSS.

## Tính năng chính
- **Đăng nhập đơn giản**: Đăng nhập bằng tên người dùng (dễ dàng tích hợp Firebase sau này)
- **Quản lý môn học**: Tạo, chỉnh sửa và xóa các môn học (project)
- **Quản lý bài học**: Tổ chức từ vựng thành các bài học trong từng môn học
- **Quản lý từ vựng**: Thêm, sửa, xóa từ vựng trong từng bài học
- **Nhập CSV**: Nhập danh sách từ vựng hàng loạt từ file CSV
- **Kiểm tra từ vựng**: Giao diện tương tác để kiểm tra kiến thức
- **Thống kê**: Hiển thị kết quả và phân tích sau mỗi bài kiểm tra

## Cách cài đặt
### Yêu cầu hệ thống

- Node.js (v14.0.0 trở lên)
- npm hoặc yarn

#### Bước 1: Clone dự án
-   ```bash
    git clone https://github.com/your-username/g-easy.git
    cd g-easy

#### Bước 2: Cài đặt dependencies
-   ```bash
    npm install
    # hoặc yarn

#### Bước 3: Chạy môi trường phát triển
-   ```bash
    npm run dev
    # hoặc yarn dev

#### Bước 4: Build cho môi trường production
-   ```bash
    npm run build
    # hoặc yarn build

## Hướng dẫn sử dụng
### 1. Đăng nhập

- Truy cập trang đăng nhập và nhập tên người dùng của bạn
- Hiện tại, chức năng đăng nhập chỉ lưu tên người dùng trong localStorage

### 2. Quản lý môn học

- Từ trang chủ, chọn "Kiểm tra từ mới" từ menu bên trái
- Tạo môn học mới bằng cách nhấn nút "Thêm môn học"
- Để sửa hoặc xóa môn học, sử dụng các biểu tượng tương ứng

### 3. Quản lý bài học

- Chọn một môn học để xem danh sách bài học
- Tạo bài học mới bằng cách nhấn nút "Thêm bài học"
- Để sửa hoặc xóa bài học, sử dụng các biểu tượng tương ứng

### 4. Quản lý từ vựng

- Chọn một bài học để xem danh sách từ vựng
- Thêm từ mới thủ công hoặc nhập từ file CSV
- Có thể trộn ngẫu nhiên danh sách từ vựng

### 5. Kiểm tra từ vựng

- Nhấn nút "Bắt đầu" để bắt đầu kiểm tra
- Nhập từ tương ứng với nghĩa được hiển thị
- Sử dụng nút "Kiểm tra" hoặc phím Enter để kiểm tra câu trả lời
- Tiếp tục với các từ tiếp theo hoặc kết thúc bài kiểm tra

### 6. Xem kết quả

- Sau khi kết thúc bài kiểm tra, xem thống kê chi tiết
- Tỷ lệ chính xác, số từ đúng/sai
- Danh sách đầy đủ các từ với kết quả tương ứng

## Định dạng file CSV
- Để nhập từ vựng từ file CSV, hãy sử dụng định dạng sau: 
    ``` text
    từ gốc, loại từ, nghĩa
    dog, noun, con chó
    run, verb, chạy
    beautiful, adjective, đẹp