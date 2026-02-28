import React, { useState, useEffect, useRef } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation,
  useNavigate
} from 'react-router-dom';
import { 
  Menu, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  ArrowRight, 
  BookOpen, 
  Users, 
  Award, 
  MessageSquare,
  Send,
  Plus,
  Trash2,
  Lock,
  ChevronRight,
  School,
  Mic,
  MicOff,
  Volume2,
  Bell,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { GoogleGenAI, Modality } from "@google/genai";
import Markdown from 'react-markdown';

// --- Constants & Fallbacks ---
const FALLBACK_DATA: SchoolData = {
  gallery: [
    { id: "1", url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1000", caption: "Collaborative Learning Environment" },
    { id: "2", url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000", caption: "Diverse Student Community" },
    { id: "3", url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1000", caption: "Athletic Excellence" },
    { id: "4", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000", caption: "Modern Classroom Technology" },
  ],
  announcements: [
    { id: "1", title: "Admissions Open for Session 2026-27", date: "Feb 21, 2026" },
    { id: "2", title: "Board Examination Schedule Released", date: "Feb 18, 2026" },
    { id: "3", title: "Annual Day Celebration - March 15th", date: "Feb 10, 2026" }
  ]
};

// --- Types ---
interface GalleryItem {
  id: string;
  url: string;
  caption: string;
}

interface SchoolData {
  gallery: GalleryItem[];
  announcements: { id: string; title: string; date: string }[];
}

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/80 backdrop-blur-xl py-4 shadow-sm' : 'bg-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className={`transition-all duration-500 ${scrolled ? 'scale-90' : 'scale-100'}`}>
              <div className="bg-slate-900 p-2 rounded-xl shadow-2xl group-hover:rotate-6 transition-transform overflow-hidden w-12 h-12 flex items-center justify-center">
                <img src="https://images.unsplash.com/photo-1594312915251-48db9280c8f1?q=80&w=200&auto=format&fit=crop" alt="Logo" className="w-full h-full object-contain invert" referrerPolicy="no-referrer" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className={`font-serif text-2xl font-bold tracking-tight leading-none transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
                Babu Ji
              </span>
              <span className={`text-[9px] uppercase tracking-[0.4em] font-bold mt-1 transition-colors ${scrolled ? 'text-emerald-600' : 'text-emerald-400'}`}>
                International
              </span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-12">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[10px] uppercase tracking-[0.2em] font-bold transition-all hover:opacity-100 relative py-2 ${
                  location.pathname === link.path 
                    ? scrolled ? 'text-emerald-600 opacity-100' : 'text-white opacity-100'
                    : scrolled ? 'text-slate-500 opacity-60' : 'text-white/60'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-underline"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${scrolled ? 'bg-emerald-600' : 'bg-white'}`}
                  />
                )}
              </Link>
            ))}
            <Link
              to="/admin"
              className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-xl ${
                scrolled 
                  ? 'bg-slate-900 text-white hover:bg-emerald-600 shadow-slate-900/10' 
                  : 'bg-white text-slate-900 hover:bg-emerald-400 shadow-white/10'
              }`}
            >
              Portal
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className={`p-2 rounded-xl transition-colors ${scrolled ? 'text-slate-900 bg-slate-100' : 'text-white bg-white/10'}`}
            >
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-50 rounded-lg"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="block px-3 py-4 text-base font-medium text-emerald-600"
              >
                Admin Portal
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        toast.success('Subscribed successfully!');
        setEmail('');
      }
    } catch {
      toast.error('Failed to subscribe');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-24">
          <div className="lg:col-span-4">
            <div className="flex items-center space-x-4 mb-10">
              <div className="bg-white p-2 rounded-xl w-12 h-12 flex items-center justify-center overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1594312915251-48db9280c8f1?q=80&w=200&auto=format&fit=crop" alt="Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-2xl tracking-tighter leading-none">Babu Ji</span>
                <span className="text-emerald-500 text-[9px] uppercase tracking-[0.4em] font-bold mt-1">International</span>
              </div>
            </div>
            <p className="text-lg leading-relaxed mb-10 font-light">
              Nurturing excellence and character since inception. We believe in the power of education to transform lives and build global citizens.
            </p>
            <div className="flex space-x-6">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-950 transition-all duration-500">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.3em] mb-10">Explore</h4>
            <ul className="space-y-6 text-sm font-light">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
              <li><Link to="/gallery" className="hover:text-emerald-400 transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
              <li><Link to="/admin" className="hover:text-emerald-400 transition-colors opacity-40">Admin Portal</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.3em] mb-10">Contact</h4>
            <ul className="space-y-8 text-sm font-light">
              <li className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                <span className="leading-relaxed">Harewali road Sherkot near Police station, District Bijnor, UP 246747</span>
              </li>
              <li className="flex items-center space-x-4">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>+91 9759285330</span>
              </li>
              <li className="flex items-center space-x-4">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>info@babujischool.com</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-[10px] uppercase tracking-[0.3em] mb-10">Newsletter</h4>
            <p className="text-sm mb-8 font-light leading-relaxed">Stay updated with our latest news and events.</p>
            <form onSubmit={handleNewsletter} className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" 
                required
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="absolute right-2 top-2 bottom-2 bg-emerald-600 text-white px-6 rounded-xl hover:bg-emerald-500 transition-all disabled:opacity-50"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] uppercase tracking-widest font-bold opacity-40">
            © 2026 Babu Ji International Memorial School. All Rights Reserved.
          </p>
          <div className="flex space-x-8 text-[10px] uppercase tracking-widest font-bold opacity-40">
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: "Namaste! I'm the Babu Ji School Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState('en-IN');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const speakText = async (text: string) => {
    if (!text.trim()) return;
    
    try {
      setIsSpeaking(true);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      
      // Clean text for TTS (remove markdown and limit length)
      const cleanText = text
        .replace(/[*_#`~]/g, '') 
        .replace(/\[.*?\]\(.*?\)/g, '')
        .replace(/\n+/g, ' ')
        .trim()
        .substring(0, 500);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: cleanText }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        // The model returns raw PCM (16-bit, mono, 24kHz). 
        // We need to add a WAV header to make it playable by the browser.
        const pcmData = atob(base64Audio);
        const buffer = new ArrayBuffer(44 + pcmData.length);
        const view = new DataView(buffer);

        // RIFF identifier
        view.setUint32(0, 0x52494646, false); // "RIFF"
        // file length
        view.setUint32(4, 36 + pcmData.length, true);
        // RIFF type
        view.setUint32(8, 0x57415645, false); // "WAVE"
        // format chunk identifier
        view.setUint32(12, 0x666d7420, false); // "fmt "
        // format chunk length
        view.setUint32(16, 16, true);
        // sample format (PCM = 1)
        view.setUint16(20, 1, true);
        // channel count (Mono = 1)
        view.setUint16(22, 1, true);
        // sample rate (24000)
        view.setUint32(24, 24000, true);
        // byte rate (sample rate * block align)
        view.setUint32(28, 24000 * 2, true);
        // block align (channel count * bytes per sample)
        view.setUint16(32, 2, true);
        // bits per sample (16)
        view.setUint16(34, 16, true);
        // data chunk identifier
        view.setUint32(36, 0x64617461, false); // "data"
        // data chunk length
        view.setUint32(40, pcmData.length, true);

        for (let i = 0; i < pcmData.length; i++) {
          view.setUint8(44 + i, pcmData.charCodeAt(i));
        }

        const blob = new Blob([buffer], { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(blob);

        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.onended = () => setIsSpeaking(false);
          audioRef.current.onerror = () => setIsSpeaking(false);
          audioRef.current.play().catch(e => console.error("Playback error:", e));
        } else {
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          audio.onended = () => setIsSpeaking(false);
          audio.onerror = () => setIsSpeaking(false);
          audio.play().catch(e => console.error("Playback error:", e));
        }
      } else {
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  };

  const startListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = voiceLanguage;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  const handleSend = async (textOverride?: string) => {
    const messageToSend = textOverride || input;
    if (!messageToSend.trim() || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: messageToSend }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messageToSend,
        config: {
          systemInstruction: `You are a helpful multilingual assistant for "Babu Ji International Memorial School". 
          
          Core Capabilities:
          1. Multilingual Support: Detect the user's language automatically. Respond in the same language the user uses (e.g., Hindi, Urdu, Punjabi, Spanish, French, etc.).
          2. Translation: If a user asks to translate school information or their own message into another language, provide an accurate translation.
          3. School Information: Provide details about Babu Ji International Memorial School.
          
          School Details:
          - Name: Babu Ji International Memorial School
          - Address: Harewali road Sherkot near Police station, District Bijnor Uttar Pradesh, Pin Code 246747
          - Contact: 9759285330, 01344 245031, Inquiry no: 9759709009
          - Motto: "Education is the most powerful weapon which you can use to change the world."
          - Mission: Nurturing students with knowledge, discipline, and moral values.
          - Vice Principal: Mrs. S. Sharma.
          
          Navigation Capabilities:
          If the user wants to go to a specific page, use the navigate_to function.
          Available pages: home, about, gallery, contact, admin.

          Guidelines:
          - Be polite, professional, and concise.
          - If the user speaks in a language other than English, respond in that language.
          - If the user asks "Translate this to [Language]", perform the translation accurately.`,
          tools: [{
            functionDeclarations: [{
              name: "navigate_to",
              parameters: {
                type: "OBJECT",
                properties: {
                  page: {
                    type: "STRING",
                    enum: ["home", "about", "gallery", "contact", "admin"],
                    description: "The page to navigate to"
                  }
                },
                required: ["page"]
              }
            }]
          }]
        }
      });

      const functionCalls = response.functionCalls;
      if (functionCalls) {
        for (const call of functionCalls) {
          if (call.name === "navigate_to") {
            const page = (call.args as { page: string }).page;
            const path = page === 'home' ? '/' : `/${page}`;
            navigate(path);
            setIsOpen(false);
            toast.success(`Navigating to ${page}`);
          }
        }
      }

      const aiResponse = response.text || "I've processed your request.";
      setMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
      speakText(aiResponse);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl chat-shadow w-80 sm:w-96 h-[500px] flex flex-col mb-4 overflow-hidden border border-slate-200"
          >
            <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">School Guide</h3>
                  <div className="flex items-center space-x-2">
                    <p className="text-[10px] opacity-80">Online | AI Powered</p>
                    <select 
                      value={voiceLanguage} 
                      onChange={(e) => setVoiceLanguage(e.target.value)}
                      className="bg-white/10 text-[10px] border-none rounded px-1 outline-none cursor-pointer hover:bg-white/20 transition-colors"
                    >
                      <option value="en-IN" className="text-slate-900">English</option>
                      <option value="hi-IN" className="text-slate-900">Hindi</option>
                      <option value="es-ES" className="text-slate-900">Spanish</option>
                      <option value="fr-FR" className="text-slate-900">French</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isSpeaking && (
                  <button onClick={stopSpeaking} className="hover:bg-white/10 p-1 rounded-full">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
                  }`}>
                    <Markdown>{msg.content}</Markdown>
                    {msg.role === 'ai' && (
                      <button 
                        onClick={() => speakText(msg.content)}
                        className="mt-2 text-[10px] opacity-60 hover:opacity-100 flex items-center"
                      >
                        <Volume2 className="w-3 h-3 mr-1" /> Listen
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex space-x-2">
                <button 
                  onClick={startListening}
                  className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about admissions..."
                  className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isLoading}
                  className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 hover:scale-110 transition-all duration-300"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
};

// --- Pages ---

const Home = () => {
  const [data, setData] = useState<SchoolData>(FALLBACK_DATA);

  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) throw new Error("API not available");
        return res.json();
      })
      .then(setData)
      .catch(err => {
        console.warn("Using fallback data:", err);
        setData(FALLBACK_DATA);
      });
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section - Split Layout */}
      <section className="relative min-h-screen flex flex-col lg:flex-row items-stretch overflow-hidden">
        <div className="lg:w-1/2 relative bg-slate-950 flex flex-col justify-center px-6 sm:px-12 lg:px-24 py-32 lg:py-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10"
          >
            <span className="inline-flex items-center text-emerald-400 text-[10px] font-bold tracking-[0.4em] uppercase mb-8">
              <span className="w-8 h-[1px] bg-emerald-500 mr-4" />
              Est. 2010
            </span>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-[0.9] tracking-tighter">
              Nurturing <br />
              <span className="italic font-serif text-emerald-400">Brilliance</span> <br />
              Together.
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-12 leading-relaxed max-w-lg font-light">
              Babu Ji International Memorial School is a sanctuary of learning where diverse perspectives meet academic excellence.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/about" className="bg-emerald-600 text-white px-10 py-5 rounded-full font-bold hover:bg-emerald-500 hover:-translate-y-1 transition-all flex items-center group shadow-2xl shadow-emerald-900/20">
                Our Philosophy
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="border border-white/20 text-white px-10 py-5 rounded-full font-bold hover:bg-white/10 hover:-translate-y-1 transition-all">
                Apply Now
              </Link>
            </div>
          </motion.div>
          
          <div className="absolute bottom-12 left-6 sm:left-12 lg:left-24 flex items-center space-x-12 opacity-40">
            <div className="flex flex-col">
              <span className="text-white font-bold text-2xl tracking-tighter">1200+</span>
              <span className="text-slate-500 text-[8px] uppercase tracking-widest font-bold">Students</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-2xl tracking-tighter">50+</span>
              <span className="text-slate-500 text-[8px] uppercase tracking-widest font-bold">Faculty</span>
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/2 relative min-h-[50vh] lg:min-h-screen">
          <motion.div 
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1920" 
              alt="Students in classroom" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 to-transparent lg:hidden" />
          </motion.div>
          
          <div className="absolute bottom-12 right-12 hidden lg:block">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl max-w-xs">
              <p className="text-white text-sm italic leading-relaxed mb-4">
                "The diversity here isn't just celebrated; it's our greatest strength in building global citizens."
              </p>
              <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Student Council 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Bar - Minimal */}
      <div className="bg-slate-50 py-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 overflow-hidden relative h-6">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute whitespace-nowrap flex items-center space-x-24"
          >
            {[...data.announcements, ...data.announcements].map((ann, i) => (
              <span key={i} className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-4" />
                {ann.title} — {ann.date}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16">
            {[
              { icon: Users, label: 'Students', value: '1200+' },
              { icon: BookOpen, label: 'Courses', value: '25+' },
              { icon: Award, label: 'Awards', value: '50+' },
              { icon: School, label: 'Years', value: '15+' },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="bg-slate-50 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-sm border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 group-hover:-translate-y-2">
                  <stat.icon className="w-10 h-10" />
                </div>
                <h3 className="text-5xl font-bold text-slate-900 mb-2 tracking-tight">{stat.value}</h3>
                <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Facilities */}
      <section className="py-32 bg-[#F8F7F5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">World-Class Infrastructure</span>
              <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">Facilities that Foster <span className="italic font-serif text-emerald-600">Growth</span></h2>
              <p className="text-slate-500 text-lg font-light leading-relaxed">We provide an environment where technology meets tradition, ensuring our students have access to the best resources for their development.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Digital Classrooms', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7', desc: 'Interactive smart boards and high-speed connectivity in every room.' },
              { title: 'Science Labs', img: 'https://images.unsplash.com/photo-1562774053-701939374585', desc: 'Fully equipped laboratories for physics, chemistry, and biology.' },
              { title: 'Sports Complex', img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18', desc: 'Professional-grade courts and fields for various indoor and outdoor sports.' },
            ].map((facility, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[3rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={facility.img} alt={facility.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <div className="p-10">
                  <h4 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">{facility.title}</h4>
                  <p className="text-slate-500 leading-relaxed font-light">{facility.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Message - Professional Editorial */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <div className="lg:w-1/2 relative">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                  alt="Vice Principal" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply" />
              </div>
              <motion.div 
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                className="absolute -bottom-12 -right-12 bg-slate-950 p-10 rounded-[2rem] shadow-2xl max-w-xs hidden md:block border border-white/10"
              >
                <div className="text-emerald-400 mb-6">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <p className="text-slate-400 italic mb-6 leading-relaxed text-sm">"We don't just teach subjects; we inspire souls to reach their highest potential."</p>
                <div>
                  <p className="font-bold text-white text-lg tracking-tighter">Mrs. S. Sharma</p>
                  <p className="text-emerald-500 text-[9px] uppercase tracking-widest font-bold">Vice Principal</p>
                </div>
              </motion.div>
            </div>
            <div className="lg:w-1/2">
              <span className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[9px] mb-8 block">Leadership Perspective</span>
              <h2 className="text-5xl md:text-7xl font-bold mb-10 text-slate-900 leading-[1.1] tracking-tighter">
                Nurturing the <br />
                <span className="italic font-serif text-emerald-600">Global Citizens</span> <br />
                of Tomorrow.
              </h2>
              <div className="space-y-8 text-slate-500 text-lg leading-relaxed font-light">
                <p>
                  At Babu Ji International Memorial School, we believe that education is a journey of discovery. Our curriculum is designed to challenge the mind while grounding the heart in values that last a lifetime.
                </p>
                <p>
                  We provide a sanctuary for learning where every student is seen, heard, and encouraged to excel in their unique path.
                </p>
                <div className="pt-12 border-t border-slate-100">
                  <p className="font-serif text-3xl italic text-slate-900 mb-4 leading-tight">"Education is the most powerful weapon which you can use to change the world."</p>
                  <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">— Nelson Mandela</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Life - Grid Layout */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <span className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[9px] mb-6 block">Our Environment</span>
              <h2 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight tracking-tighter">A Campus Designed for <span className="italic font-serif text-emerald-600">Inspiration</span></h2>
            </div>
            <p className="text-slate-500 text-lg max-w-sm font-light leading-relaxed">
              Every corner of our campus is crafted to foster curiosity, collaboration, and personal growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="aspect-video rounded-[2rem] overflow-hidden shadow-2xl group">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" 
                  alt="Students collaborating" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-8">
              <div className="flex-1 bg-white p-10 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-center">
                <h4 className="text-2xl font-bold text-slate-900 mb-4 tracking-tighter">Smart Classrooms</h4>
                <p className="text-slate-500 text-sm font-light leading-relaxed">Equipped with the latest interactive technology to make learning immersive.</p>
              </div>
              <div className="flex-1 bg-emerald-600 p-10 rounded-[2rem] shadow-2xl shadow-emerald-900/20 flex flex-col justify-center text-white">
                <h4 className="text-2xl font-bold mb-4 tracking-tighter">Advanced Labs</h4>
                <p className="text-emerald-100 text-sm font-light leading-relaxed">Hands-on learning in science and computer labs with professional guidance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Professional Minimal */}
      <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(16,185,129,0.2),transparent_70%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-24">
            <div className="lg:w-1/3">
              <span className="text-emerald-400 font-bold uppercase tracking-[0.4em] text-[9px] mb-8 block">Our Distinction</span>
              <h2 className="text-5xl font-bold mb-8 leading-tight tracking-tighter">The Babu Ji <br /> Advantage.</h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed">
                We provide a holistic environment that balances academic rigor with creative expression and moral grounding.
              </p>
            </div>
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                { title: 'Global Curriculum', desc: 'Our teaching methods are aligned with international standards while respecting local values.' },
                { title: 'Expert Faculty', desc: 'Highly qualified educators dedicated to nurturing every student\'s unique potential.' },
                { title: 'Holistic Growth', desc: 'Equal emphasis on sports, arts, and character development alongside academics.' },
                { title: 'Modern Facilities', desc: 'State-of-the-art labs and digital classrooms designed for the 21st century.' },
              ].map((feature, i) => (
                <div key={i} className="group">
                  <div className="w-12 h-[1px] bg-emerald-500 mb-8 group-hover:w-24 transition-all duration-500" />
                  <h4 className="text-2xl font-bold mb-4 tracking-tighter">{feature.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-light">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Clean Grid */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-24">
            <span className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[9px] mb-6 block">Community Voices</span>
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tighter">Trusted by Families.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {[
              { name: 'Dr. Amit Verma', role: 'Parent', text: 'The transformation in my son\'s confidence and academic performance has been remarkable since he joined Babu Ji.' },
              { name: 'Mrs. Priya Singh', role: 'Parent', text: 'A truly international school with a heart. The teachers are incredibly supportive and the facilities are top-notch.' },
            ].map((testimonial, i) => (
              <div key={i} className="flex flex-col">
                <div className="text-emerald-600 mb-8">
                  <MessageSquare className="w-12 h-12 opacity-10" />
                </div>
                <p className="text-slate-600 text-2xl font-serif italic mb-10 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm tracking-tight">{testimonial.name}</p>
                    <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Visual Journey</span>
              <h2 className="text-5xl font-bold text-slate-900 mb-6">Life at Babu Ji</h2>
              <p className="text-slate-500 text-lg font-light leading-relaxed">Step inside our vibrant campus and witness the moments that define our student experience.</p>
            </div>
            <Link to="/gallery" className="bg-slate-900 text-white px-10 py-5 rounded-full font-bold hover:bg-emerald-600 hover:-translate-y-1 transition-all flex items-center group shadow-xl shadow-slate-900/10">
              Explore Full Gallery <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {data.gallery.slice(0, 3).map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -15 }}
                className="group relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl"
              >
                <img 
                  src={item.url} 
                  alt={item.caption} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                  <p className="text-white font-serif text-2xl mb-2">{item.caption}</p>
                  <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const About = () => (
  <div className="pt-40 pb-32 bg-white">
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
      <div className="flex flex-col lg:flex-row gap-24 items-center mb-32">
        <div className="lg:w-1/2">
          <span className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[9px] mb-8 block">Our Identity</span>
          <h1 className="text-6xl md:text-8xl font-bold text-slate-900 mb-10 leading-[0.9] tracking-tighter">
            A Legacy of <br />
            <span className="italic font-serif text-emerald-600">Excellence.</span>
          </h1>
          <p className="text-slate-500 text-xl font-light leading-relaxed mb-12">
            Founded on the principles of integrity and innovation, Babu Ji International Memorial School has been a beacon of quality education for over a decade.
          </p>
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h4 className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4">Our Vision</h4>
              <p className="text-slate-500 text-sm leading-relaxed font-light">To be a global leader in education, nurturing students who are academically brilliant and morally grounded.</p>
            </div>
            <div>
              <h4 className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4">Our Mission</h4>
              <p className="text-slate-500 text-sm leading-relaxed font-light">To provide a stimulating environment that encourages discovery, critical thinking, and character building.</p>
            </div>
          </div>
        </div>
        <div className="lg:w-1/2 relative">
          <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl group">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000" 
              alt="Students collaborating" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-8 -left-8 bg-emerald-600 text-white p-10 rounded-[2rem] shadow-2xl hidden md:block">
            <p className="text-4xl font-bold tracking-tighter mb-1">15+</p>
            <p className="text-[10px] uppercase tracking-widest font-bold opacity-80">Years of Impact</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[4rem] p-20 shadow-sm border border-slate-100 mb-32">
        <h2 className="text-4xl font-bold text-center mb-20">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-20">
          {[
            { title: 'Integrity', desc: 'We uphold the highest standards of honesty and ethical behavior in everything we do.' },
            { title: 'Excellence', desc: 'We strive for the absolute best in academics, sports, arts, and character development.' },
            { title: 'Compassion', desc: 'We foster a culture of kindness, empathy, and respect for every individual.' },
          ].map((val, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8 font-serif text-3xl font-bold group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                {i + 1}
              </div>
              <h4 className="text-2xl font-bold mb-4 text-slate-900">{val.title}</h4>
              <p className="text-slate-500 text-base leading-relaxed font-light">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-32">
        <div className="text-center mb-20">
          <span className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Our Educators</span>
          <h2 className="text-5xl font-bold text-slate-900">Meet Our Faculty</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { name: 'Mr. R.K. Gupta', role: 'Senior Mathematics', img: 'https://images.unsplash.com/photo-1544161515-4af6ce1ad8b1' },
            { name: 'Dr. Anjali Verma', role: 'Head of Science', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2' },
            { name: 'Mrs. S. Kapoor', role: 'English Literature', img: 'https://images.unsplash.com/photo-1580894732230-2867e638d145' },
            { name: 'Mr. Vikram Singh', role: 'Physical Education', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e' },
          ].map((faculty, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="group"
            >
              <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-6 shadow-sm group-hover:shadow-2xl transition-all duration-500">
                <img src={faculty.img} alt={faculty.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">{faculty.name}</h4>
              <p className="text-emerald-600 text-sm font-semibold">{faculty.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>(FALLBACK_DATA.gallery);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) throw new Error("API not available");
        return res.json();
      })
      .then(data => setItems(data.gallery))
      .catch(err => {
        console.warn("Using fallback gallery data:", err);
        setItems(FALLBACK_DATA.gallery);
      });
  }, []);

  const categories = ['All', 'Academic', 'Sports', 'Events', 'Campus'];
  const filteredItems = filter === 'All' 
    ? items 
    : items.filter(item => item.caption.toLowerCase().includes(filter.toLowerCase()) || filter === 'Campus');

  return (
    <div className="pt-40 pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
          <div className="max-w-2xl">
            <span className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[9px] mb-6 block">Visual Journey</span>
            <h1 className="text-6xl md:text-8xl font-bold text-slate-900 leading-[0.9] tracking-tighter">Moments of <br /><span className="italic font-serif text-emerald-600">Growth.</span></h1>
          </div>
          <div className="flex flex-wrap gap-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  filter === cat ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-100"
              >
                <img 
                  src={item.url} 
                  alt={item.caption} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                  <p className="text-white font-serif text-2xl mb-2">{item.caption}</p>
                  <div className="w-12 h-1 bg-emerald-500 rounded-full" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('Message sent successfully!');
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      }
    } catch {
      toast.error('Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-40 pb-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-24">
          <div className="lg:w-1/2">
            <span className="text-emerald-600 font-bold uppercase tracking-[0.4em] text-[9px] mb-8 block">Connect</span>
            <h1 className="text-6xl md:text-8xl font-bold text-slate-900 mb-10 leading-[0.9] tracking-tighter">Get in <br /><span className="italic font-serif text-emerald-600">Touch.</span></h1>
            <p className="text-slate-500 text-xl font-light leading-relaxed mb-16">
              Whether you have questions about admissions or our curriculum, our team is here to guide you through the process.
            </p>
            
            <div className="space-y-12">
              {[
                { icon: MapPin, title: 'Our Location', content: 'Harewali road Sherkot near Police station, District Bijnor Uttar Pradesh, Pin Code 246747' },
                { icon: Phone, title: 'Phone Numbers', content: '9759285330, 01344 245031', sub: 'Inquiry: 9759709009' },
                { icon: Mail, title: 'Email Addresses', content: 'info@babujischool.com', sub: 'admissions@babujischool.com' },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-8 group">
                  <div className="bg-slate-50 p-6 rounded-[1.5rem] text-slate-900 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xl mb-2 tracking-tight">{item.title}</h4>
                    <p className="text-slate-500 text-base leading-relaxed font-light">{item.content}</p>
                    {item.sub && <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest mt-2">{item.sub}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100 shadow-sm relative">
              <div className="absolute -top-6 -right-6 bg-slate-950 text-white p-6 rounded-[2rem] shadow-xl">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-10 tracking-tighter">Send a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-4">First Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                      placeholder="John" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-4">Last Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                      placeholder="Doe" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-4">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" 
                    placeholder="john@example.com" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em] ml-4">Your Message</label>
                  <textarea 
                    rows={5} 
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none" 
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-slate-950 text-white py-5 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-2xl shadow-slate-900/10 flex items-center justify-center group disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [data, setData] = useState<SchoolData & { contacts: { id: string; firstName: string; lastName: string; email: string; message: string; date: string }[], newsletter: string[] } | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newAnn, setNewAnn] = useState('');
  const [activeTab, setActiveTab] = useState<'gallery' | 'announcements' | 'contacts' | 'newsletter'>('gallery');

  const fetchData = async () => {
    const res = await fetch('/api/data');
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLoggedIn(true);
      toast.success('Logged in successfully');
    } else {
      toast.error('Invalid password');
    }
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: newUrl, caption: newCaption })
    });
    if (res.ok) {
      fetchData();
      setNewUrl('');
      setNewCaption('');
      toast.success('Photo added');
    }
  };

  const handleAddAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnn) return;
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newAnn })
    });
    if (res.ok) {
      fetchData();
      setNewAnn('');
      toast.success('Announcement added');
    }
  };

  const handleDeleteGallery = async (id: string) => {
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchData();
      toast.success('Photo removed');
    }
  };

  const handleDeleteAnn = async (id: string) => {
    const res = await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchData();
      toast.success('Announcement removed');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
            <p className="text-slate-500 text-sm">Enter password to manage school data</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <h1 className="text-4xl font-bold text-slate-900">Admin Dashboard</h1>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'gallery', label: 'Gallery', icon: Camera },
              { id: 'announcements', label: 'Updates', icon: Bell },
              { id: 'contacts', label: 'Inquiries', icon: Mail },
              { id: 'newsletter', label: 'Subscribers', icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'gallery' | 'announcements' | 'contacts' | 'newsletter')}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
            <button onClick={() => setIsLoggedIn(false)} className="px-4 py-2 text-slate-500 hover:text-red-500 text-sm font-medium">Logout</button>
          </div>
        </div>

        {activeTab === 'gallery' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Plus className="mr-2 w-5 h-5 text-emerald-600" /> Add Photo
                </h3>
                <form onSubmit={handleAddGallery} className="space-y-4">
                  <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="Image URL"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <input
                    type="text"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Caption"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all">
                    Add to Gallery
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {data?.gallery.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 group">
                    <div className="aspect-video relative">
                      <img src={item.url} alt={item.caption} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button 
                        onClick={() => handleDeleteGallery(item.id)}
                        className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <p className="font-medium text-slate-900">{item.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Plus className="mr-2 w-5 h-5 text-emerald-600" /> Add Update
                </h3>
                <form onSubmit={handleAddAnn} className="space-y-4">
                  <textarea
                    value={newAnn}
                    onChange={(e) => setNewAnn(e.target.value)}
                    placeholder="Announcement text..."
                    rows={3}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all">
                    Post Update
                  </button>
                </form>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              {data?.announcements.map((ann) => (
                <div key={ann.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-900">{ann.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{ann.date}</p>
                  </div>
                  <button onClick={() => handleDeleteAnn(ann.id)} className="text-slate-400 hover:text-red-500 p-2">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {data?.contacts.length === 0 && <p className="text-center py-12 text-slate-400">No inquiries yet.</p>}
            {data?.contacts.map((msg) => (
              <div key={msg.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-lg text-slate-900">{msg.firstName} {msg.lastName}</h4>
                    <p className="text-sm text-emerald-600 font-medium">{msg.email}</p>
                  </div>
                  <span className="text-xs text-slate-400">{new Date(msg.date).toLocaleString()}</span>
                </div>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl">{msg.message}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'newsletter' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.newsletter.map((email: string, i: number) => (
                  <tr key={i}>
                    <td className="px-8 py-4 text-sm text-slate-700 font-medium">{email}</td>
                    <td className="px-8 py-4 text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminPortal />} />
          </Routes>
        </main>
        <Footer />
        <ChatAssistant />
        <Toaster position="top-center" />
      </div>
    </Router>
  );
}
