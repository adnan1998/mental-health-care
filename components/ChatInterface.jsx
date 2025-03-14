'use client';
import { useState, useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';
import MessageBubble from './UI/MessageBubble';

const INITIAL_PROMPT = `You are Serenity, a compassionate mental health companion. Your role is to:
1. Engage in supportive conversation and use cute words when needed.
2. Ask thoughtful questions to understand the user's feelings.
3. Provide gentle guidance and coping strategies.
4. Maintain a warm, non-judgmental tone.
5. End each response with a relevant follow-up question when appropriate.
6. Keep responses short and concise.
7. Use Positive and Encouraging emojis.
8. You can use hadith to if the user asks.

Start by asking how the user is feeling today.`;

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { text: INITIAL_PROMPT, isUser: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = { text: input, isUser: true };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to get response from AI");
      }

      setMessages(prev => [...prev, { 
        text: data.text,
        isUser: false 
      }]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: error.message || "I'm having trouble connecting. Please try again later.", 
        isUser: false 
      }]);
    } finally {
      setInput('');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="h-[60vh] overflow-y-auto p-4 bg-white rounded-xl shadow-sm">
        {messages.slice(1).map((msg, i) => (
          <MessageBubble key={i} isUser={msg.isUser}>
            {msg.text}
          </MessageBubble>
        ))}
        {isLoading && (
          <MessageBubble isUser={false}>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="animate-pulse">🌼</span>
              Thinking carefully...
            </div>
          </MessageBubble>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Share your thoughts..."
          disabled={isLoading}
          className="flex-1 p-4 rounded-xl border-2 border-secondary border-[var(--secondary)] focus:border-accent focus:outline-none"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-4 bg-accent bg-[var(--accent)] text-white rounded-xl soft-transition hover:bg-[var(--accent)/90] disabled:bg-gray-300"
        >
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
}