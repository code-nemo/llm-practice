import React from 'react';

interface LLMSelectorProps {
    onLLMChange: (llm: string) => void;
}

const LLMSelector: React.FC<LLMSelectorProps> = ({ onLLMChange }) => {
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onLLMChange(event.target.value);
    };

    return (
        <div>
            <label htmlFor="llm-select">Select LLM:</label>
            <select id="llm-select" onChange={handleChange}>
                <option value="OpenAI">OpenAI</option>
                <option value="Gemini">Gemini</option>
                <option value="Claude">Claude</option>
            </select>
        </div>
    );
};

export default LLMSelector;