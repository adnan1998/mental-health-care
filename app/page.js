'use client';
import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import MoodTracker from '@/components/MoodTracker';
// import MoodTracker from '@/components/MoodTracker';

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <main className="min-h-screen max-w-4xl mx-auto p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">🌷 Serenity Companion by Adnan</h1>
        <p className="text-lg text-gray-600">Your Compassionate Mental Health Ally</p>
      </header>

      <div className="flex gap-4 justify-center mb-8">
        <button
          onClick={() => setActiveTab('chat')}
          className={`px-6 py-2 rounded-full soft-transition ${
            activeTab === 'chat' ? 'bg-accent bg-[var(--accent)] text-white' : 'bg-secondary bg-[var(--secondary)] hover:bg-accent/50 hover:bg-[var(--accent)/50]'
          }`}
        >
          AI Chat
        </button>
        <button
          onClick={() => setActiveTab('mood')}
          className={`px-6 py-2 rounded-full soft-transition ${
            activeTab === 'mood' ? 'bg-accent text-white' : 'bg-secondary bg-[var(--secondary)] hover:bg-accent/50 hover:bg-[var(--accent)/50]'
          }`}
        >
          Mood Tracker
        </button>
      </div>

      {activeTab === 'chat' ? <ChatInterface /> : <MoodTracker />}
      
      <footer className="text-center mt-8 text-sm text-gray-500">
        Note: This is not a replacement for professional mental health care.
      </footer>
    </main>
  );
}