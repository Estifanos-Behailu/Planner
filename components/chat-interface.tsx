"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Send, RefreshCw, User } from "lucide-react"
import type { UserPreferences } from "./experience-planner"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

interface ChatInterfaceProps {
  userPreferences: UserPreferences
}

export default function ChatInterface({ userPreferences }: ChatInterfaceProps) {
  // Generate a unique ID for messages that's stable during SSR
  const generateUniqueId = (prefix: string) => {
    const timestamp = typeof window !== 'undefined' ? Date.now() : 0;
    const random = typeof window !== 'undefined' ? Math.random().toString(36).substr(2, 9) : '000000000';
    return `${prefix}-${timestamp}-${random}`;
  };

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Generate initial plan based on user preferences
  useEffect(() => {
    generateInitialPlan()
  }, [])

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const generateInitialPlan = async () => {
    setIsLoading(true)

    // Prepare data for the API call without showing prompts to user
    try {
      // Create a hidden message with user preferences for API only
      const hiddenMessage = {
        message: "Generate a detailed timetable for my visit to Kuriftu today based on my preferences.",
        userPreferences: userPreferences,
        conversationHistory: []
      }

      // Call the API to generate an initial plan
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hiddenMessage),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to get initial plan")
      }
      
      if (!data.response) {
        throw new Error("No response received from the API")
      }

      // Only show the AI response, not the initial prompts
      setMessages([
        {
          id: generateUniqueId('assistant-plan'),
          content: data.response,
          sender: "assistant",
          timestamp: new Date(),
        },
      ])
    } catch (error) {
      console.error("Error getting initial plan:", error)

      setMessages([
        {
          id: generateUniqueId('error'),
          content: `Error: ${error instanceof Error ? error.message : 'An error occurred while generating your plan'}`,
          sender: "assistant",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Process messages for OpenAI API format
  const processMessagesForAPI = (chatMessages: Message[]) => {
    const systemMessage = {
      role: "system",
      content: "IMPORTANT: You MUST respond with a timetable in the EXACT format specified here. DO NOT use your own format or give a general response.\n\nYou are a Kuriftu Resort planner. Your primary role is to create detailed timetables for visitors. The user's first question is ALWAYS asking for a timetable, even if it doesn't explicitly mention one.\n\nYOUR RESPONSE FORMAT MUST FOLLOW THIS STRUCTURE EXACTLY:\n\n# Your Kuriftu Experience Itinerary\n\n## Today's Schedule\n\n- 9:00 AM - 10:00 AM: **Activity Name** - Activity description\n- 10:30 AM - 12:00 PM: **Next Activity** - Activity description\n- 12:30 PM - 2:00 PM: **Lunch** - Meal description\n\nEach line MUST include a time range, an activity in bold, and a brief description. ALWAYS include breakfast, lunch, and dinner. Activities must match the user's stated interests.\n\nNEVER respond with a generic greeting or question. ALWAYS respond with a complete timetable in the format above."
    };

    return [
      systemMessage,
      ...chatMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
      })),
    ];
  };

  // Prepare the API request data
  const prepareApiRequestData = (chatMessages: Message[]) => {
    const conversationHistory = processMessagesForAPI(chatMessages);
    // Get the last user message as the primary message
    const userMessages = chatMessages.filter(msg => msg.sender === "user");
    const message = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : "";
    
    return {
      message,
      userPreferences,
      conversationHistory,
    };
  };

  async function handleSendMessage() {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: generateUniqueId("user"),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Focus the input after sending
    inputRef.current?.focus();

    try {
      // Prepare data for the API call
      const requestData = prepareApiRequestData([...messages, userMessage]);

      // Call the API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to get AI response")
      }
      
      if (!data.response) {
        throw new Error("No response received from the API")
      };

      const assistantMessage: Message = {
        id: generateUniqueId("assistant"),
        content: data.response,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);

      const errorMessage: Message = {
        id: generateUniqueId('error'),
        content: `Error: ${error instanceof Error ? error.message : 'An error occurred while processing your message'}`,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const restartPlanner = () => {
    window.location.reload()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-amber-800">Your Kuriftu Experience</h2>
        <Button
          variant="outline"
          onClick={restartPlanner}
          className="border-amber-600 text-amber-700 hover:bg-amber-50"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Restart Planner
        </Button>
      </div>

      <Card className="flex-1 p-4 border-amber-200 mb-4 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex items-start max-w-[80%] ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar
                    className={`h-8 w-8 ${message.sender === "user" ? "ml-2" : "mr-2"} ${
                      message.sender === "assistant" ? "bg-amber-600" : "bg-gray-600"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <div className="text-white text-xs font-bold">KR</div>
                    )}
                  </Avatar>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === "user" ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div
                      className="whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(/\n/g, "<br>")
                          .replace(/# (.*)/g, '<h1 class="text-lg font-bold mt-2 mb-1">$1</h1>')
                          .replace(/## (.*)/g, '<h2 class="text-md font-bold mt-2 mb-1">$1</h2>')
                          .replace(/### (.*)/g, '<h3 class="font-bold mt-1 mb-1">$1</h3>')
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\*(.*?)\*/g, "<em>$1</em>")
                          .replace(/- (.*)/g, "<li>• $1</li>"),
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-start">
                  <Avatar className="h-8 w-8 mr-2 bg-amber-600">
                    <div className="text-white text-xs font-bold">KR</div>
                  </Avatar>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                      <div
                        className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "600ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </Card>

      <div className="flex space-x-2">
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about activities or modify your plan..."
          className="border-amber-300 focus-visible:ring-amber-500"
          disabled={isLoading}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          className="bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
