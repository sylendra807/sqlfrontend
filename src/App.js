import './App.css';
import { useState } from 'react';
import Chat from './components/Chat';
import Header from './components/Header';
import Sidebar from './components/SideBar';

function App() {
  const [chatSessions, setChatSessions] = useState([]);
  const [currentChat, setCurrentChat] = useState({
    id: Date.now(),
    title: "",
    messages: [],
    sqlQuery: "",
    resultData: []
  });
  const [selectedChatId, setSelectedChatId] = useState(currentChat.id);

  const handleNewChat = () => {
    if (currentChat.messages.length > 0) {
      const title = currentChat.messages[0]?.text || `Chat ${chatSessions.length + 1}`;
      setChatSessions(prev => [
        { ...currentChat, title },
        ...prev,
      ]);
    }

    const newChat = {
      id: Date.now(),
      title: "",
      messages: [],
      sqlQuery: "",
      resultData: []
    };

    setCurrentChat(newChat);
    setSelectedChatId(newChat.id);
  };

  const updateCurrentChat = (updates) => {
    const updated = { ...currentChat, ...updates };
    setCurrentChat(updated);
    setSelectedChatId(updated.id);
  };

  const handleSelectChat = (chatId) => {
    const foundChat = chatSessions.find((chat) => chat.id === chatId);
    if (foundChat) {
      setCurrentChat(foundChat);
      setSelectedChatId(chatId);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chatSessions={chatSessions}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChatId}
      />
      <div className="flex-1 flex flex-col">
        <Header />
        <Chat
          chat={currentChat}
          updateChat={updateCurrentChat}
        />
      </div>
    </div>
  );
}

export default App;
