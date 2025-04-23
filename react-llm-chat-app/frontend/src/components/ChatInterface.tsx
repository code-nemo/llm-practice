import React, { useState, useEffect } from 'react';

interface ChatInterfaceProps {
    availableLLMs: string[]; // List of available LLMs
    loggedInUser: string; // Add loggedInUser to the props
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ availableLLMs, loggedInUser }) => { // Destructure loggedInUser
    const [selectedLLM, setSelectedLLM] = useState<string>(() => {
        // Retrieve the selected LLM from localStorage or default to the first LLM
        return localStorage.getItem('selectedLLM') || availableLLMs[0];
    });
    const [messages, setMessages] = useState<string[]>(() => {
        // Retrieve messages from localStorage or default to an empty array
        try {
            const savedMessages = localStorage.getItem('messages');
            return savedMessages ? JSON.parse(savedMessages) : [];
        } catch {
            return [];
        }
    });
    const [input, setInput] = useState<string>('');

    useEffect(() => {
        // Save the messages to localStorage whenever they change
        localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        try {
            // Example API call with prompt and username
            const response = await fetch(`http://localhost:8000/${selectedLLM.toLowerCase()}/${selectedLLM.toLowerCase()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input, username: loggedInUser }), // Use loggedInUser in the request body
            });
            const data = await response.json();

            setMessages([...messages, `You (${loggedInUser}): ${input}`, `${selectedLLM}: ${data.response}`]); // Include loggedInUser in the message
            setInput('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.chatBox}>
                <h2 style={styles.title}>Chat with {selectedLLM}</h2>
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={styles.form}>
                    <select
                        value={selectedLLM}
                        onChange={(e) => setSelectedLLM(e.target.value)}
                        style={styles.selector}
                    >
                        {availableLLMs.map((llm, index) => (
                            <option key={index} value={llm}>
                                {llm}
                            </option>
                        ))}
                    </select>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>Send</button>
                </form>
                <div style={styles.messages}>
                    {messages.slice().reverse().map((msg, index) => ( // Reverse the messages array
                        <div key={index} style={styles.message}>
                            {msg}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: '#f5f5f5',
    },
    chatBox: {
        width: '100%',
        maxWidth: '600px',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '1rem',
    },
    title: {
        marginBottom: '1rem',
        fontSize: '1.5rem',
        color: '#333',
    },
    form: {
        display: 'flex',
        flexDirection: 'column' as const,
        width: '100%',
        gap: '0.5rem',
        marginBottom: '1rem',
    },
    selector: {
        padding: '0.8rem',
        fontSize: '1rem',
        borderRadius: '8px',
        border: '1px solid #ccc',
        marginBottom: '0.5rem',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    input: {
        flex: 1,
        padding: '0.8rem',
        fontSize: '1rem',
        borderRadius: '8px',
        border: '1px solid #ccc',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    button: {
        padding: '0.8rem 1.5rem',
        fontSize: '1rem',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#4285f4',
        color: '#fff',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    },
    messages: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.5rem',
        marginTop: '1rem',
    },
    message: {
        padding: '0.8rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        fontSize: '1rem',
        color: '#333',
    },
};

export default ChatInterface;