# DevConnect: Professional Networking Platform

## Project Overview

DevTinder is a professional networking platform designed to connect developers, allowing users to create profiles, send connection requests, and manage professional interactions.

## 🚀 Features

### User Management
- User Registration
- Profile Creation
- Authentication
- Profile Editing
- Password Management

### Connection Management
- Send Connection Requests
- Accept/Reject Requests
- View Connections
- Personalized User Feed

## 🛠 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Tokens)
- Bcrypt (Password Hashing)
- Cookie-based Sessions

### Validation
- Validator.js
- Custom Validation Middleware

## 📦 Project Structure

```
project-root/
│
├── config/
│   └── database.js        # MongoDB connection
│
├── middlewares/
│   └── auth.js            # Authentication middleware
│
├── models/
│   ├── user.js            # User data model
│   └── connectionRequest.js # Connection request model
│
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── profile.js         # Profile management routes
│   ├── request.js         # Connection request routes
│   └── user.js            # User interaction routes
│
├── utils/
│   └── validate.js        # Validation utilities
│
└── server.js              # Main application file
```

## 🔐 Authentication Flow

1. User Registration
   - Validate email and password
   - Hash password
   - Create user profile

2. User Login
   - Verify credentials
   - Generate JWT token
   - Set authentication cookie

3. Protected Routes
   - Middleware validates JWT
   - Attach user information to request
   - Allow/deny access

## 📋 API Endpoints

### Authentication
- `POST /signup`: User Registration
- `POST /login`: User Login
- `POST /logout`: User Logout

### Profile
- `POST /profile/view`: View Profile
- `PATCH /user/edit`: Update Profile
- `DELETE /user/deleteUser`: Delete User
- `PATCH /forgetPassword`: Reset Password

### Connections
- `POST /request/send/:status/:toUserId`: Send Connection Request
- `POST /request/review/:status/:requestId`: Review Connection Request
- `GET /user/request/received`: View Received Requests
- `GET /user/connections`: List Connections
- `GET /feed`: Discover Users

## 📦 Database Models

### User Model
- Basic Information
- Authentication Details
- Profile Metadata
- Skills

### Connection Request Model
- Sender and Recipient
- Request Status
- Relationship Tracking

## 🔒 Security Features

- JWT Authentication
- Password Hashing
- Email Validation
- Strong Password Requirements
- Protected Routes
- Data Sanitization

## 📦 Prerequisites

- Node.js (v14+ recommended)
- MongoDB Atlas Account
- npm or yarn

## 🚀 Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/devtinder.git
   ```

2. Install Dependencies
   ```bash
   npm install
   ```

3. Create `.env` File
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Run the Application
   ```bash
   npm start
   ```

## 🤝 Contribution Guidelines

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT token generation
- `PORT`: Server running port (default: 3000)

## 🔍 Future Enhancements

- Real-time Messaging
- Advanced Search Filters
- Skill Endorsements
- Profile Recommendations

## 📜 License

This project is licensed under the MIT License.


## 🐛 Reporting Issues

Please report issues via GitHub Issues with detailed information.
