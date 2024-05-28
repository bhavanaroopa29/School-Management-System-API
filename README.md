
---

# School Management System API

This API allows you to manage a school system with functionalities for registering teachers and students, adding classes, and performing CRUD operations on these entities.

## Table of Contents

- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
  - [Teacher Registration](#teacher-registration)
  - [Teacher Login](#teacher-login)
  - [Add Class](#add-class)
  - [Register Student](#register-student)
  - [Retrieve Students](#retrieve-students)
  - [Delete Class](#delete-class)
  - [Delete Student](#delete-student)
- [Sample Data](#sample-data)
- [Running the Server](#running-the-server)

## Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/school-management-system.git
    cd school-management-system
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Start the server:**
    ```bash
    npm start
    ```

    The server will run on `http://localhost:7000`.

## API Endpoints

### Teacher Registration

- **Endpoint:** `POST /register/teacher`
- **Description:** Register a new teacher.
- **Request Body:**
    ```json
    {
      "name": "Amit Kumar",
      "email": "amit.kumar@example.com",
      "password": "password123",
      "address": "456 Oak Street"
    }
    ```
- **Response:**
    ```json
    {
      "teacher": { /* teacher object */ },
      "token": "jwt_token"
    }
    ```

### Teacher Login

- **Endpoint:** `POST /login/teacher`
- **Description:** Log in as a teacher.
- **Request Body:**
    ```json
    {
      "email": "amit.kumar@example.com",
      "password": "password123"
    }
    ```
- **Response:**
    ```json
    {
      "teacher": { /* teacher object */ },
      "token": "jwt_token"
    }
    ```

### Add Class

- **Endpoint:** `POST /classes`
- **Description:** Add a new class. Requires teacher authentication.
- **Headers:**
    ```
    Authorization: Bearer <teacher_jwt>
    ```
- **Request Body:**
    ```json
    {
      "standard": "5th Grade",
      "section": "B",
      "teacher": "<valid_teacher_id>"
    }
    ```
- **Response:**
    ```json
    {
      "newClass": { /* class object */ },
      "message": "Class added successfully"
    }
    ```

### Register Student

- **Endpoint:** `POST /register/student`
- **Description:** Register a new student.
- **Headers:**
    ```
    Authorization: Bearer <teacher_jwt>
    ```
- **Request Body:**
    ```json
    {
      "firstName": "Priya",
      "lastName": "Sharma",
      "email": "priya.sharma@example.com",
      "password": "password123",
      "parentName": "Raj Sharma",
      "address": "123 Main St",
      "city": "Mumbai",
      "classId": "<valid_class_id>"
    }
    ```
- **Response:**
    ```json
    {
      "student": { /* student object */ },
      "token": "jwt_token"
    }
    ```

### Retrieve Students

- **Endpoint:** `GET /students`
- **Description:** Retrieve all students. Requires teacher authentication.
- **Headers:**
    ```
    Authorization: Bearer <teacher_jwt>
    ```
- **Response:**
    ```json
    [
      { /* student object */ },
      { /* student object */ },
      ...
    ]
    ```

### Delete Class

- **Endpoint:** `DELETE /classes/:id`
- **Description:** Delete a class by its ID. Requires teacher authentication.
- **Headers:**
    ```
    Authorization: Bearer <teacher_jwt>
    ```
- **Response:**
    ```json
    {
      "message": "Class deleted successfully"
    }
    ```

### Delete Student

- **Endpoint:** `DELETE /students/:id`
- **Description:** Delete a student by their ID. Requires teacher authentication.
- **Headers:**
    ```
    Authorization: Bearer <teacher_jwt>
    ```
- **Response:**
    ```json
    {
      "message": "Student deleted successfully"
    }
    ```

## Sample Data

### Valid Teacher ID
Use the ID returned from the teacher registration endpoint.

### Valid Class ID
Use the ID returned from the class creation endpoint.

## Running the Server

1. **Start MongoDB:**
    Make sure MongoDB is running on your machine. The default connection string is `mongodb://127.0.0.1:27017/school`.

2. **Start the server:**
    ```bash
    npm start
    ```

Now your API is ready to use with the above endpoints!

---

This README structure provides detailed instructions and examples for using your API endpoints with different scenarios, ensuring a comprehensive guide for users to follow.
