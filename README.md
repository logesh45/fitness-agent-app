# Personalized Fitness App

This is a full-stack web application that generates personalized fitness plans for users based on their age, goals, and experience level. The backend is built with Flask and the frontend is a React application.

## Features

- User profile creation and updates
- Dynamic fitness options based on user's age
- Personalized workout plan generation
- Interactive dashboard to view workout plans

## Getting Started

### Prerequisites

- Python 3.x
- Node.js and npm

### Backend Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```sh
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

3.  **Set up environment variables:**
    Copy the example `.env.example` to `.env` and fill in the required values.

4.  **Run database migrations:**
    ```sh
    flask db upgrade
    ```

5.  **Start the backend server:**
    ```sh
    python run.py
    ```

### Frontend Setup

1.  **Navigate to the project root directory (if you are in the `backend` directory):**
    ```sh
    cd ..
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Start the frontend development server:**
    ```sh
    npm run dev
    ```

## Technologies Used

- **Backend:** Flask, Python
- **Frontend:** React, Tailwind CSS
- **Database:** SQLite (or as configured)




- **Personalized User Profiles**: Users can create a detailed profile with their fitness goals, available equipment, preferred workout types, and experience level.
- **Dynamic Workout Generation**: The backend uses a set of intelligent agents to create customized workout plans tailored to each user's profile.
- **Interactive Frontend**: A responsive React frontend allows for easy profile setup and management.
- **RESTful API**: A robust Flask backend provides a clear and scalable API for all application services.

## Tech Stack

- **Frontend**: React, Vite, `react-router-dom`, Tailwind CSS
- **Backend**: Python, Flask, SQLAlchemy, Alembic, Pydantic

## Project Structure

```
/fitness-app
├── backend/         # Flask API and business logic
│   ├── app/         # Core application files, including routes and agents
│   ├── migrations/  # Database migration scripts
│   ├── run.py       # Application entry point
│   └── requirements.txt
├── src/             # React frontend source code
│   ├── components/  # Reusable React components
│   ├── App.jsx      # Main application component with routing
│   └── main.jsx     # Frontend entry point
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.x & pip

### Backend Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

3.  **Install dependencies:**
    ```sh
    pip install -r requirements.txt
    ```

4.  **Set up environment variables:**
    Copy the example `.env.example` to `.env` and fill in the required values.

5.  **Run database migrations:**
    ```sh
    flask db upgrade
    ```

6.  **Start the backend server:**
    ```sh
    python run.py
    ```

### Frontend Setup

1.  **Navigate to the root directory:**
    ```sh
    cd ..
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Start the frontend development server:**
    ```sh
    npm run dev
    ```

The application should now be running and accessible in your browser.

## API Endpoints

The backend exposes the following RESTful endpoints:

- `POST /api/profiles`: Create a new user profile.
- `GET /api/profiles/<uuid>`: Retrieve a user profile by ID.
- `PUT /api/profiles/<uuid>`: Update an existing user profile.
- `POST /api/profiles/<uuid>/workout-plan`: Generate a new workout plan for a user.
- `GET /api/profiles/<uuid>/workout-plan`: Retrieve the latest workout plan for a user.


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
