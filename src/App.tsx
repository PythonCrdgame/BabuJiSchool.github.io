import React, { useState, useEffect, useRef } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useLocation
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
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <School className="text-white w-6 h-6" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
                Babu Ji International
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                  location.pathname === link.path ? 'text-emerald-600' : 'text-slate-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/admin"
              className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all"
            >
              Admin Portal
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
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

const Footer = () => (
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
          <div className="flex">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-slate-800 border-none rounded-l-lg px-4 py-2 w-full text-sm focus:ring-1 focus:ring-emerald-500"
            />
            <button className="bg-emerald-600 text-white px-4 py-2 rounded-r-lg hover:bg-emerald-700 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 pt-8 text-center text-xs">
        <p>&copy; {new Date().getFullYear()} Babu Ji International Memorial School. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

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
          
          Answer questions about admissions, location, contact info, and school philosophy in a polite and professional manner. Keep responses concise. If the user speaks in Hindi, you can respond in Hindi or Hinglish.`
        }
      });

      const aiResponse = response.text || "I'm sorry, I couldn't process that.";
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
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=1920" 
            alt="School Campus" 
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block bg-emerald-600/90 backdrop-blur-sm text-white px-4 py-1 rounded-full text-xs font-semibold tracking-widest uppercase mb-6">
              Excellence in Education
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Babu Ji International <br />
              <span className="italic font-serif text-emerald-400">Memorial School</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed">
              Empowering students with knowledge, discipline, and moral values for a brighter future.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/about" className="bg-emerald-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-700 transition-all flex items-center group">
                Discover More
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all">
                Enquire Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Notices & Circulars Section (Inspired by PMS Dhampur) */}
      <section className="py-12 bg-emerald-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="flex items-center space-x-3 shrink-0 mr-8">
            <Bell className="w-6 h-6 animate-bounce" />
            <span className="font-bold uppercase tracking-wider text-sm">Latest Updates:</span>
          </div>
          <div className="flex-1 overflow-hidden relative h-6">
            <motion.div 
              animate={{ x: ["100%", "-100%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute whitespace-nowrap flex space-x-12"
            >
              {data.announcements.map(ann => (
                <span key={ann.id} className="text-sm font-medium">
                  • {ann.title} ({ann.date})
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Users, label: 'Students', value: '1200+' },
              { icon: BookOpen, label: 'Courses', value: '25+' },
              { icon: Award, label: 'Awards', value: '50+' },
              { icon: School, label: 'Years', value: '15+' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <stat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-slate-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800" 
                  alt="Vice Principal" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-3xl shadow-xl max-w-xs hidden md:block border border-slate-100">
                <p className="text-slate-600 italic mb-4">"We aim to achieve excellence in all spheres of life."</p>
                <p className="font-bold text-slate-900">Vice Principal</p>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-8 text-slate-900">Message from the <br /><span className="text-emerald-600">Vice Principal</span></h2>
              <div className="space-y-6 text-slate-600 leading-relaxed">
                <p>
                  Education shapes not only the intellect but also the character of an individual. Our school is dedicated to nurturing students with knowledge, discipline, moral values, and a spirit of lifelong learning.
                </p>
                <p>
                  We strive to create a supportive and motivating environment where every child can discover their potential and grow into a confident and responsible citizen.
                </p>
                <p>
                  With the continuous efforts of our teachers, the cooperation of parents, and the hard work of students, we aim to achieve excellence in all spheres.
                </p>
                <div className="pt-6">
                  <p className="font-serif text-xl font-bold text-slate-900">Regards,</p>
                  <p className="text-emerald-600 font-semibold">Vice Principal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-4">Life at Babu Ji</h2>
              <p className="text-slate-500">Glimpses of our vibrant campus and activities.</p>
            </div>
            <Link to="/gallery" className="text-emerald-600 font-semibold flex items-center hover:underline">
              View All Gallery <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.gallery.slice(0, 3).map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ y: -10 }}
                className="group relative aspect-video rounded-2xl overflow-hidden shadow-lg"
              >
                <img 
                  src={item.url} 
                  alt={item.caption} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white font-medium">{item.caption}</p>
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
  <div className="pt-32 pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">About Our School</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">Founded with a vision to provide quality education and character building.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
        <div className="space-y-8">
          <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100">
            <h3 className="text-2xl font-bold text-emerald-900 mb-4 flex items-center">
              <BookOpen className="mr-3 w-6 h-6" /> Our Vision
            </h3>
            <p className="text-emerald-800/80 leading-relaxed">
              To be a global leader in education, fostering innovation, integrity, and excellence in every student.
            </p>
          </div>
          <div className="bg-slate-900 p-8 rounded-3xl text-white">
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <Award className="mr-3 w-6 h-6 text-emerald-400" /> Our Mission
            </h3>
            <p className="text-slate-300 leading-relaxed">
              To provide a nurturing environment that empowers students to achieve their full potential and become responsible global citizens.
            </p>
          </div>
        </div>
        <div className="aspect-square rounded-3xl overflow-hidden shadow-xl">
          <img 
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800" 
            alt="Students Studying" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-slate-100">
        <h2 className="text-3xl font-bold text-center mb-12">Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
          {[
            { title: 'Integrity', desc: 'We uphold the highest standards of honesty and ethical behavior.' },
            { title: 'Excellence', desc: 'We strive for the best in academics, sports, and character.' },
            { title: 'Compassion', desc: 'We foster a culture of kindness and empathy for all.' },
          ].map((val, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 font-bold text-xl">
                {i + 1}
              </div>
              <h4 className="text-xl font-bold mb-3">{val.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{val.desc}</p>
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
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">School Gallery</h1>
          <p className="text-slate-500">Capturing moments of joy, learning, and achievement.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group aspect-square rounded-3xl overflow-hidden shadow-lg relative"
            >
              <img 
                src={item.url} 
                alt={item.caption} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6 text-center">
                <p className="text-white font-medium text-lg">{item.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Contact = () => (
  <div className="pt-32 pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h1 className="text-5xl font-bold text-slate-900 mb-8">Get in Touch</h1>
          <p className="text-slate-500 mb-12 text-lg">We'd love to hear from you. Whether you have a question about admissions or just want to say hi, our team is here to help.</p>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-6">
              <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Our Location</h4>
                <p className="text-slate-500 text-sm">Harewali road Sherkot near Police station, District Bijnor Uttar Pradesh, Pin Code 246747</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Phone Numbers</h4>
                <p className="text-slate-500 text-sm">9759285330, 01344 245031</p>
                <p className="text-slate-500 text-sm">Inquiry: 9759709009</p>
              </div>
            </div>
            <div className="flex items-start space-x-6">
              <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Email Address</h4>
                <p className="text-slate-500 text-sm">info@babujischool.com</p>
                <p className="text-slate-500 text-sm">admissions@babujischool.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                <input type="text" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                <input type="text" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <input type="email" className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
              <textarea rows={4} className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500" placeholder="How can we help you?"></textarea>
            </div>
            <button className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);

const AdminPortal = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/data').then(res => res.json()).then(data => setGallery(data.gallery));
    }
  }, [isLoggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple demo password
      setIsLoggedIn(true);
      toast.success('Logged in successfully');
    } else {
      toast.error('Invalid password');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: newUrl, caption: newCaption })
    });
    
    if (res.ok) {
      const newItem = await res.json();
      setGallery(prev => [newItem, ...prev]);
      setNewUrl('');
      setNewCaption('');
      toast.success('Photo added to gallery');
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setGallery(prev => prev.filter(item => item.id !== id));
      toast.success('Photo removed');
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
            <p className="text-slate-500 text-sm">Enter password to manage gallery</p>
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
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900">Manage Gallery</h1>
          <button onClick={() => setIsLoggedIn(false)} className="text-slate-500 hover:text-red-500 font-medium">Logout</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 sticky top-32">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Plus className="mr-2 w-5 h-5 text-emerald-600" /> Add New Photo
              </h3>
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Image URL</label>
                  <input
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Caption</label>
                  <input
                    type="text"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="e.g. Science Lab"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <button className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all mt-4">
                  Add to Gallery
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {gallery.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 group">
                  <div className="aspect-video relative">
                    <img src={item.url} alt={item.caption} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button 
                      onClick={() => handleDelete(item.id)}
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
