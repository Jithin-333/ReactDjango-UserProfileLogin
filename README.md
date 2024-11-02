# React-Django Authentication System

This project is a **User Authentication System** built with **React** for the frontend and **Django** for the backend. It includes functionalities for user login, registration, profile viewing, and profile picture uploads, along with an admin panel for managing users. The system uses **JWT (JSON Web Tokens)** for secure authentication and **Redux** for global state management on the frontend.

## Features

### User Features
- **User Registration**: Create an account with basic information.
- **Login and JWT Authentication**: Secure login with JWT.
- **Profile Viewing**: Users can view their profile details.
- **Profile Picture Upload**: Upload a profile picture to personalize the profile.
- **Protected Routes**: Pages are secured with JWT-based authentication.

### Admin Features
- **User List**: View a list of all registered users.
- **User Search**: Search users by name or email.
- **User Creation**: Create new users directly from the admin panel.
- **User Editing**: Edit user information, including name, email, and profile picture.
- **User Deletion**: Remove users from the system.

## Technology Stack

- **Frontend**: React, Redux for state management
- **Backend**: Django and Django REST Framework (DRF) for API endpoints
- **Authentication**: JWT (JSON Web Tokens) for secure user authentication
- **Database**: PostgreSQL (or any preferred relational database)
- **Image Handling**: Django for media storage, React for uploading and displaying images

## Installation

### Backend Setup (Django)

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/react-django-auth.git
   cd react-django-auth/backend
