# 📚 Online Book Store - Backend

A RESTful backend API for an **Online Book Store**, where users can browse, search, purchase books, and manage their accounts. The application includes secure authentication, payment integration, and efficient database management.

---

## 🚀 Features

- 🔐 User Authentication using JWT
- 🔒 Password Hashing with bcrypt
- 👤 User Registration & Login
- 📚 Browse and Search Books
- 🛒 Add Books to Cart
- ❤️ Wishlist Management
- 💳 Razorpay Payment Integration
- 📦 Order Management
- 🗄️ MongoDB Database
- 🌐 RESTful APIs
- ⚡ Error Handling & Validation

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB Atlas**
- **Mongoose**
- **JWT (JSON Web Token)**
- **bcrypt**
- **Razorpay Payment Gateway**
- **Webhook Integration**

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/parveshqaiser/book-store-backend.git
```

### 2. Navigate to the project

```bash
cd book-store-backend
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create a `.env` file

```env
PORT=7070

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

WEBHOOK_SECRET=your_webhook_secret
```

---

## ▶️ Run the Server

Development

```bash
npm run dev
```

Production

```bash
npm start
```

The server will start at:

```
http://localhost:7070
```

---


## 💳 Razorpay Integration

The application supports:

- Create Payment Order
- Verify Payment Signature
- Razorpay Webhooks
- Secure Payment Verification


## 📌 Future Improvements

- Product Reviews & Ratings
- Admin Dashboard
- Inventory Management
- Email Notifications
- Search Filters
- Coupon System
- Order Tracking
- Docker Support
- Unit & Integration Testing

---

## 👨‍💻 Author

Developed with ❤️ using Node.js, Express.js, MongoDB, and Razorpay.