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
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { GoogleGenAI, Modality } from "@google/genai";
import Markdown from 'react-markdown';

// --- Constants & Fallbacks ---
const FALLBACK_DATA: SchoolData = {
  gallery: [
    { id: "1", url: "https://images.unsplash.com/photo-1523050853063-bd8012fec4c8?auto=format&fit=crop&q=80&w=1000", caption: "Main Academic Block" },
    { id: "2", url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1000", caption: "Modern Science Laboratory" },
    { id: "3", url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1000", caption: "Annual Sports Meet 2025" },
    { id: "4", url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000", caption: "Interactive Classroom Session" },
  ],
  announcements: [
    { id: "1", title: "Registration Open for Session 2026-27", date: "2026-02-21" },
    { id: "2", title: "Board Examination Schedule Released", date: "2026-02-18" },
    { id: "3", title: "Annual Day Celebration - March 15th", date: "2026-02-10" }
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
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between h-24">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="bg-emerald-600 p-2.5 rounded-xl shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                <School className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold tracking-tight text-slate-900 leading-none">
                  Babu Ji International
                </span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-600 font-bold mt-1">
                  Memorial School
                </span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-xs uppercase tracking-[0.15em] font-bold transition-all hover:text-emerald-600 relative py-2 ${
                  location.pathname === link.path ? 'text-emerald-600' : 'text-slate-500'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full"
                  />
                )}
              </Link>
            ))}
            <Link
              to="/admin"
              className="bg-slate-900 text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10"
            >
              Portal
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 p-2 bg-slate-100 rounded-xl">
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
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <School className="text-emerald-500 w-8 h-8" />
              <span className="font-serif text-2xl font-bold text-white">Babu Ji</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Nurturing excellence and character since inception. We believe in the power of education to transform lives.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 cursor-pointer hover:text-emerald-500 transition-colors" />
              <Twitter className="w-5 h-5 cursor-pointer hover:text-emerald-500 transition-colors" />
              <Instagram className="w-5 h-5 cursor-pointer hover:text-emerald-500 transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="hover:text-emerald-500 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-emerald-500 transition-colors">About Us</Link></li>
              <li><Link to="/gallery" className="hover:text-emerald-500 transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact Info</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Harewali road Sherkot near Police station, District Bijnor, UP 246747</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>+91 9759285330, 01344 245031</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>info@babujischool.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Newsletter</h4>
            <p className="text-sm mb-4">Stay updated with our latest news and events.</p>
            <form onSubmit={handleNewsletter} className="flex">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address" 
                required
                className="bg-slate-800 border-none rounded-l-lg px-4 py-2 w-full text-sm focus:ring-1 focus:ring-emerald-500"
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-600 text-white px-4 py-2 rounded-r-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} Babu Ji International Memorial School. All rights reserved.</p>
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
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
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
    recognition.lang = 'en-IN';
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
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messageToSend,
        config: {
          systemInstruction: `You are a helpful assistant for "Babu Ji International Memorial School". 
          School Details:
          - Name: Babu Ji International Memorial School
          - Address: Harewali road Sherkot near Police station, District Bijnor Uttar Pradesh, Pin Code 246747
          - Contact: 9759285330, 01344 245031, Inquiry no: 9759709009
          - Motto: "Education is the most powerful weapon which you can use to change the world."
          - Mission: Nurturing students with knowledge, discipline, and moral values.
          - Vice Principal: Dedicated to creating a supportive environment.
          
          Navigation Capabilities:
          If the user wants to go to a specific page, use the navigate_to function.
          Available pages: home, about, gallery, contact, admin.

          Answer questions about admissions, location, contact info, and school philosophy in a polite and professional manner. Keep responses concise. If the user speaks in Hindi, you can respond in Hindi or Hinglish.`,
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
                  <p className="text-[10px] opacity-80">Online | AI Powered</p>
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
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[95vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1920" 
            alt="Babu Ji International Memorial School Campus" 
            className="w-full h-full object-cover brightness-[0.45] scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FDFCFB]" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <span className="inline-flex items-center bg-emerald-600/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 px-5 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2 animate-pulse" />
              Excellence in Education
            </span>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-[0.95] tracking-tight">
              A Legacy of <br />
              <span className="italic font-serif text-emerald-400">Wisdom & Character</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-2xl font-light">
              Empowering the next generation with knowledge, discipline, and the moral courage to change the world.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/about" className="bg-emerald-600 text-white px-10 py-5 rounded-full font-bold hover:bg-emerald-700 transition-all flex items-center group shadow-xl shadow-emerald-900/20">
                Discover Our Story
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="bg-white/5 backdrop-blur-xl border border-white/20 text-white px-10 py-5 rounded-full font-bold hover:bg-white/10 transition-all">
                Admissions 2026
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Notices & Circulars Section */}
      <section className="py-16 bg-emerald-600 text-white relative z-20 -mt-12 mx-4 sm:mx-8 lg:mx-12 rounded-[2rem] shadow-2xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 flex items-center">
          <div className="flex items-center space-x-4 shrink-0 mr-12 border-r border-white/20 pr-12">
            <div className="bg-white/20 p-2 rounded-xl">
              <Bell className="w-6 h-6 animate-bounce" />
            </div>
            <span className="font-bold uppercase tracking-[0.15em] text-xs">Announcements</span>
          </div>
          <div className="flex-1 overflow-hidden relative h-8">
            <motion.div 
              animate={{ x: ["100%", "-100%"] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute whitespace-nowrap flex items-center space-x-24"
            >
              {data.announcements.map(ann => (
                <span key={ann.id} className="text-sm font-medium flex items-center">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full mr-3" />
                  {ann.title} <span className="opacity-60 ml-2">[{ann.date}]</span>
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
            {[
              { icon: Users, label: 'Students', value: '1200+' },
              { icon: BookOpen, label: 'Courses', value: '25+' },
              { icon: Award, label: 'Awards', value: '50+' },
              { icon: School, label: 'Years', value: '15+' },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="bg-white w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-emerald-600 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                  <stat.icon className="w-10 h-10" />
                </div>
                <h3 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">{stat.value}</h3>
                <p className="text-slate-500 text-xs uppercase tracking-widest font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-32 bg-[#F8F7F5]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                  alt="Vice Principal" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply" />
              </div>
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                className="absolute -bottom-12 -right-12 bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-xs hidden md:block border border-slate-100"
              >
                <div className="text-emerald-600 mb-4">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <p className="text-slate-600 italic mb-6 leading-relaxed">"We don't just teach subjects; we inspire souls to reach their highest potential."</p>
                <div>
                  <p className="font-bold text-slate-900 text-lg">Mrs. S. Sharma</p>
                  <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wider">Vice Principal</p>
                </div>
              </motion.div>
            </div>
            <div className="lg:pl-12">
              <span className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-6 block">Leadership Message</span>
              <h2 className="text-5xl md:text-6xl font-bold mb-10 text-slate-900 leading-tight">
                Nurturing the <br />
                <span className="italic font-serif text-emerald-600">Leaders of Tomorrow</span>
              </h2>
              <div className="space-y-8 text-slate-600 text-lg leading-relaxed font-light">
                <p>
                  At Babu Ji International Memorial School, we believe that education is a journey of discovery. Our curriculum is designed to challenge the mind while grounding the heart in values that last a lifetime.
                </p>
                <p>
                  We provide a sanctuary for learning where every student is seen, heard, and encouraged to excel in their unique path.
                </p>
                <div className="pt-8 border-t border-slate-200">
                  <p className="font-serif text-2xl italic text-slate-900 mb-2">"Education is the most powerful weapon which you can use to change the world."</p>
                  <p className="text-slate-400 text-sm">— Nelson Mandela</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Life Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <span className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-6 block">Our Environment</span>
              <h2 className="text-5xl font-bold text-slate-900 mb-8 leading-tight">A Campus Designed for <span className="italic font-serif text-emerald-600">Inspiration</span></h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-10 font-light">
                Our state-of-the-art campus provides the perfect backdrop for academic excellence and personal growth. From modern laboratories to serene study spaces, every corner is crafted to inspire.
              </p>
              <ul className="space-y-6">
                {[
                  { title: 'Smart Classrooms', desc: 'Equipped with the latest interactive technology.' },
                  { title: 'Advanced Labs', desc: 'Hands-on learning in science and computer labs.' },
                  { title: 'Lush Greenery', desc: 'A peaceful environment close to nature.' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-4">
                    <div className="bg-emerald-100 p-1.5 rounded-lg text-emerald-600 mt-1">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-500 text-sm">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-7 grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=800" alt="Campus" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1523050853063-bd8012fec4c8?auto=format&fit=crop&q=80&w=800" alt="Building" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800" alt="Lab" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800" alt="Students" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              </div>
            </div>
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
            <Link to="/gallery" className="bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-600 transition-all flex items-center group">
              Explore Full Gallery <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {data.gallery.slice(0, 3).map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ y: -15 }}
                className="group relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl"
              >
                <img 
                  src={item.url} 
                  alt={item.caption} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
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
  <div className="pt-40 pb-32">
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
      <div className="text-center mb-24">
        <span className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Our Heritage</span>
        <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-8">About Our School</h1>
        <p className="text-slate-500 text-xl font-light max-w-2xl mx-auto leading-relaxed">Founded with a vision to provide quality education and character building for the leaders of tomorrow.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32 items-center">
        <div className="space-y-12">
          <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl transition-shadow">
            <h3 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
              <div className="bg-emerald-100 p-2 rounded-xl mr-4">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
              Our Vision
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed font-light">
              To be a global leader in education, fostering innovation, integrity, and excellence in every student. We envision a community where every child is empowered to design their own future.
            </p>
          </div>
          <div className="bg-slate-900 p-12 rounded-[3rem] text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-6 flex items-center">
              <div className="bg-emerald-600 p-2 rounded-xl mr-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              Our Mission
            </h3>
            <p className="text-slate-300 text-lg leading-relaxed font-light">
              To provide a nurturing environment that empowers students to achieve their full potential and become responsible global citizens through academic excellence and strong moral values.
            </p>
          </div>
        </div>
        <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl relative">
          <img 
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=1000" 
            alt="Students Studying" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-emerald-900/10 mix-blend-multiply" />
        </div>
      </div>

      <div className="bg-white rounded-[4rem] p-20 shadow-sm border border-slate-100">
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
    </div>
  </div>
);

const Gallery = () => {
  const [items, setItems] = useState<GalleryItem[]>(FALLBACK_DATA.gallery);

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

  return (
    <div className="pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-24">
          <span className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Visual Archives</span>
          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-8">School Gallery</h1>
          <p className="text-slate-500 text-xl font-light max-w-2xl mx-auto leading-relaxed">Capturing the vibrant moments of joy, discovery, and achievement that define our community.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {items.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -15 }}
              className="group aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl relative"
            >
              <img 
                src={item.url} 
                alt={item.caption} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
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
    <div className="pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div>
            <span className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-4 block">Connect With Us</span>
            <h1 className="text-6xl md:text-7xl font-bold text-slate-900 mb-10">Get in Touch</h1>
            <p className="text-slate-500 mb-16 text-xl font-light leading-relaxed">We'd love to hear from you. Whether you have a question about admissions or just want to say hi, our team is here to help.</p>
            
            <div className="space-y-12">
              <div className="flex items-start space-x-8">
                <div className="bg-emerald-50 p-5 rounded-[1.5rem] text-emerald-600 shadow-sm">
                  <MapPin className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xl mb-2">Our Location</h4>
                  <p className="text-slate-500 text-base leading-relaxed font-light">Harewali road Sherkot near Police station, District Bijnor Uttar Pradesh, Pin Code 246747</p>
                </div>
              </div>
              <div className="flex items-start space-x-8">
                <div className="bg-emerald-50 p-5 rounded-[1.5rem] text-emerald-600 shadow-sm">
                  <Phone className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xl mb-2">Phone Numbers</h4>
                  <p className="text-slate-500 text-base leading-relaxed font-light">9759285330, 01344 245031</p>
                  <p className="text-emerald-600 text-sm font-semibold mt-1">Inquiry: 9759709009</p>
                </div>
              </div>
              <div className="flex items-start space-x-8">
                <div className="bg-emerald-50 p-5 rounded-[1.5rem] text-emerald-600 shadow-sm">
                  <Mail className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xl mb-2">Email Address</h4>
                  <p className="text-slate-500 text-base leading-relaxed font-light">info@babujischool.com</p>
                  <p className="text-slate-500 text-base leading-relaxed font-light">admissions@babujischool.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-16 rounded-[4rem] shadow-2xl border border-slate-100 relative">
            <div className="absolute -top-6 -right-6 bg-emerald-600 text-white p-6 rounded-[2rem] shadow-xl">
              <MessageSquare className="w-8 h-8" />
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">First Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500 transition-all" 
                    placeholder="John" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Last Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500 transition-all" 
                    placeholder="Doe" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500 transition-all" 
                  placeholder="john@example.com" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Your Message</label>
                <textarea 
                  rows={5} 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 focus:ring-2 focus:ring-emerald-500 transition-all" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
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
