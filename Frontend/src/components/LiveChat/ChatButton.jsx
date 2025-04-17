import React from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "../ui/button";

const ChatButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-4 right-4 rounded-full w-14 h-14 bg-[#00B86C] hover:bg-[#00B86C]/90 shadow-lg z-50"
    >
      <MessageCircle size={24} />
    </Button>
  );
};

export default ChatButton; 