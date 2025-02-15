import { useState } from "react";
import { ArrowUp } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-input">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message Banter..."
        className="flex-1 p-4 bg-secondary/50 rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="p-4 bg-primary text-primary-foreground rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:hover:scale-100"
        aria-label="Send message"
        disabled={!message.trim() || isLoading}
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </form>
  );
}