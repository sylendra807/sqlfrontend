import { useEffect, useState } from "react";

export default function Sidebar({ onNewChat, onSelectChat, selectedChatId }) {
  const [chatSessions, setChatSessions] = useState([]);

  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await fetch("/api/chats");
        const data = await response.json();
        setChatSessions(data.chats);
      } catch (error) {
        console.error("Failed to load chats:", error);
      }
    }

    fetchChats();
  }, []);

  return (
    <div className="w-64 h-full bg-[#1f1f1f] text-white p-5 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">QueryNova</h2>

      <button
        onClick={onNewChat}
        className="bg-[#4CAF50] hover:bg-green-700 text-white py-2 px-4 rounded mb-6"
      >
        + New Chat
      </button>

      <div className="flex-1 overflow-y-auto text-sm space-y-2">
        <p className="text-gray-400 mb-2">Recent Conversations</p>
        {chatSessions.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`p-2 rounded cursor-pointer transition-all ${
              selectedChatId === chat.id
                ? "bg-green-700"
                : "bg-gray-800 hover:bg-gray-700"
            }`}
          >
            {chat.title || `Chat ${chat.id}`}
          </div>
        ))}
      </div>
    </div>
  );
}
