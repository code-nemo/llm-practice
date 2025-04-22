# README for Backend

# React LLM Chat Application - Backend

This is the backend component of the React LLM Chat Application, which integrates with various Large Language Models (LLMs) including OpenAI, Gemini, and Claude. The backend is built using FastAPI, providing a robust and efficient API for the frontend to interact with.

## Project Structure

- `app/main.py`: Entry point for the FastAPI application. Initializes the app and includes routers for different LLM integrations.
- `app/routers/openai.py`: Defines routes for interacting with the OpenAI API.
- `app/routers/gemini.py`: Defines routes for interacting with the Gemini API.
- `app/routers/claude.py`: Defines routes for interacting with the Claude API.
- `app/models/__init__.py`: Contains data models for request and response schemas for the LLM APIs.

## Requirements

To run the backend, you need to install the required dependencies. You can do this by running:

```
pip install -r requirements.txt
```

## Running the Application

To start the FastAPI application, run the following command:

```
uvicorn app.main:app --reload
```

This will start the server in development mode, and you can access the API at `http://127.0.0.1:8000`.

## API Usage

The backend provides endpoints for each LLM integration. You can interact with the APIs as follows:

- **OpenAI**: Access the OpenAI API through the `/openai` endpoint.
- **Gemini**: Access the Gemini API through the `/gemini` endpoint.
- **Claude**: Access the Claude API through the `/claude` endpoint.

Refer to the individual router files for specific endpoint details and request/response formats.

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request. We welcome contributions that improve the functionality and usability of the application.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.