# React LLM Chat Application

This project is a React application that provides an interface for chatting with various Large Language Models (LLMs) using a FastAPI backend. Currently, it supports integration with OpenAI, Gemini, and Claude.

## Project Structure

```
react-llm-chat-app
├── backend
│   ├── app
│   │   ├── main.py
│   │   ├── routers
│   │   │   ├── openai.py
│   │   │   ├── gemini.py
│   │   │   └── claude.py
│   │   └── models
│   │       └── __init__.py
│   ├── requirements.txt
│   └── README.md
├── frontend
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── components
│   │   │   ├── ChatInterface.tsx
│   │   │   └── LLMSelector.tsx
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── services
│   │       └── api.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- Python (version 3.7 or higher)
- FastAPI
- Required libraries for LLM integrations

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/react-llm-chat-app.git
   cd react-llm-chat-app
   ```

2. Set up the backend:

   - Navigate to the `backend` directory:
     ```
     cd backend
     ```
   - Install the required Python packages:
     ```
     pip install -r requirements.txt
     ```

3. Set up the frontend:

   - Navigate to the `frontend` directory:
     ```
     cd frontend
     ```
   - Install the required Node.js packages:
     ```
     npm install
     ```

### Running the Application

1. Start the FastAPI backend:

   ```
   cd backend/app
   uvicorn main:app --reload
   ```

2. Start the React frontend:

   ```
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000` to access the chat application.

## Usage

- Use the LLM Selector to choose which model you want to chat with.
- Enter your message in the chat interface and receive responses from the selected LLM.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License. See the LICENSE file for details.