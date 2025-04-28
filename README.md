# Project Overview

This project consists of a **React frontend** and a **FastAPI backend**. The backend integrates with various LLMs (e.g., OpenAI, Anthropic, Google Gemini) to provide conversational AI capabilities. The frontend serves as a chat interface for interacting with the backend.

---

## Prerequisites

- **Docker**: Ensure Docker and Docker Compose are installed on your system.
- **Node.js**: Required for running the frontend locally.
- **Python**: Required for running the backend locally.

---

## Steps to Run Using Docker

1. Navigate to the root directory of the project.
2. Build and run the Docker containers:
   ```bash
   docker-compose up --build
   ```
3. Stop the containers:
   ```bash
   docker-compose down
   ```

### Access the Services
- **Backend (FastAPI)**: [http://localhost:8000](http://localhost:8000)
- **Frontend (React)**: [http://localhost:3000](http://localhost:3000)
- **Mongo Express**: [http://localhost:8081](http://localhost:8081) (Username: `myuser`, Password: `mypassword`)

---

## Docker Image Building (Optional)
If you want to build the Docker images manually:

### 1. Frontend
```bash
cd frontend
docker build -t react-llm-chat-app-frontend:latest .
```

### 2. Backend
```bash
cd backend
docker build -t react-llm-chat-app-backend:latest .
```

---

## Steps to Run Locally

### Backend (FastAPI)
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```
4. Access the API documentation at [http://localhost:8000/docs](http://localhost:8000/docs).

### Frontend (React)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
4. Access the frontend at [http://localhost:3000](http://localhost:3000).

---

## MongoDB Setup

### MongoDB in Docker
- MongoDB is included as a service in the `docker-compose.yml` file.
- The MongoDB service is configured with the following credentials:
  - **Username**: `admin`
  - **Password**: `adminpassword`
  - **Database**: `react_chat_app`

### Mongo Express
- Mongo Express is included for managing the MongoDB instance via a web interface.
- Access Mongo Express at [http://localhost:8081](http://localhost:8081) with the following credentials:
  - **Username**: `myuser`
  - **Password**: `mypassword`

---

## Environment Variables

### Backend
Create a `.env` file in the `backend` directory with the following content:
```bash
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
MONGO_URI=mongodb://admin:adminpassword@mongo:27017/react_chat_app?authSource=admin
```

### Docker Compose
Ensure the `.env` file is in the root directory for Docker Compose to load environment variables.

---

## Troubleshooting

### MongoDB Connection Issues
- Ensure the `MONGO_URI` in the `.env` file or `docker-compose.yml` is correctly configured:
  ```bash
  MONGO_URI=mongodb://admin:adminpassword@mongo:27017/react_chat_app?authSource=admin
  ```
- Restart the Docker containers:
  ```bash
  docker-compose down
  docker-compose up --build
  ```

### Access Issues with Mongo Express
- Verify that the `mongo-express` service is running:
  ```bash
  docker ps
  ```
- Check the logs for the `mongo-express` container:
  ```bash
  docker logs mongo-express
  ```

---
