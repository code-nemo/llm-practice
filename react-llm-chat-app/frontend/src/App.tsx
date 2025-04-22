import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import LLMSelector from './components/LLMSelector';

const App: React.FC = () => {
    const [selectedLLM, setSelectedLLM] = useState<string>('OpenAI');

    const handleLLMChange = (llm: string) => {
        setSelectedLLM(llm);
    };

    return (
        <div>
            <h1>Chat with LLMs</h1>
            <LLMSelector onLLMChange={handleLLMChange} />
            <ChatInterface selectedLLM={selectedLLM} />
        </div>
    );
};

export default App;