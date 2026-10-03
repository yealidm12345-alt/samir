import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { soundManager } from '../services/sound';

interface LiveChatWidgetProps {
  language: 'en' | 'bn';
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ language }) => {
  const isBangla = language === 'bn';
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: isBangla
        ? 'আসসালামু আলাইকুম! ApexDroid স্টুডিও সাপোর্টে স্বাগতম। আপনি কি APK কম্পাইল বা বিকাশ ভেরিফিকেশন নিয়ে কোনো তথ্য জানতে চান?'
        : 'Hello! Welcome to ApexDroid Support. Ask about APK packaging, bKash verification, or Android 15 permissions.',
      timestamp: 'Just now',
    },
  ]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    soundManager.playClick();
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: inputText.trim(),
      timestamp: 'Just now',
    };

    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInputText('');

    // Automated smart assistant response
    setTimeout(() => {
      soundManager.playSuccess();
      const q = userMsg.text.toLowerCase();
      let botReply = isBangla
        ? 'ধন্যবাদ! আমাদের অটোমেটেড সিস্টেম আপনার অনুরোধটি গ্রহণ করেছে। বিকাশ/নগদ পেমেন্টের TrxID জমা দিলে অ্যাডমিন ৫-১৫ মিনিটের মধ্যে অনুমোদন প্রদান করে।'
        : 'Thank you! If you submitted a bKash/Nagad TrxID, our admin verification team verifies statements usually within 5-15 minutes.';

      if (q.includes('bkash') || q.includes('nagad') || q.includes('trx') || q.includes('পেমেন্ট')) {
        botReply = isBangla
          ? 'বিকাশ ও নগদে পেমেন্ট করার পর ট্রানজেকশন আইডি (TrxID) পেমেন্ট মডালে দিন। অ্যাডমিন প্যানেল থেকে instant approve করা হয়।'
          : 'After sending money via bKash or Nagad, enter your TrxID in the upgrade modal. Approvals grant instant unlimited APK compile credits.';
      } else if (q.includes('apk') || q.includes('download') || q.includes('install')) {
        botReply = isBangla
          ? '"Compile & Build APK" বাটনে ক্লিক করুন। ২-৩ সেকেন্ডের মধ্যে সম্পূর্ণ নেটিভ .apk এবং অ্যান্ড্রয়েড স্টুডিও .zip ডাউনলোড লিংক পাওয়া যাবে।'
          : 'Click "Compile & Build APK". In ~2.4 seconds you will receive the signed .apk binary plus the complete Android Studio Hedgehog source ZIP.';
      } else if (q.includes('admin') || q.includes('password') || q.includes('1234')) {
        botReply = isBangla
          ? 'অ্যাডমিন প্যানেলটি সম্পূর্ণ পৃথক এবং শুধুমাত্র ডোমেইনের সাথে /admin যোগ করলে চালু হয়।'
          : 'The Admin Panel is strictly separated and opens only when /admin is appended to the domain URL.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: 'bot',
          text: botReply,
          timestamp: 'Just now',
        },
      ]);
    }, 600);
  };

  const quickPrompts = isBangla
    ? ['বিকাশ পেমেন্ট নিয়ম', 'APK কিভাবে ইন্সটল করব?', 'প্রো প্ল্যানের সুবিধা কি?']
    : ['bKash payment flow', 'How to install APK?', 'What is in Pro plan?'];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {!isOpen && (
        <button
          onClick={() => {
            soundManager.playClick();
            setIsOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-xl shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <MessageSquare className="w-4 h-4 fill-current" />
          <span className="hidden sm:inline">{isBangla ? 'সহায়তা চ্যাট' : 'Live Support'}</span>
        </button>
      )}

      {isOpen && (
        <div className="w-80 sm:w-96 rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden flex flex-col h-[460px]">
          {/* Header */}
          <div className="p-3.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">ApexDroid Assistant</h4>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Active 24/7</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                soundManager.playClick();
                setIsOpen(false);
              }}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-neutral-950/60 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-2.5 rounded-xl ${
                    m.sender === 'user'
                      ? 'bg-emerald-500 text-neutral-950 font-medium'
                      : 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick suggestions */}
          <div className="px-3 py-2 bg-neutral-900 border-t border-neutral-800 flex gap-1.5 overflow-x-auto text-[10px]">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  setInputText(prompt);
                }}
                className="px-2 py-1 rounded bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 whitespace-nowrap cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-2.5 bg-neutral-950 border-t border-neutral-800 flex gap-2">
            <input
              type="text"
              placeholder={isBangla ? 'মেসেজ লিখুন...' : 'Type a question...'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2 rounded-lg bg-emerald-500 text-neutral-950 hover:bg-emerald-400 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
