
import React from "react";
import ChatInterface from "@/components/chat/ChatInterface";
import Header from "@/components/header/Header";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;
