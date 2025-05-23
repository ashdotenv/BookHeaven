# Book Haven

## Project Overview
Book Haven is a full-stack application designed for managing and exploring books. It consists of three main components:

1. **Client Frontend**: Built with React, TailwindCSS, and DaisyUI for a modern user interface.
2. **Admin Frontend**: A separate React-based interface for administrative tasks.
3. **Backend**: Built with ASP.NET Core, using Entity Framework Core for database management and PostgreSQL as the database.

## Dependencies

### Client Frontend
- **React**: ^19.0.0
- **React Router DOM**: ^7.5.0
- **Redux Toolkit**: ^2.6.1
- **TailwindCSS**: ^4.1.4
- **DaisyUI**: ^5.0.20

### Admin Frontend
- **React**: ^19.1.0
- **React Router DOM**: ^7.5.3
- **Redux Toolkit**: ^2.7.0
- **TailwindCSS**: ^4.1.5
- **DaisyUI**: ^5.0.35

### Backend
- **ASP.NET Core**: 8.0
- **Entity Framework Core**: 8.0.15
- **PostgreSQL**: 8.0.11
- **JWT Authentication**: 8.0.15

## Setup Guide

### Frontend (Client & Admin)
1. Install Node.js (v18+ recommended).
2. Navigate to the `client` or `Admin` directory.
3. Run `npm install` to install dependencies.
4. Start the development server with `npm run dev`.

### Backend
1. Install .NET SDK 8.0.
2. Navigate to the `server/Book-haven-top` directory.
3. Run `dotnet restore` to restore packages.
4. Configure the database connection in `appsettings.json`.
5. Run `dotnet run` to start the server.

## Backend Endpoints

### Admin
- **GET /api/admin/users**: Get all users (Admin only).
- **GET /api/admin/counts**: Get counts of users, books, and orders (Admin only).

### Authentication
- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Authenticate a user.
- **POST /api/auth/add-staff**: Add a staff member (Admin only).

### Books
- **GET /api/admin/books**: Get all books (Admin only).
- **POST /api/admin/books**: Add a new book (Admin only).

### Orders
- **POST /api/orders**: Place an order (Admin, User).

### User
- **POST /api/user/{userId}/cart/add/{bookId}**: Add a book to the user's cart.
- **DELETE /api/user/{userId}/cart/remove/{bookId}**: Remove a book from the user's cart.
- **POST /api/user/{userId}/bookmark/add/{bookId}**: Add a book to the user's bookmark.
- **DELETE /api/user/{userId}/bookmark/remove/{bookId}**: Remove a book from the user's bookmark.

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE file for details.