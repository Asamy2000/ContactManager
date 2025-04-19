
# 📇 Contact Manager (ASP.NET Core MVC)

A clean, modern contact management system built with **ASP.NET Core MVC**, **Entity Framework Core**, **SignalR**, and **FluentValidation**.  
This project includes real-time contact editing locks, responsive UI, and a simple hardcoded authentication system.

---

## 🚀 Features

- ✅ Add, Edit, and Delete contacts
- 🔍 Live search and pagination
- 🔒 SignalR-powered contact locking (real-time conflict prevention)
- ✅ FluentValidation for robust server-side validation
- 🔐 Simple authentication with cookie-based login
- 🌈 Stylish UI with Bootstrap 5 and modern design elements

---

## 🛠 Technologies Used

- ASP.NET Core MVC (.NET 9)
- Entity Framework Core
- FluentValidation
- SignalR (real-time WebSocket)
- Bootstrap 5
- Moq / xUnit for testing

---

## 📦 Project Structure

```
├── Controllers/
│   ├── AccountController.cs
│   └── ContactsController.cs
├── Core/
│   ├── Entities/
│   ├── Interfaces/IAuthService.cs, IContactService.cs
│   └── Pagination/
├── Infrastructure/
│   ├── Data/AppDbContext.cs
│   ├── Services/HardcodedAuthService.cs, ContactService.cs
├── Hubs/
│   └── ContactHub.cs
├── Models/
│   └── LoginModel.cs
├── Views/
│   ├── Home/
│   ├── Account/
│   └── Contacts/
├── wwwroot/
│   └── css/, js/
├── Tests/
│   └── HardcodedAuthServiceTests.cs
└── Program.cs
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Asamy2000/ContactManager.git
cd contact-manager
```

### 2. Configure Database

Update `appsettings.json` or `secrets.json` with your connection string:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.;Database=ContactManagerDb;Trusted_Connection=True;"
}
```

### 3. Apply Migrations

```bash
dotnet ef database update
```

### 4. Run the App

```bash
dotnet run
```

Navigate to `https://localhost:7049` or `http://localhost:5241`.

---

## 🔑 Login Credentials

This project uses a simple **hardcoded authentication**:

| Username | Password |
|----------|----------|
| user1    | user1    |
| user2    | user2    |

---

## 🧪 Run Unit Tests

```bash
dotnet test
```

Tests cover:
- Authentication logic
- Contact CRUD operations
- Validation and pagination

---

## ✨ UI Highlights

- Responsive, modern layout
- Animated buttons and inputs
- Custom toasts, modals, and data grids
- Unified gradient theme

---

## 📌 Notes

- You can replace `HardcodedAuthService` with Identity or JWT-based auth for production.
- SignalR is used to prevent multiple users from editing the same contact at the same time.

---

## 📄 License

MIT License — free to use and modify.

---

## 👥 Author

Developed by [Ahmed Samy] • For collaboration or improvements, feel free to contribute or reach out!
