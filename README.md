# Task Manager – Full Stack Application
A full-stack Task Management System built using Spring Boot, React, and MySQL, featuring secure authentication, role-based access, and task assignment functionality.

# Features
## 🔐 Authentication & Security
* User Registration & Login
* JWT-based Authentication
* Role-based Authorization (ADMIN / USER)
* Secure password hashing using BCrypt

## 👤 User Features
* View personal tasks only
* Create, update, and delete tasks
* Track task status (PENDING, IN_PROGRESS, COMPLETED)
* Set task priority (LOW, MEDIUM, HIGH)
* Manage profile details

## 🛠️ Admin Features
* View all users
* Assign tasks to specific users
* Delete users (with confirmation)
* Update user roles (USER ↔ ADMIN)
* View all tasks

## 📊 Task Management
* Task assignment system
* Status tracking
* Priority management
* Due date handling

## 🎨 UI Features
* Built with React + Material UI
* Clean and responsive design
* Dashboard-based layout

# Tech Stack
## Backend
* Java
* Spring Boot
* Spring Security (JWT)
* Spring Data JPA (Hibernate)
*  MySQL
 
## Frontend
* React.js
* Material UI (MUI)
* Axios

# ⚙️ Installation & Setup
## 🔧 Backend Setup (Spring Boot)
### 1.Clone the repository
git clone https://github.com/Monali-Nalawade/task-manager-system.git
### 2.Navigate to backend folder
cd backend
### 3.Configure application.properties
spring.datasource.url=jdbc:mysql://localhost:3000/taskmanager
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
### 4.Run the application
mvn spring-boot:run

## 💻 Frontend Setup (React)
### 1.Navigate to frontend folder
cd frontend
### 2.Install dependencies
npm install
### 3.Start the app
npm start

# 🔐 API Authentication
 After login, a JWT token is generated
* Token is stored in localStorage
* Sent in headers for protected APIs:
Authorization: Bearer <your_token>

# 📁 Project Structure
```text
task-manager/
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   └── security/
├── frontend/
│   ├── components/
│   ├── pages/
│   └── services/
└── README.md
```

# Roles & Access
```text
Feature	       USER	ADMIN
View own tasks	  ✅	✅
Create task     	✅	✅
Assign tasks    	❌	✅
Delete users	    ❌	✅
Change roles	    ❌	✅
```

# Known Issues (Handled)
* Fixed JWT authentication issues (403 errors)
* Resolved task-user mapping issue
* Fixed enum case-sensitivity bug
* Removed large image storage issues

# Purpose -
This project demonstrates:
* Full-stack development
* Secure authentication (JWT)
* Role-based access control
* Real-world task management workflow
* Fixed localStorage quota errors

# Future Enhancements
* Email integration 
* File upload support 
* Task comments 
* Analytics dashboard 

# Author
Developed as a full-stack project for learning and portfolio purposes.

# Contribute
Feel free to fork this repository and contribute!
