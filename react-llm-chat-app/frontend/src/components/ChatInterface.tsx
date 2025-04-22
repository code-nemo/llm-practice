import React, { useState } from 'react';

interface ChatInterfaceProps {
    selectedLLM: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ selectedLLM }) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState<string>('');

    const handleSend = async () => {
        if (!input.trim()) return;

        // Example API call based on selected LLM
        const response = await fetch(`http://localhost:8000/${selectedLLM.toLowerCase()}/${selectedLLM.toLowerCase()}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: input }),
        });
        const data = await response.json();

        setMessages([...messages, `You: ${input}`, `${selectedLLM}: ${data.response}`]);
        setInput('');
    };

    return (
        <div>
            <h2>Chat with {selectedLLM}</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
            />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default ChatInterface;