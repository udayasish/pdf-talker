"use client";
import React, { useState, useRef, useEffect } from "react";
import { Plus, Send, Paperclip } from "lucide-react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { v4 as uuidv4 } from "uuid";

export function PdfChat() {
  const searchParams = useSearchParams();
  const namespace = searchParams.get("namespace");
  const fileName = searchParams.get("fileName");
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      text: string;
      sender: "user" | "ai";
      timestamp: Date;
    }>
  >([
    {
      id: "1",
      text: fileName
        ? `Hello! I'm ready to answer questions about "${fileName}". What would you like to know?`
        : "Hello! Ask me anything about your PDF.",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([{ id: "1", title: "First Chat" }]);
  const [activeChat, setActiveChat] = useState("1");
  const [threadId, setThreadid] = useState(uuidv4());

  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
    }
  }, [inputValue]);

  // useEffect(() => {
  //   setThreadid()
  // }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      // Send message to backend with namespace if available
      const response = await axios.post("http://localhost:8000/api/chat", {
        message: messageText,
        threadId,
        namespace: namespace,
      });

      const result = response.data;

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: result.success
          ? result.data.response
          : "Sorry, I couldn't process your request.",
        sender: "ai" as const,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`,
        sender: "ai" as const,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[90vh] flex bg-[#212121] text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 flex flex-col bg-[#1E1E1E]">
        {/* Current PDF Info */}
        {fileName && (
          <div className="p-3 border-b border-gray-800 bg-[#2A2A2A]">
            <p className="text-xs text-gray-400 mb-1">Current PDF:</p>
            <p
              className="text-sm font-medium text-white truncate"
              title={fileName}
            >
              {fileName}
            </p>
            <p className="text-xs text-gray-500 mt-1">Namespace: {namespace}</p>
          </div>
        )}

        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Chats</h2>
          <button
            onClick={() => {
              const newChat = {
                id: Date.now().toString(),
                title: `Chat ${chats.length + 1}`,
              };
              setChats((prev) => [...prev, newChat]);
              setActiveChat(newChat.id);
              setMessages([
                {
                  id: "init",
                  text: "New conversation started!",
                  sender: "ai",
                  timestamp: new Date(),
                },
              ]);
            }}
            className="p-1 rounded hover:bg-gray-700"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`px-4 py-2 cursor-pointer truncate ${
                chat.id === activeChat
                  ? "bg-gray-800 font-medium"
                  : "hover:bg-gray-700"
              }`}
              onClick={() => setActiveChat(chat.id)}
            >
              {chat.title}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Messages */}
        <div className="h-[calc(100vh-120px)] overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-2xl px-4 py-2 rounded-2xl ${
                  message.sender === "user"
                    ? "bg-green-600 text-white"
                    : "bg-[#2A2A2A] text-gray-100"
                }`}
              >
                {message.sender === "ai" ? (
                  <div className="text-sm leading-relaxed">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside mb-2 space-y-1">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside mb-2 space-y-1">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="ml-2">{children}</li>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-white">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic">{children}</em>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-lg font-bold mb-2 text-white">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-md font-semibold mb-2 text-white">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-semibold mb-1 text-white">
                            {children}
                          </h3>
                        ),
                        table: ({ children }) => (
                          <div className="mb-4 overflow-x-auto">
                            <table className="min-w-full border-collapse border border-gray-600 bg-gray-800">
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-gray-700">{children}</thead>
                        ),
                        tbody: ({ children }) => <tbody>{children}</tbody>,
                        tr: ({ children }) => (
                          <tr className="border-b border-gray-600">
                            {children}
                          </tr>
                        ),
                        th: ({ children }) => (
                          <th className="border border-gray-600 px-4 py-2 text-left font-semibold text-white">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border border-gray-600 px-4 py-2 text-gray-100">
                            {children}
                          </td>
                        ),
                      }}
                    >
                      {message.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{message.text}</p>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#2A2A2A] px-4 py-2 rounded-2xl text-gray-400">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Fixed Input at Bottom */}
        <div className="fixed bottom-0 right-0 left-64 bg-[#212121] p-4 border-t border-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center bg-[#2A2A2A] rounded-2xl px-4 py-3 border border-gray-600">
              {/* Paperclip Icon */}
              <button className="text-gray-400 hover:text-gray-300 mr-3">
                <Paperclip size={20} />
              </button>

              {/* Input */}
              <textarea
                ref={inputRef}
                rows={1}
                placeholder="Ask anything about your PDF..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 resize-none max-h-32"
                disabled={isLoading}
              />

              {/* Ask Button */}
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm font-medium mx-3 transition-colors"
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
              >
                Ask
              </button>

              {/* Send Arrow */}
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className={`p-2 rounded-lg transition ${
                  isLoading || !inputValue.trim()
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
