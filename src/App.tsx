import React, { useState } from 'react';
import { Search, MessageCircle, FileText, BookOpen, Users, ExternalLink, Bot, Send, Clock, CheckCircle } from 'lucide-react';

interface DocumentSource {
  type: 'notion' | 'gdocs' | 'confluence';
  title: string;
  url: string;
}

interface AIResponse {
  answer: string;
  reference?: string;
  additionalNotes?: string;
  sources: DocumentSource[];
  timestamp: Date;
}

interface ChatMessage {
  id: string;
  question: string;
  response: AIResponse | null;
  isLoading: boolean;
}

const mockResponses: Record<string, AIResponse> = {
  'travel reimbursement': {
    answer: 'Travel expenses are reimbursed within 5-7 business days after submission:\n\n• Submit receipts through Expensify within 30 days\n• Pre-approval required for expenses over $500\n• Meals: $75/day domestic, $100/day international\n• Lodging: Reasonable business rates accepted',
    reference: 'Employee Travel Policy v3.2',
    additionalNotes: 'For international travel, currency conversion rates are applied automatically.',
    sources: [
      { type: 'notion', title: 'Travel & Expense Policy', url: '#' },
      { type: 'gdocs', title: 'Expensify Setup Guide', url: '#' }
    ],
    timestamp: new Date()
  },
  'onboard vendor': {
    answer: 'New vendor onboarding process:\n\n1. Submit vendor request form in ServiceNow\n2. Procurement team reviews within 2 business days\n3. Vendor completes compliance documentation\n4. Finance sets up payment terms\n5. Final approval and system access granted',
    reference: 'Vendor Management Process Guide',
    additionalNotes: 'Emergency vendors can be fast-tracked with director approval.',
    sources: [
      { type: 'confluence', title: 'Vendor Onboarding Workflow', url: '#' },
      { type: 'gdocs', title: 'Procurement Guidelines', url: '#' }
    ],
    timestamp: new Date()
  },
  'marketing strategy': {
    answer: 'The latest marketing strategy deck (Q1 2025) is available in the Marketing shared drive:\n\n• Focus areas: Digital transformation, customer retention\n• Budget allocation: 60% digital, 25% events, 15% traditional\n• Key metrics: CAC, LTV, engagement rates\n• Monthly reviews scheduled first Tuesday of each month',
    reference: 'Marketing Strategy Q1 2025 - Final.pptx',
    sources: [
      { type: 'gdocs', title: 'Marketing Strategy Q1 2025', url: '#' },
      { type: 'notion', title: 'Marketing Team Resources', url: '#' }
    ],
    timestamp: new Date()
  },
  'vpn access': {
    answer: 'To reset your VPN access:\n\n1. Visit the IT Self-Service Portal\n2. Click "Reset Network Access"\n3. Verify your identity with 2FA\n4. Download new VPN configuration\n5. Test connection within 24 hours',
    reference: 'IT Support - VPN Troubleshooting Guide',
    additionalNotes: 'If issues persist, contact IT helpdesk at ext. 4357.',
    sources: [
      { type: 'confluence', title: 'VPN Setup & Troubleshooting', url: '#' },
      { type: 'notion', title: 'IT Self-Service Portal Guide', url: '#' }
    ],
    timestamp: new Date()
  },
  'hardware support': {
    answer: 'For hardware support and requests:\n\n• IT Helpdesk: ext. 4357 or helpdesk@company.com\n• Hardware requests: Submit ticket in ServiceNow\n• Emergency repairs: Contact facilities at ext. 4200\n• Laptop replacements: 3-5 business days processing',
    reference: 'IT Support Contact Directory',
    additionalNotes: 'Keep your asset tag number handy when contacting support.',
    sources: [
      { type: 'notion', title: 'IT Support Resources', url: '#' },
      { type: 'confluence', title: 'Hardware Support Process', url: '#' }
    ],
    timestamp: new Date()
  }
};

const getSourceIcon = (type: string) => {
  switch (type) {
    case 'notion': return <BookOpen className="w-4 h-4" />;
    case 'gdocs': return <FileText className="w-4 h-4" />;
    case 'confluence': return <Users className="w-4 h-4" />;
    default: return <FileText className="w-4 h-4" />;
  }
};

const getSourceColor = (type: string) => {
  switch (type) {
    case 'notion': return 'bg-black text-white';
    case 'gdocs': return 'bg-blue-500 text-white';
    case 'confluence': return 'bg-blue-600 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');

  const findBestMatch = (question: string): AIResponse | null => {
    const lowercaseQuestion = question.toLowerCase();
    for (const [key, response] of Object.entries(mockResponses)) {
      if (lowercaseQuestion.includes(key)) {
        return response;
      }
    }
    return null;
  };

  const handleSearch = async () => {
    if (!currentQuestion.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      question: currentQuestion,
      response: null,
      isLoading: true
    };

    setMessages(prev => [...prev, newMessage]);
    setCurrentQuestion('');

    // Simulate API call delay
    setTimeout(() => {
      const response = findBestMatch(currentQuestion);
      const finalResponse = response || {
        answer: "I couldn't locate this information in the current documentation. Please contact the IT Support team at helpdesk@company.com or your direct manager for further assistance.",
        sources: [],
        timestamp: new Date()
      };

      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, response: finalResponse, isLoading: false }
            : msg
        )
      );
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const exampleQuestions = [
    "What is our company's travel reimbursement policy?",
    "How do I onboard a new vendor?",
    "Where can I find the latest marketing strategy deck?",
    "What's the process to reset my VPN access?",
    "Who do I contact for hardware support?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Internal Docs AI Assistant</h1>
                <p className="text-sm text-slate-600">Ask questions about company policies and processes</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Notion</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Google Docs</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-600">Confluence</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {messages.length === 0 ? (
          /* Welcome Screen */
          <div className="text-center mb-12">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">AI Knowledge Assistant</h2>
              <p className="text-slate-600 mb-8">I help employees quickly find answers about internal policies, processes, and documentation. Ask me anything about company procedures!</p>
              
              <div className="grid gap-3 max-w-2xl mx-auto">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Sample queries I can handle:</h3>
                {exampleQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(question)}
                    className="text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors duration-200"
                  >
                    <span className="text-slate-700">{question}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Chat Messages */
          <div className="space-y-6 mb-8">
            {messages.map((message) => (
              <div key={message.id} className="space-y-4">
                {/* User Question */}
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-xl">
                    <p className="text-sm">{message.question}</p>
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-md px-6 py-4 max-w-4xl shadow-sm">
                    {message.isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                        <span className="text-slate-600">Searching through documents...</span>
                      </div>
                    ) : message.response ? (
                      <div>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Answer
                            </h4>
                            <p className="text-slate-800 whitespace-pre-line leading-relaxed">{message.response.answer}</p>
                          </div>
                          
                          {message.response.reference && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center">
                                <FileText className="w-3 h-3 mr-1" />
                                Reference
                              </h4>
                              <p className="text-slate-700 text-sm font-medium">{message.response.reference}</p>
                            </div>
                          )}
                          
                          {message.response.additionalNotes && (
                            <div>
                              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                Additional Notes
                              </h4>
                              <p className="text-slate-600 text-sm italic">{message.response.additionalNotes}</p>
                            </div>
                          )}
                        </div>
                        
                        {message.response.sources.length > 0 && (
                          <div className="border-t border-slate-100 pt-4 mt-4">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Document Sources
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {message.response.sources.map((source, index) => (
                                <a
                                  key={index}
                                  href={source.url}
                                  className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-80 transition-opacity ${getSourceColor(source.type)}`}
                                >
                                  {getSourceIcon(source.type)}
                                  <span>{source.title}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search Input */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <textarea
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about company policies, processes, or internal documentation..."
                className="w-full resize-none border-0 focus:ring-0 text-slate-900 placeholder-slate-500 bg-transparent"
                rows={2}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!currentQuestion.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors duration-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-slate-500">
            AI Knowledge Assistant • Searches across Notion, Google Docs, and Confluence
            <br />For urgent matters, contact your direct manager or IT Support at helpdesk@company.com
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;