import React, { useState, useEffect } from 'react';

interface ChatInterfaceProps {
    availableLLMs: string[];
    loggedInUser: string;
}

interface Conversation {
    id: string;
    name: string;
    messages: string[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ availableLLMs, loggedInUser }) => {
    const [selectedLLM, setSelectedLLM] = useState<string>(() => availableLLMs[0]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    // Fetch conversations from the backend
    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:8000/gemini/history/${loggedInUser}`);
                if (response.ok) {
                    const data = await response.json();
                    const fetchedConversations = Object.entries(data).map(([id, messages]: [string, any]) => ({
                        id,
                        name: `Conversation ${id}`,
                        messages: messages.map((msg: any) => `${msg.role === 'user' ? `You (${loggedInUser})` : 'Gemini'}: ${msg.content}`),
                    }));
                    setConversations(fetchedConversations);
                    if (fetchedConversations.length > 0) {
                        setSelectedConversationId(fetchedConversations[fetchedConversations.length - 1].id); // Select the last conversation by default
                    }
                } else {
                    console.error('Failed to fetch conversations:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching conversations:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversations();
    }, [loggedInUser]);

    const handleSend = async () => {
        if (!input.trim() || !selectedConversationId) return;

        try {
            const response = await fetch(`http://localhost:8000/gemini`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: input,
                    username: loggedInUser,
                    conversation_id: selectedConversationId,
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
                                `Gemini: ${data.response}`,
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
            id: Date.now().toString(),
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
                {conversations.map((conversation, index) => (
                    <button
                        key={conversation.id}
                        onClick={() => setSelectedConversationId(conversation.id)}
                        style={{
                            ...styles.conversationButton,
                            backgroundColor: conversation.id === selectedConversationId ? '#e0f7fa' : '#fff',
                        }}
                    >
                        Conversation {index + 1} {/* Replace ID with sequential number */}
                    </button>
                ))}
            </div>
            <div style={styles.chatBox}>
                {isLoading ? (
                    <p>Loading conversations...</p>
                ) : selectedConversation ? (
                    <>
                        <h2 style={styles.title}>Chat with {selectedLLM}</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={styles.form}>
                            <div style={styles.inputContainer}>
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    style={styles.input}
                                />
                                <div style={styles.dropdownContainer}>
                                    <button
                                        type="button"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        style={styles.dropdownButton}
                                    >
                                        {selectedLLM} ▼
                                    </button>
                                    {isDropdownOpen && (
                                        <div style={styles.dropdownMenu}>
                                            {availableLLMs.map((llm, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => {
                                                        setSelectedLLM(llm);
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    style={{
                                                        ...styles.dropdownItem,
                                                        backgroundColor: selectedLLM === llm ? '#e0f7fa' : '#fff',
                                                    }}
                                                >
                                                    {llm}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <button type="submit" style={styles.sendButton}>Send</button>
                            </div>
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
        flexDirection: 'row' as const,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: '#f5f5f5',
    },
    sidebar: {
        width: '20%',
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
        flex: 1,
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
    inputContainer: {
        display: 'flex',
        flexDirection: 'row' as const,
        alignItems: 'center',
        gap: '0.5rem',
    },
    dropdownContainer: {
        position: 'relative' as const,
    },
    dropdownButton: {
        padding: '0.8rem',
        fontSize: '1rem',
        borderRadius: '8px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    dropdownMenu: {
        position: 'absolute' as const,
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        zIndex: 1,
    },
    dropdownItem: {
        padding: '0.8rem',
        cursor: 'pointer',
    },
    input: {
        flex: 1,
        padding: '0.8rem',
        fontSize: '1rem',
        borderRadius: '8px',
        border: '1px solid #ccc',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    sendButton: {
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