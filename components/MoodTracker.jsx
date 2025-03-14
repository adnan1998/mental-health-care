// components/MoodTracker.jsx
'use client';
import { useState, useEffect } from 'react';
import { FiSmile, FiMeh, FiFrown, FiCalendar, FiPlus } from 'react-icons/fi';

export default function MoodTracker() {
  const [moodEntries, setMoodEntries] = useState([]);
  const [currentMood, setCurrentMood] = useState(null);
  const [note, setNote] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Load saved entries from localStorage
  useEffect(() => {
    const savedEntries = localStorage.getItem('moodEntries');
    if (savedEntries) {
      setMoodEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem('moodEntries', JSON.stringify(moodEntries));
  }, [moodEntries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentMood) return;

    const newEntry = {
      date: selectedDate.toISOString(),
      mood: currentMood,
      note,
    };

    setMoodEntries([newEntry, ...moodEntries]);
    setCurrentMood(null);
    setNote('');
  };

  const getMoodColor = (moodLevel) => {
    const colors = ['#98ddca', '#f4cbc6', '#f4afab'];
    return colors[moodLevel - 1] || colors[0];
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-4">How are you feeling today?</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              type="button"
              onClick={() => setCurrentMood(1)}
              className={`p-4 rounded-full soft-transition ${
                currentMood === 1 ? 'bg-[#98ddca]' : 'bg-gray-100'
              }`}
            >
              <FiSmile size={24} className={currentMood === 1 ? 'text-white' : 'text-gray-600'} />
            </button>
            
            <button
              type="button"
              onClick={() => setCurrentMood(2)}
              className={`p-4 rounded-full soft-transition ${
                currentMood === 2 ? 'bg-[#f4cbc6]' : 'bg-gray-100'
              }`}
            >
              <FiMeh size={24} className={currentMood === 2 ? 'text-white' : 'text-gray-600'} />
            </button>
            
            <button
              type="button"
              onClick={() => setCurrentMood(3)}
              className={`p-4 rounded-full soft-transition ${
                currentMood === 3 ? 'bg-[#f4afab]' : 'bg-gray-100'
              }`}
            >
              <FiFrown size={24} className={currentMood === 3 ? 'text-white' : 'text-gray-600'} />
            </button>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Date</label>
            <div className="flex items-center gap-2">
              <FiCalendar className="text-gray-500" />
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="p-2 border rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Notes (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any notes about your mood..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#f4afab] focus:border-transparent"
              rows="3"
            />
          </div>

          <button
            type="submit"
            disabled={!currentMood}
            className="w-full bg-[#f4afab] text-white py-3 rounded-lg soft-transition hover:bg-[#f49892] disabled:opacity-50"
          >
            <FiPlus className="inline mr-2" /> Log Mood
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Mood History</h3>
        {moodEntries.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No entries yet. Start by logging your mood!</p>
        ) : (
          <div className="space-y-4">
            {moodEntries.map((entry, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg border-l-4"
                style={{ borderColor: getMoodColor(entry.mood) }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <div className={`p-2 rounded-full bg-opacity-20`}
                    style={{ backgroundColor: getMoodColor(entry.mood) + '40' }}
                  >
                    {entry.mood === 1 && <FiSmile className={getMoodColor(entry.mood)} />}
                    {entry.mood === 2 && <FiMeh className={getMoodColor(entry.mood)} />}
                    {entry.mood === 3 && <FiFrown className={getMoodColor(entry.mood)} />}
                  </div>
                </div>
                {entry.note && (
                  <p className="text-gray-600 text-sm">{entry.note}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}