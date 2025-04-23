import React, { useState, useEffect } from 'react';

interface ChatInterfaceProps {
    availableLLMs: string[]; // List of available LLMs
    loggedInUser: string; // Add loggedInUser to the props
}

interface Conversation {
    id: string;
    name: string;
    messages: string[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ availableLLMs, loggedInUser }) => {
    const [selectedLLM, setSelectedLLM] = useState<string>(() => {
        return localStorage.getItem('selectedLLM') || availableLLMs[0];
    });
    const [conversations, setConversations] = useState<Conversation[]>(() => {
        // Retrieve user-specific conversations from localStorage
        try {
            const savedConversations = localStorage.getItem(`conversations_${loggedInUser}`);
            return savedConversations ? JSON.parse(savedConversations) : [];
        } catch {
            return [];
        }
    });
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(() => {
        // Automatically select the last conversation if it exists
        const savedConversations = localStorage.getItem(`conversations_${loggedInUser}`);
        const parsedConversations = savedConversations ? JSON.parse(savedConversations) : [];
        return parsedConversations.length > 0 ? parsedConversations[parsedConversations.length - 1].id : null;
    });
    const [input, setInput] = useState<string>('');

    useEffect(() => {
        // Save user-specific conversations to localStorage whenever they change
        localStorage.setItem(`conversations_${loggedInUser}`, JSON.stringify(conversations));
    }, [conversations, loggedInUser]);

    const handleSend = async () => {
        if (!input.trim() || !selectedConversationId) return;

        try {
            const response = await fetch(`http://localhost:8000/${selectedLLM.toLowerCase()}/${selectedLLM.toLowerCase()}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: input,
                    username: loggedInUser,
                    conversation_id: selectedConversationId
                }),
            });
            const data = await response.json();

            setConversations((prevConversations) =>
                prevConversations.map((conversation) =>
                    conversation.id === selectedConversationId
                        ? {
                            ...conversation,
                            messages: [
                                ...conversation.messages,
                                `You (${loggedInUser}): ${input}`,
                                `${selectedLLM}: ${data.response}`,
                            ],
                        }
                        : conversation
                )
            );
            setInput('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleCreateConversation = () => {
        const newConversation: Conversation = {
            id: Date.now().toString(), // Unique ID based on timestamp
            name: `Conversation ${conversations.length + 1}`,
            messages: [],
        };
        setConversations([...conversations, newConversation]);
        setSelectedConversationId(newConversation.id);
    };

    const selectedConversation = conversations.find((conv) => conv.id === selectedConversationId);

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <button onClick={handleCreateConversation} style={styles.newConversationButton}>
                    New Conversation
                </button>
                {conversations.map((conversation) => (
                    <button
                        key={conversation.id}
                        onClick={() => setSelectedConversationId(conversation.id)}
                        style={{
                            ...styles.conversationButton,
                            backgroundColor: conversation.id === selectedConversationId ? '#e0f7fa' : '#fff',
                        }}
                    >
                        {conversation.name}
                    </button>
                ))}
            </div>
            <div style={styles.chatBox}>
                {selectedConversation && <h2 style={styles.title}>Chat with {selectedLLM}</h2>}
                {selectedConversation ? (
                    <>
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
                            {selectedConversation.messages.map((msg, index) => (
                                <div key={index} style={styles.message}>
                                    {msg}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p style={styles.noConversationMessage}>Select or create a conversation to start chatting.</p>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'row' as const, // Horizontal layout
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: '#f5f5f5',
    },
    sidebar: {
        width: '20%', // Sidebar width
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '0.5rem',
        marginRight: '1rem',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '1rem',
    },
    chatBox: {
        flex: 1, // Take remaining space
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
    newConversationButton: {
        padding: '0.5rem',
        fontSize: '1rem',
        borderRadius: '8px',
        border: '1px solid #ccc',
        backgroundColor: '#4285f4',
        color: '#fff',
        cursor: 'pointer',
    },
    conversationButton: {
        padding: '0.5rem',
        fontSize: '1rem',
        borderRadius: '8px',
        border: '1px solid #ccc',
        cursor: 'pointer',
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
    noConversationMessage: {
        fontSize: '1rem',
        color: '#666',
    },
};

export default ChatInterface;