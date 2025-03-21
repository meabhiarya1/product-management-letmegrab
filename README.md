# Product Management System - LetMeGrab

A comprehensive product management system designed to streamline the processes of adding, updating, and managing products efficiently.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Product Management**: Add, update, and delete products with ease.
- **Category & Material Linking**: Seamlessly associate products with their respective categories and materials.
- **User-Friendly Interface**: Intuitive design for a smooth user experience.

## Technologies Used

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Version Control**: Git

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/meabhiarya1/product-management-letmegrab.git
   cd product-management-letmegrab
   ```

2. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Configure the environment variables (see the section below).
   - Initialize the database:
     ```bash
     npm run init-db
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
    - Configure the environment variables (see the section below).
   - Start the frontend application:
     ```bash
     npm run dev
     ```

## Environment Variables Backened

Create a `.env` file in the `backend` directory and configure it according to your database setup:

```env
DB_HOST=localhost
DB_USER=your_database_user
DB_PASS=your_database_password
DB_NAME=product_management
PORT=5000
JWT_SECRET=secret
```

> **Note:** Replace `your_database_user` and `your_database_password` with your actual MySQL credentials.
> **Note:** Don't change any other thing
> **Note:** User and Database Tables all the things will be created Automatically 
    Email: admin@gmail.com
    Password: 123456

## Environment Variables Frontend

Create a `.env` file in the `frontend` directory and configure it according to your database setup:

```env
VITE_REACT_APP_BACKEND_URL=http://localhost:5000
```

## Usage

1. **Access the Application**:
   - Open your browser and navigate to `http://localhost:3000`.

2. **Managing Products**:
   - Use the navigation menu to add new products or update existing ones.
   - Ensure that each product is linked to the correct category and material.

## Contributing

We welcome contributions to enhance this project. To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m 'Add new feature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request detailing your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

