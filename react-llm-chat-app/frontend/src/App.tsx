import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import ChatInterface from './components/ChatInterface';
import LLMSelector from './components/LLMSelector';

const App: React.FC = () => {
    const [selectedLLM, setSelectedLLM] = useState<string>('OpenAI');
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

    const handleLLMChange = (llm: string) => {
        setSelectedLLM(llm);
    };

    const handleLogin = (username: string) => {
        setIsAuthenticated(true);
        setLoggedInUser(username); // Set the logged-in user's username
    };

    const handleLogout = (navigate: (path: string) => void) => {
        setIsAuthenticated(false);
        setLoggedInUser(null); // Clear the logged-in user's details
        navigate('/'); // Navigate to the login screen
    };

    return (
        <Router>
            <div>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f5f5f5' }}>
                    <h1>Chat with LLMs</h1>
                    {isAuthenticated && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <span>Welcome, {loggedInUser}</span>
                            <LogoutButton onLogout={handleLogout} />
                        </div>
                    )}
                </header>
                <main style={{ padding: '1rem' }}>
                    <Routes>
                        {!isAuthenticated ? (
                            <>
                                <Route path="/" element={<Login onLogin={handleLogin} />} />
                                <Route path="/signup" element={<Signup />} />
                            </>
                        ) : (
                            <>
                                <Route
                                    path="/chat"
                                    element={
                                        <>
                                            <LLMSelector onLLMChange={handleLLMChange} />
                                            <ChatInterface selectedLLM={selectedLLM} />
                                        </>
                                    }
                                />
                                <Route path="*" element={<Navigate to="/chat" />} />
                            </>
                        )}
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

interface LogoutButtonProps {
    onLogout: (navigate: (path: string) => void) => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout }) => {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        onLogout(navigate); // Pass the navigate function to the onLogout handler
    };

    return (
        <button onClick={handleLogoutClick} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
            Logout
        </button>
    );
};

export default App;