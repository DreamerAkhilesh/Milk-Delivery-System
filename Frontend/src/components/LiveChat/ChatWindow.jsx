import React, { useState, useRef, useEffect } from "react";
import { X, Send, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const ChatWindow = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! How can we help you today?",
      sender: "agent",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");

    // Simulate agent response
    setTimeout(() => {
      const agentMessage = {
        id: messages.length + 2,
        text: "Thank you for your message. An agent will respond shortly.",
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, agentMessage]);
    }, 1000);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl transition-all duration-300 z-50
      ${isMinimized ? 'h-14' : 'h-[500px]'}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between bg-[#00B86C] text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
          <h3 className="font-semibold">Divya Dairy Support</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Messages */}
          <div className="flex-1 p-4 h-[380px] overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-[#00B86C] text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-75 mt-1 block">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send size={18} />
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatWindow; 