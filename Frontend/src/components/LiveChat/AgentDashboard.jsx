import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Send, User, Clock } from "lucide-react";

const AgentDashboard = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const { user } = useSelector((state) => state.auth);

  // Simulated chats data
  useEffect(() => {
    setActiveChats([
      {
        id: 1,
        user: "Rahul Sharma",
        unread: 2,
        status: "active",
        messages: [
          {
            id: 1,
            text: "Hello, I have a question about milk delivery",
            sender: "user",
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
          },
          {
            id: 2,
            text: "I'd like to change my delivery schedule",
            sender: "user",
            timestamp: new Date(),
          },
        ],
      },
      {
        id: 2,
        user: "Priya Patel",
        unread: 1,
        status: "waiting",
        messages: [
          {
            id: 1,
            text: "Is paneer available for today's delivery?",
            sender: "user",
            timestamp: new Date(),
          },
        ],
      },
    ]);
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: selectedChat.messages.length + 1,
      text: message,
      sender: "agent",
      timestamp: new Date(),
    };

    setActiveChats(chats =>
      chats.map(chat =>
        chat.id === selectedChat.id
          ? { ...chat, messages: [...chat.messages, newMessage] }
          : chat
      )
    );

    setMessage("");
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#00B86C] rounded-full flex items-center justify-center text-white">
              <User size={20} />
            </div>
            <div>
              <h3 className="font-semibold">Agent Dashboard</h3>
              <p className="text-sm text-gray-500">{user?.name || "Agent"}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="active" className="flex-1">
              Active ({activeChats.filter(c => c.status === "active").length})
            </TabsTrigger>
            <TabsTrigger value="waiting" className="flex-1">
              Waiting ({activeChats.filter(c => c.status === "waiting").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="m-0">
            <ScrollArea className="h-[calc(100vh-180px)]">
              {activeChats
                .filter(chat => chat.status === "active")
                .map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedChat?.id === chat.id ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{chat.user}</h4>
                      {chat.unread > 0 && (
                        <Badge variant="destructive">{chat.unread}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {chat.messages[chat.messages.length - 1]?.text}
                    </p>
                  </div>
                ))}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="waiting" className="m-0">
            <ScrollArea className="h-[calc(100vh-180px)]">
              {activeChats
                .filter(chat => chat.status === "waiting")
                .map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedChat?.id === chat.id ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{chat.user}</h4>
                      <Badge variant="secondary">Waiting</Badge>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {chat.messages[chat.messages.length - 1]?.text}
                    </p>
                  </div>
                ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedChat.user}</h3>
                    <p className="text-sm text-gray-500">
                      <Clock size={12} className="inline mr-1" />
                      Active now
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "agent" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sender === "agent"
                          ? "bg-[#00B86C] text-white"
                          : "bg-white text-gray-800 border"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <span className="text-xs opacity-75 mt-1 block">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit">
                  <Send size={18} className="mr-2" /> Send
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <h3 className="text-lg font-medium mb-2">Select a chat to start messaging</h3>
              <p>Choose from active or waiting conversations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentDashboard; 