import React, { useState, useRef, useEffect } from 'react';
import {
    Send,
    Mic,
    Sparkles,
    CheckCircle2,
    Lock,
    ArrowRight,
    Wallet,
    Shield,
    CreditCard,
    TrendingUp,
    Paperclip
} from 'lucide-react';
import './MobileScreens.css';

interface Message {
    id: string;
    sender: 'user' | 'assistant';
    text: string;
    timestamp: string;
    cardType?: 'balance' | 'transfer_confirm' | 'transactions_list' | 'card_frozen';
    cardData?: any;
}

interface AIAssistantScreenProps {
    initialPrompt?: string;
    onExecuteTransfer?: (to: string, amount: number) => void;
}

const AIAssistantScreen: React.FC<AIAssistantScreenProps> = ({ initialPrompt, onExecuteTransfer }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'm1',
            sender: 'assistant',
            text: 'Hello Alexander! I am your Apex AI financial assistant. You can ask me to send money, inspect transactions, freeze cards, or analyze your monthly budget.',
            timestamp: 'Just now'
        }
    ]);

    const [inputValue, setInputValue] = useState(initialPrompt || '');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const handleSendMessage = (textToSend?: string) => {
        const query = textToSend || inputValue;
        if (!query.trim()) return;

        const userMsg: Message = {
            id: `usr_${Date.now()}`,
            sender: 'user',
            text: query,
            timestamp: 'Just now'
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        // Process Intelligent Assistant Reply
        setTimeout(() => {
            const lower = query.toLowerCase();
            let assistantReply: Message;

            if (lower.includes('send') || lower.includes('transfer') || lower.includes('sam')) {
                assistantReply = {
                    id: `ast_${Date.now()}`,
                    sender: 'assistant',
                    text: 'I have prepared a wire transfer request for your review. Please confirm the details below to authorize.',
                    timestamp: 'Just now',
                    cardType: 'transfer_confirm',
                    cardData: {
                        recipient: 'Sam Richardson',
                        account: '•••• 4492',
                        amount: 150.00,
                        fee: 0.00,
                        confirmed: false
                    }
                };
            } else if (lower.includes('spending') || lower.includes('budget') || lower.includes('expense')) {
                assistantReply = {
                    id: `ast_${Date.now()}`,
                    sender: 'assistant',
                    text: 'Here is your current monthly spending breakdown. You have spent $1,420.25 (40.5% of your $3,500 target), which is 12% lower than this time last month.',
                    timestamp: 'Just now',
                    cardType: 'transactions_list',
                    cardData: {
                        totalSpent: 1420.25,
                        topCategory: 'Shopping & Electronics',
                        items: [
                            { name: 'Apple Store NYC', amount: '$199.00' },
                            { name: 'ConEdison Electricity', amount: '$84.50' },
                            { name: 'Whole Foods Market', amount: '$142.30' }
                        ]
                    }
                };
            } else if (lower.includes('freeze') || lower.includes('lock')) {
                assistantReply = {
                    id: `ast_${Date.now()}`,
                    sender: 'assistant',
                    text: 'Your Cyber Neon Mastercard (•••• 4431) has been temporarily frozen. Contactless payments and online transactions are disabled until you unfreeze it.',
                    timestamp: 'Just now',
                    cardType: 'card_frozen',
                    cardData: {
                        cardName: 'Cyber Neon Mastercard',
                        last4: '4431',
                        status: 'FROZEN'
                    }
                };
            } else {
                assistantReply = {
                    id: `ast_${Date.now()}`,
                    sender: 'assistant',
                    text: 'Your current liquid total balance across all Apex accounts is $24,850.75. Your Checking account holds $18,430.00 and your High-Yield Savings holds $6,420.75 earning 7.2% APY.',
                    timestamp: 'Just now',
                    cardType: 'balance',
                    cardData: {
                        total: 24850.75,
                        checking: 18430.00,
                        savings: 6420.75
                    }
                };
            }

            setMessages((prev) => [...prev, assistantReply]);
            setIsTyping(false);
        }, 600);
    };

    const handleConfirmTransferInChat = (msgId: string) => {
        setMessages((prev) =>
            prev.map((m) => {
                if (m.id === msgId && m.cardData) {
                    return {
                        ...m,
                        cardData: { ...m.cardData, confirmed: true }
                    };
                }
                return m;
            })
        );
        if (onExecuteTransfer) {
            onExecuteTransfer('Sam Richardson', 150);
        }
    };

    const promptSuggestions = [
        'Send $150 to Sam',
        'Check my spending this month',
        'Freeze my card',
        'Show account balance'
    ];

    return (
        <div className="assistant-screen-container animate-fade-in">
            {/* Messages Scroll Area */}
            <div className="assistant-messages-list">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'assistant-row'}`}
                    >
                        {msg.sender === 'assistant' && (
                            <div className="assistant-avatar-badge">
                                <Sparkles size={14} color="#1E5EFF" />
                            </div>
                        )}

                        <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'assistant-bubble'}`}>
                            <p className="bubble-text">{msg.text}</p>

                            {/* Rich Response Card: Balance */}
                            {msg.cardType === 'balance' && msg.cardData && (
                                <div className="card-clean chat-rich-card mt-2">
                                    <div className="flex-between">
                                        <span className="caption-label">Apex Liquid Portfolio</span>
                                        <Wallet size={16} color="#1E5EFF" />
                                    </div>
                                    <div className="balance-amount mt-1">
                                        ${msg.cardData.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                    <div className="divider-line" />
                                    <div className="flex-between font-xs text-secondary">
                                        <span>Primary Checking: ${msg.cardData.checking.toLocaleString()}</span>
                                        <span>High-Yield: ${msg.cardData.savings.toLocaleString()}</span>
                                    </div>
                                </div>
                            )}

                            {/* Rich Response Card: Transfer Confirmation */}
                            {msg.cardType === 'transfer_confirm' && msg.cardData && (
                                <div className="card-clean chat-rich-card mt-2">
                                    <div className="flex-between">
                                        <span className="caption-label">TRANSFER AUTHORIZATION</span>
                                        <Shield size={16} color="#1E5EFF" />
                                    </div>
                                    <div className="flex-between mt-2">
                                        <div>
                                            <span className="section-heading">{msg.cardData.recipient}</span>
                                            <p className="caption-label">{msg.cardData.account}</p>
                                        </div>
                                        <span className="balance-amount text-primary text-xl">
                                            ${msg.cardData.amount.toFixed(2)}
                                        </span>
                                    </div>

                                    {!msg.cardData.confirmed ? (
                                        <button
                                            className="btn-primary btn-sm mt-3 w-full"
                                            onClick={() => handleConfirmTransferInChat(msg.id)}
                                        >
                                            <CheckCircle2 size={16} />
                                            <span>Confirm & Send ${msg.cardData.amount.toFixed(2)}</span>
                                        </button>
                                    ) : (
                                        <div className="chat-success-badge mt-3">
                                            <CheckCircle2 size={16} color="#16A34A" />
                                            <span>Transferred successfully &bull; Ref #98102</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Rich Response Card: Card Frozen */}
                            {msg.cardType === 'card_frozen' && msg.cardData && (
                                <div className="card-clean chat-rich-card mt-2">
                                    <div className="flex-between">
                                        <span className="caption-label">SECURITY PROTOCOL</span>
                                        <Lock size={16} color="#DC2626" />
                                    </div>
                                    <div className="flex-align-gap mt-2">
                                        <CreditCard size={20} color="#6B7280" />
                                        <div>
                                            <span className="body-text font-medium">{msg.cardData.cardName}</span>
                                            <p className="caption-label">Ending in {msg.cardData.last4} &bull; Locked</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Rich Response Card: Transactions list */}
                            {msg.cardType === 'transactions_list' && msg.cardData && (
                                <div className="card-clean chat-rich-card mt-2">
                                    <div className="flex-between">
                                        <span className="caption-label">TOP RECENT SPEND</span>
                                        <TrendingUp size={16} color="#1E5EFF" />
                                    </div>
                                    <div className="chat-mini-tx-list mt-2">
                                        {msg.cardData.items.map((it: any, idx: number) => (
                                            <div key={idx} className="flex-between py-1 font-xs border-b">
                                                <span>{it.name}</span>
                                                <span className="font-medium text-heading">{it.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="chat-bubble-row assistant-row">
                        <div className="assistant-avatar-badge">
                            <Sparkles size={14} color="#1E5EFF" />
                        </div>
                        <div className="chat-bubble assistant-bubble typing-indicator">
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips (above composer) */}
            <div className="assistant-prompt-chips">
                {promptSuggestions.map((prompt, i) => (
                    <button
                        key={i}
                        className="chip-pill"
                        onClick={() => handleSendMessage(prompt)}
                    >
                        <span>{prompt}</span>
                    </button>
                ))}
            </div>

            {/* Persistent ChatGPT-style Composer */}
            <div className="assistant-composer-bar">
                <div className="composer-input-pill">
                    <input
                        type="text"
                        placeholder="Ask anything about your money…"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSendMessage();
                        }}
                        className="composer-input"
                    />
                    <button className="composer-icon-btn" aria-label="Voice input">
                        <Mic size={18} color="#6B7280" />
                    </button>
                    <button
                        className={`composer-send-btn ${inputValue.trim() ? 'active' : ''}`}
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim()}
                        aria-label="Send message"
                    >
                        <Send size={16} color="#FFFFFF" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AIAssistantScreen;
