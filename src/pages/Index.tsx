import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  {
    title: "Suggest fun activities",
    description: "to help me make friends in a new city",
  },
  {
    title: "Help me study",
    description: "vocabulary for an exam",
  },
  {
    title: "Write a thank-you note",
    description: "to my interviewer",
  },
  {
    title: "Create an illustration",
    description: "for a bakery",
  },
];

// Note: This is for testing purposes only. Never store API keys in frontend code in production!
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      // Add user message
      setMessages((prev) => [...prev, { role: "user", content }]);

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": window.location.origin,
          "X-Title": "Banter Chat App",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-distill-llama-70b:free",
          messages: [...messages, { role: "user", content }].map(msg => ({
            role: msg.role,
            content: msg.content
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from OpenRouter');
      }

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
    handleSendMessage(`${suggestion.title}: ${suggestion.description}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Banter</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="chat-container">
        <div className="message-list">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center space-y-6">
              <h2 className="text-2xl font-semibold">How can I help you today?</h2>
              <div className="suggestions">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.title}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="suggestion-card text-left"
                  >
                    <h3 className="font-medium">{suggestion.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {suggestion.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage
                key={index}
                role={message.role}
                content={message.content}
              />
            ))
          )}
        </div>
        <div className="chat-input-container">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}