import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import ChatInterface from './components/ChatInterface';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        // Retrieve authentication state from localStorage
        return localStorage.getItem('isAuthenticated') === 'true';
    });
    const [loggedInUser, setLoggedInUser] = useState<string | null>(() => {
        // Retrieve logged-in user from localStorage
        return localStorage.getItem('loggedInUser');
    });

    useEffect(() => {
        // Ensure `loggedInUser` is always synced with `localStorage`
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setLoggedInUser(storedUser);
        }
    }, []);

    const handleLogin = (username: string) => {
        setIsAuthenticated(true);
        setLoggedInUser(username);

        // Persist authentication state and user data in localStorage
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('loggedInUser', username);
    };

    const handleLogout = (navigate: (path: string) => void) => {
        setIsAuthenticated(false);
        setLoggedInUser(null);

        // Clear authentication state and user data from localStorage
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('loggedInUser');

        navigate('/'); // Navigate to the login screen
    };

    const availableLLMs = ['OpenAI', 'Claude', 'Gemini']; // List of available LLMs

    return (
        <Router>
            <div>
                <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem', backgroundColor: '#f5f5f5' }}>
                    <h1 style={{ textAlign: 'center', margin: 0 }}>AnyLLM</h1>
                    {isAuthenticated && loggedInUser && (
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                                    element={<ChatInterface availableLLMs={availableLLMs} loggedInUser={loggedInUser || ''} />}
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