export default function MessageBubble({ children, isUser }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`message-bubble ${
        isUser 
          ? 'bg-accent bg-[var(--accent)] text-white rounded-br-none' 
          : 'bg-secondary bg-[var(--secondary)] rounded-bl-none'
      }`}>
        {children}
      </div>
    </div>
  );
}