
import { useState } from "react";
import { Bot, X, ChevronUp, ChevronDown, Send } from "lucide-react";

interface AIAssistantProps {
  recommendations: string[];
  isOpen?: boolean;
}

const AIAssistant = ({ recommendations, isOpen: initialOpen = false }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [isExpanded, setIsExpanded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([
    { text: "Hello! I'm your farming assistant. I can help you find the right equipment for your needs. What are you looking for today?", isUser: false }
  ]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    // Add user message
    setMessages([...messages, { text: prompt, isUser: true }]);
    
    // Simulate AI response
    setTimeout(() => {
      const response = "Based on your need, I recommend checking out the 'Mini Tractor' or 'Seed Drill' listings. They match well with your requirements.";
      setMessages(prev => [...prev, { text: response, isUser: false }]);
    }, 1000);
    
    setPrompt("");
  };

  return (
    <div className={`fixed ${isOpen ? 'bottom-5' : 'bottom-20'} right-5 z-40 transition-all duration-300`}>
      {/* Collapsed button */}
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="bg-primary text-white p-4 rounded-full shadow-lg flex items-center gap-2 animate-float"
        >
          <Bot size={24} />
          <span className="font-medium">AI Assistant</span>
        </button>
      )}

      {/* Expanded chat window */}
      {isOpen && (
        <div className={`bg-white rounded-2xl shadow-xl overflow-hidden
          transition-all duration-300 ease-out border border-border
          ${isExpanded ? 'w-[400px] h-[500px]' : 'w-[350px] h-[400px]'}`}
        >
          {/* Header */}
          <div className="bg-primary text-white p-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-medium">Farming Assistant</h3>
            </div>
            <div className="flex items-center">
              <button onClick={toggleExpand} className="p-1 hover:bg-white/10 rounded">
                {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
              <button onClick={toggleOpen} className="p-1 hover:bg-white/10 rounded">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat messages */}
          <div className="h-[calc(100%-110px)] overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[80%] p-3 rounded-lg animate-fade-in ${
                  msg.isUser 
                    ? 'bg-primary/10 ml-auto rounded-tr-none'
                    : 'bg-muted mr-auto rounded-tl-none'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-border p-3 flex gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask about equipment..."
              className="flex-1 input-vismay py-2 text-sm"
            />
            <button 
              type="submit" 
              className="btn-vismay py-2 px-3"
              disabled={!prompt.trim()}
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Recommendations */}
      {isOpen && recommendations.length > 0 && (
        <div className="absolute top-0 left-0 transform -translate-y-full bg-white p-4 rounded-t-xl border border-border shadow-md w-full">
          <h4 className="font-medium text-sm mb-2">Recommendations</h4>
          <ul className="text-sm">
            {recommendations.map((rec, idx) => (
              <li key={idx} className="py-1 flex items-start gap-2">
                <span className="text-primary font-medium">•</span> {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
