# Project Title: React LLM Chat Application

## Overview
This project is a chat application built using React for the frontend and FastAPI for the backend. It allows users to interact with various Large Language Models (LLMs) including OpenAI, Gemini, and Claude.

## Project Structure
The project is organized into two main directories: `backend` and `frontend`.

### Backend
- **app/main.py**: Entry point for the FastAPI application, initializing the app and including routers for LLM integrations.
- **app/routers/openai.py**: Routes for interacting with the OpenAI API.
- **app/routers/gemini.py**: Routes for interacting with the Gemini API.
- **app/routers/claude.py**: Routes for interacting with the Claude API.
- **app/models/__init__.py**: Contains data models for request and response schemas.
- **requirements.txt**: Lists dependencies required for the backend.
- **README.md**: Documentation for the backend setup and API usage.

### Frontend
- **public/index.html**: Main HTML file for the React application.
- **src/components/ChatInterface.tsx**: React component for the chat interface.
- **src/components/LLMSelector.tsx**: React component for selecting the LLM.
- **src/App.tsx**: Main React component that sets up the application structure.
- **src/index.tsx**: Entry point for the React application.
- **src/services/api.ts**: Functions for making API calls to the FastAPI backend.
- **package.json**: Configuration file for npm, listing dependencies and scripts.
- **tsconfig.json**: TypeScript configuration file.
- **README.md**: Documentation for the frontend setup and usage.

## Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory.
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Run the FastAPI application:
   ```
   uvicorn app.main:app --reload
   ```

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install the required dependencies:
   ```
   npm install
   ```
3. Start the React application:
   ```
   npm start
   ```

## Usage
- Open your browser and navigate to `http://localhost:3000` to access the chat application.
- Select the desired LLM from the dropdown and start chatting.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.