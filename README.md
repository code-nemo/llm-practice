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
3. Stop the containers
   ```bash
   docker-compose down
   ```

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

## Steps to Run Locally
### Backend (FastAPI)
Navigate to the backend directory, install dependencies and then start the FastAPI server 

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Access the API documentation at http://localhost:8000/docs.

### Frontend (React)
Navigate to the frontend directory, install dependencies and then start the React development server 

```bash
cd frontend
npm install
npm start
```
Access the frontend at http://localhost:3000

## Environment Variables
Create a `.env` file in the `backend` directory with the following content:
```bash
GEMINI_API_KEY=your_gemini_api_key
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

Docker Compose: Ensure the `.env` file is in the root directory for Docker Compose to load environment variables.