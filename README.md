I. Mô tả dự án
Dự án “Ứng dụng Quản lý Người Dùng” (User Management System) được xây dựng nhằm giúp người dùng quản lý danh sách cá nhân một cách hiệu quả.

 Chức năng chính:
- Hiển thị danh sách người dùng từ cơ sở dữ liệu (MongoDB)
- Thêm mới người dùng với kiểm tra hợp lệ (validation)
- Sửa thông tin người dùng trực tiếp trên giao diện
- Xóa người dùng khỏi danh sách

Dự án áp dụng mô hình Full-Stack Web Application, gồm Frontend (React) và Backend API (Node.js + Express) giao tiếp qua REST API, dữ liệu lưu trữ trên MongoDB Atlas.

 II. Công nghệ sử dụng
- Ngôn ngữ lập trình: JavaScript  
- Backend: Node.js, Express.js  
- Frontend: ReactJS, Axios  
- Cơ sở dữ liệu: MongoDB Atlas (Cloud)  
- Công cụ hỗ trợ: Git, GitHub, Postman, VS Code  
- Thư viện hỗ trợ khác: dotenv, cors, mongoose, nodemon  

 III. Hướng dẫn chạy dự án

    a. Chạy Backend
      1. Mở thư mục `backend`
      2. Cài thư viện:  
       npm install
      3. Tạo file `.env` (theo mẫu `.env.example`) với nội dung:  
      PORT=3000
      MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/groupDB
      CORS_ORIGIN=http://localhost:3000

 IV. Khởi động server:  
       npm run dev
 V. Kiểm tra bằng trình duyệt: [http://localhost:3000/health](http://localhost:3000/health)

    b. Chạy Frontend
    1. Mở thư mục `frontend`
    2. Cài thư viện:  
      npm install
    3. Tạo file `.env` với nội dung:  
      REACT_APP_API=http://localhost:3000
    4. Khởi động giao diện:  
      npm start
Sau khi chạy, giao diện hiển thị danh sách người dùng, có thể thêm, sửa, xóa trực tiếp và dữ liệu được lưu vào MongoDB.

 VI. Đóng góp từng thành viên
 Cao Quang Thịnh (Backend): Xây dựng server Node.js, định nghĩa routes, controllers, xử lý API CRUD và kết nối MongoDB
 Phạm Huỳnh Như (Frontend): Thiết kế giao diện React, tạo component, kết nối API, xử lý state và validation
 Lê Nhật Duy (Database): Cấu hình MongoDB Atlas, tạo collection, hỗ trợ test dữ liệu, thiết lập biến môi trường
