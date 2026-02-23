# Dating App Frontend – Antigravity

## 1. Giới thiệu

Frontend được xây dựng bằng **Antigravity** để phục vụ website Dating App.

Chức năng chính:

- Đăng ký / Đăng nhập
- Lưu JWT Token
- Tạo & cập nhật User Profile
- Hiển thị thông tin User + Photos

Backend sử dụng **Spring Boot REST API**.

Base URL:

```
http://localhost:8080/api
```

---

## 2. Authentication Flow

### 2.1 Register

**Endpoint**

```
POST /auth/register
```

**Request Body**

```json
{
  "email": "user@gmail.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

**Response**

```json
{
  "code": 200,
  "message": "OK",
  "data": "jwt_token_string"
}
```

---

### 2.2 Login

**Endpoint**

```
POST /auth/login
```

**Request Body**

```json
{
  "email": "user@gmail.com",
  "password": "123456"
}
```

**Response**

```json
{
  "code": 200,
  "message": "OK",
  "data": "jwt_token_string"
}
```

---

### 2.3 Lưu Token

Sau khi login/register:

- Lưu token vào `localStorage`

```js
localStorage.setItem("token", response.data);
```

- Gắn vào header cho các request sau:

```js
Authorization: Bearer <token>
```

---

## 3. User Profile

### 3.1 Create / Update Profile

**Endpoint**

```
POST /user/{id}/profile
```

**Headers**

```
Authorization: Bearer <token>
```

**Request Body**

```json
{
  "phoneNumber": "0123456789",
  "firstName": "Hao",
  "lastName": "Phu",
  "displayName": "HaoPhu",
  "birthday": "2000-01-01",
  "gender": "MALE",
  "bio": "Hello world",
  "city": "Ho Chi Minh",
  "country": "Vietnam",
  "occupation": "Developer",
  "company": "ABC Corp",
  "school": "HCMUT",
  "heightCm": 170,
  "drinkingHabit": "SOCIAL",
  "smokingHabit": "NO",
  "zodiacSign": "ARIES",
  "interestedIn": "FEMALE",
  "minAgePreference": 18,
  "maxAgePreference": 30
}
```

---

### 3.2 Get User Profile

**Endpoint**

```
GET /user/{id}/profile
```

**Response – UserResponse**

```json
{
  "id": 1,
  "email": "user@gmail.com",
  "phoneNumber": "0123456789",
  "enabled": true,
  "emailVerified": true,
  "authProvider": "LOCAL",
  "role": "USER",
  "lastLogin": "2026-02-23T10:00:00",
  "createdAt": "2026-02-20T08:00:00",
  "profile": {
    "firstName": "Hao",
    "displayName": "HaoPhu",
    "birthday": "2000-01-01",
    "gender": "MALE",
    "bio": "Hello world"
  },
  "photos": []
}
```

---

## 4. Danh sách Pages cần tạo

### 4.1 Auth Pages

| Page     | Path        | Chức năng |
| -------- | ----------- | --------- |
| Login    | `/login`    | Đăng nhập |
| Register | `/register` | Đăng ký   |

---

### 4.2 User Pages

| Page           | Path              | Chức năng       |
| -------------- | ----------------- | --------------- |
| Create Profile | `/profile/create` | Tạo hồ sơ       |
| Edit Profile   | `/profile/edit`   | Chỉnh sửa hồ sơ |
| My Profile     | `/profile/me`     | Xem hồ sơ       |

---

## 5. Axios Client Config

```js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
```

---

## 7. Auth Service

```js
import axiosClient from "../utils/axiosClient";

export const login = (data) => axiosClient.post("/auth/login", data);

export const register = (data) => axiosClient.post("/auth/register", data);
```

---

## 8. User Service

```js
import axiosClient from "../utils/axiosClient";

export const createProfile = (userId, data) =>
  axiosClient.post(`/user/${userId}/profile`, data);

export const getMyProfile = (userId) =>
  axiosClient.get(`/user/${userId}/profile`);
```

---

## 9. Validation Mapping (Frontend)

Match backend validation:

| Field          | Rule              |
| -------------- | ----------------- |
| Email          | Required + format |
| Password       | Min 6 chars       |
| First Name     | Required          |
| Birthday       | Past date         |
| Height         | 50 → 300 cm       |
| Age Preference | 18 → 50           |

---

## 10. Future Enhancements

- Upload Photos API
- Matching / Swipe UI
- Distance filtering
- Realtime chat (WebSocket / SignalR)
- AI recommendation

---

## 11. Run Project

```bash
npm install
npm run dev
```

---

## 12. Notes

- Luôn check token trước khi vào protected pages
- Handle 401 → redirect login
- Refresh profile sau khi create/update

---
