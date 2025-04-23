import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            alert('Please fill in both fields.');
            return;
        }

        // Save the username and password to localStorage
        localStorage.setItem('username', username.trim());
        localStorage.setItem('password', password.trim());

        console.log('User signed up:', { username, password });
        navigate('/'); // Redirect to login page after successful signup
    };

    return (
        <form onSubmit={handleSignup}>
            <h2>Signup</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Signup</button>
            <p>
                Already have an account? <Link to="/">Login</Link>
            </p>
        </form>
    );
};

export default Signup;