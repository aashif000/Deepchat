
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
}

export function ChatMessage({ content, role }: ChatMessageProps) {
  return (
    <div
      className={cn("message", {
        "user-message": role === "user",
        "assistant-message": role === "assistant",
      })}
    >
      <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
    </div>
  );
}
