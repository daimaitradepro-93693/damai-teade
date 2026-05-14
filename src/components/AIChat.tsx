'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { X, Send, Bot, User, Loader2, MessageCircle, Phone, Mail, Globe, ChevronDown, Sparkles, ThumbsUp, ThumbsDown, RotateCcw, Heart, Package, Clock, FileText, ChevronRight } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  rating?: 'good' | 'bad';
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  query: string;
  category: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function AIChat() {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showFAQ, setShowFAQ] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(0);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowQuickActions(true);
      setShowFAQ(true);
    }
  };

  // 智能分类的快捷问题
  const quickActions: QuickAction[] = [
    { icon: <Package className="w-4 h-4" />, label: '产品服务', query: '你们提供哪些产品和服务？', category: 'products' },
    { icon: <Clock className="w-4 h-4" />, label: '物流时效', query: '国际物流需要多长时间？', category: 'logistics' },
    { icon: <Phone className="w-4 h-4" />, label: '联系方式', query: '如何联系你们？', category: 'contact' },
    { icon: <FileText className="w-4 h-4" />, label: '报价咨询', query: '如何获取产品报价？', category: 'price' },
    { icon: <Globe className="w-4 h-4" />, label: '合作案例', query: '能分享一下合作案例吗？', category: 'cases' },
    { icon: <Heart className="w-4 h-4" />, label: '服务优势', query: '你们有什么优势？', category: 'advantage' },
  ];

  // 常见问题解答
  const faqItems: FAQItem[] = [
    { question: '进出口代理流程', answer: '我司提供一站式进出口代理服务：签订合同→准备货物→报关报检→国际运输→清关配送，全程专业跟进。' },
    { question: '物流时效多久', answer: '东南亚3-5天，欧洲15-20天，美洲20-30天。具体时效根据路线和清关情况而定。' },
    { question: '最低起订量', answer: '不同产品起订量不同，一般为500-1000件起订。具体可咨询我们的客服。' },
    { question: '支付方式', answer: '我们支持T/T、L/C、PayPal等多种付款方式，诚信经营，支持分期付款。' },
  ];

  // 智能推荐回复
  const getSmartSuggestions = () => {
    const lastAssistant = messages.filter(m => m.role === 'assistant').pop();
    if (!lastAssistant) return [];
    
    const content = lastAssistant.content.toLowerCase();
    if (content.includes('产品') || content.includes('服务')) {
      return ['查看产品目录', '了解具体报价', '联系专属顾问'];
    }
    if (content.includes('物流') || content.includes('运输')) {
      return ['物流费用查询', '追踪我的货物', '仓储服务'];
    }
    if (content.includes('联系') || content.includes('电话')) {
      return ['拨打热线', '发送邮件', '预约面谈'];
    }
    return [];
  };

  const handleSend = async (prefill?: string) => {
    const text = prefill || input;
    if (!text.trim()) return;

    messageIdRef.current += 1;
    const userMessage: Message = {
      id: `${id}-${messageIdRef.current}`,
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowQuickActions(false);
    setShowFAQ(false);
    setIsLoading(true);

    // 使用 AbortController 实现超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 25000);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            company: '大迈国际贸易有限公司',
            services: ['进出口代理', '国际物流', '报关报检', '跨境电商', '仓储配送', '供应链金融'],
            contact: { phone: '15999660432', email: 'daimai.tradepro@gmail.com', address: '中国海南' }
          }
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      messageIdRef.current += 1;
      const assistantMessage: Message = {
        id: `${id}-${messageIdRef.current}`,
        role: 'assistant',
        content: data.response || '抱歉，我现在无法回答您的问题，请稍后再试。',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      messageIdRef.current += 1;
      const isTimeout = error instanceof Error && error.name === 'AbortError';
      const errorMessage: Message = {
        id: `${id}-${messageIdRef.current}`,
        role: 'assistant',
        content: isTimeout 
          ? '抱歉，网络连接超时。您可以拨打热线 159-9966-0432 或发送邮件至 daimai.tradepro@gmail.com 联系我们的人工客服。'
          : '抱歉，服务暂时不可用。请您拨打热线电话 159-9966-0432 联系我们的人工客服。',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleRating = (messageId: string, rating: 'good' | 'bad') => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, rating } : m
    ));
  };

  const handleFAQClick = (faq: FAQItem) => {
    handleSend(faq.question);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = getSmartSuggestions();

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={toggleChat}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 animate-pulse-slow"
        aria-label="打开智能客服"
      >
        {isOpen ? (
          <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <>
            <Bot className="h-6 w-6" />
            {/* Notification Badge */}
            {messages.filter(m => m.role === 'assistant').length === 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
                <Sparkles className="w-3 h-3" />
              </span>
            )}
          </>
        )}
        {/* Tooltip */}
        <span className="absolute right-full mr-3 hidden whitespace-nowrap rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-2 text-sm text-white shadow-lg group-hover:block">
          <span className="flex items-center gap-2">
            <Sparkles className="w-3 h-3" />
            AI 智能客服
          </span>
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed inset-0 m-auto w-[520px] h-[680px] max-w-[calc(100vw-40px)] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-300 border border-gray-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white p-5 flex items-center justify-between relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/4"></div>
            <div className="absolute top-4 left-8 w-2 h-2 bg-white/50 rounded-full animate-ping"></div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-lg">
                  <Bot className="w-8 h-8" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '3s' }} />
                  AI 智能助手
                </h3>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <p className="text-xs text-blue-100">大迈国际贸易 · 24小时服务</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <button
                onClick={() => setMessages([])}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title="清空对话"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={toggleChat}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="最小化"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-slate-50 via-white to-slate-50 scrollbar-thin">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="space-y-4">
                {/* AI Introduction */}
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg flex-shrink-0">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm px-5 py-4 border border-gray-100 flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-sm font-bold text-gray-800">AI 智能助手</span>
                      <span className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full font-medium">在线</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      👋 您好！我是大迈国际贸易的AI智能助手。
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed mt-2">
                      我可以帮您了解进出口代理、国际物流、报关报检等服务，解答您在外贸业务中的各类问题。
                    </p>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2 font-medium">📞 联系我们：159-9966-0432</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                {showQuickActions && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <p className="text-sm font-semibold text-gray-800">快捷服务</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => handleSend(action.query)}
                          className="flex items-center gap-2 px-3 py-2.5 bg-white border border-blue-200 rounded-xl hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 text-sm text-gray-700 hover:text-blue-700 shadow-sm hover:shadow-md"
                        >
                          {action.icon}
                          <span className="font-medium">{action.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* FAQ Section */}
                {showFAQ && (
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="w-4 h-4 text-gray-500" />
                      <p className="text-sm font-semibold text-gray-800">常见问题</p>
                    </div>
                    <div className="space-y-2">
                      {faqItems.map((faq, index) => (
                        <button
                          key={index}
                          onClick={() => handleFAQClick(faq)}
                          className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-blue-50 rounded-xl transition-colors text-sm text-gray-600 hover:text-blue-600 group"
                        >
                          <span>{faq.question}</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Chat Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${
                  message.role === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md flex-shrink-0">
                    <Bot className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 text-white flex items-center justify-center shadow-md flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                )}
                <div className="flex-1 max-w-[85%]">
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm ml-auto'
                        : 'bg-white border border-gray-100 text-gray-700 rounded-tl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className={`flex items-center justify-between mt-2 pt-2 border-t ${
                      message.role === 'user' ? 'border-blue-400/30' : 'border-gray-100'
                    }`}>
                      <p className={`text-xs ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {message.role === 'assistant' && (
                        <div className="flex items-center gap-2">
                          {!message.rating && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleRating(message.id, 'good')}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                title="有帮助"
                              >
                                <ThumbsUp className="w-3 h-3 text-gray-400 hover:text-green-500" />
                              </button>
                              <button
                                onClick={() => handleRating(message.id, 'bad')}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                                title="待改进"
                              >
                                <ThumbsDown className="w-3 h-3 text-gray-400 hover:text-red-500" />
                              </button>
                            </div>
                          )}
                          {message.rating && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              message.rating === 'good' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {message.rating === 'good' ? '✓ 有帮助' : '✓ 已反馈'}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Smart Suggestions */}
                  {message.role === 'assistant' && suggestions.length > 0 && messages[messages.length - 1].id === message.id && (
                    <div className="mt-2 flex flex-wrap gap-2 ml-12">
                      {suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(suggestion)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs rounded-full transition-colors border border-blue-200"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm px-5 py-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-sm text-gray-500">AI 正在思考中...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white/95 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入您的问题，AI为您解答..."
                className="flex-1 px-5 py-3.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-all"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-center mt-3 gap-6">
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                159-9966-0432
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                daimai.tradepro@gmail.com
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
