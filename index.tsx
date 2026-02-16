import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Home, 
  Image as ImageIcon, 
  Info, 
  LogIn, 
  UserPlus, 
  MessageSquare, 
  X, 
  Send, 
  ChevronRight, 
  GraduationCap, 
  Users, 
  Trophy,
  Calendar,
  Menu,
  School,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  ArrowRight,
  Minimize2
} from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob, Type, FunctionDeclaration } from "@google/genai";

// --- Types ---
type Page = 'home' | 'gallery' | 'about' | 'login' | 'signup';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// --- Audio Helpers ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- Components ---

const Navbar = ({ currentPage, setCurrentPage }: { currentPage: Page, setCurrentPage: (p: Page) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems: { id: Page, label: string, icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'about', label: 'About', icon: Info },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'login', label: 'Login', icon: LogIn },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="bg-blue-900 p-2.5 rounded-xl text-white shadow-lg shadow-blue-900/20">
                <School size={24} />
              </div>
              <div>
                <span className="text-xl font-bold text-blue-900 tracking-tight block leading-tight">Babu Ji School</span>
                <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold leading-none">Excellence in Education</p>
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all rounded-lg ${
                  currentPage === item.id 
                    ? 'bg-blue-50 text-blue-900' 
                    : 'text-slate-500 hover:text-blue-900 hover:bg-slate-50'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </button>
            ))}
            <div className="w-px h-6 bg-slate-200 mx-2" />
            <button 
              onClick={() => setCurrentPage('signup')}
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              Enroll Now <ArrowRight size={16} />
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-2 animate-in fade-in slide-in-from-top-4 duration-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setCurrentPage(item.id); setIsOpen(false); }}
              className={`flex items-center gap-3 w-full text-left px-4 py-4 text-base font-semibold rounded-xl ${
                currentPage === item.id ? 'bg-blue-50 text-blue-900' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
          <button 
            onClick={() => { setCurrentPage('signup'); setIsOpen(false); }}
            className="w-full bg-blue-900 text-white px-5 py-4 rounded-xl font-bold text-sm flex justify-center items-center gap-2"
          >
            Admissions 2024 <ArrowRight size={18} />
          </button>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-white py-16 px-4">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="col-span-1 md:col-span-1">
        <div className="flex items-center gap-2 mb-6">
          <School className="text-yellow-400" size={32} />
          <span className="text-2xl font-bold">Babu Ji School</span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          Cultivating a world-class environment for holistic growth, academic excellence, and character building since 1985.
        </p>
      </div>
      <div>
        <h4 className="text-lg font-bold mb-6 text-yellow-400">Our Campus</h4>
        <p className="text-slate-400 text-sm leading-loose">
          123 Academic Square,<br />
          Vidyapith Road, New Delhi<br />
          110001, India<br />
          <span className="block mt-4">Tel: +91 11 2345 6789</span>
          <span>Email: admissions@babuji.edu</span>
        </p>
      </div>
      <div>
        <h4 className="text-lg font-bold mb-6 text-yellow-400">Resources</h4>
        <ul className="space-y-3 text-sm text-slate-400">
          {['Curriculum', 'Fee Structure', 'Transport', 'Scholarships', 'Board Exam Results'].map(item => (
            <li key={item} className="hover:text-yellow-400 cursor-pointer transition-colors flex items-center gap-2">
              <div className="w-1 h-1 bg-slate-700 rounded-full" /> {item}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="text-lg font-bold mb-6 text-yellow-400">Newsletter</h4>
        <p className="text-slate-400 text-sm mb-4">Subscribe to get latest school updates.</p>
        <div className="flex gap-2">
          <input type="text" placeholder="Email address" className="bg-slate-800 border-none rounded-xl px-4 py-3 text-sm w-full focus:ring-2 focus:ring-yellow-400 outline-none transition-all" />
          <button className="bg-yellow-500 text-blue-900 font-bold px-4 py-3 rounded-xl text-sm hover:bg-yellow-600 active:scale-95 transition-all">Join</button>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto border-t border-slate-800 mt-16 pt-8 text-center text-slate-500 text-xs tracking-widest uppercase font-bold">
      &copy; 2024 Babu Ji Senior Secondary School. Empowering Futures.
    </div>
  </footer>
);

const HomePage = ({ onNavigate }: { onNavigate: (p: Page) => void }) => (
  <div className="space-y-24 pb-20 overflow-hidden">
    <section className="relative h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?auto=format&fit=crop&q=80&w=2000" 
          className="w-full h-full object-cover brightness-[0.35]"
          alt="Babu Ji School Campus"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="inline-flex items-center gap-2 bg-yellow-400/20 backdrop-blur-md border border-yellow-400/30 text-yellow-400 px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-[0.2em] mb-8">
          <Sparkles size={14} /> Admissions 2024 Now Open
        </div>
        <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-[1.1] max-w-4xl tracking-tight">
          Nurturing Minds, <br />Building <span className="text-yellow-400 italic font-serif">Legacies.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl leading-relaxed font-light">
          At Babu Ji School, we blend ancient wisdom with modern technology to provide an education that prepares students for the challenges of tomorrow.
        </p>
        <div className="flex flex-wrap gap-5">
          <button 
            onClick={() => onNavigate('signup')}
            className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-10 py-5 rounded-2xl font-black transition-all shadow-2xl flex items-center gap-3 active:scale-95 text-lg"
          >
            Get Started <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => onNavigate('about')}
            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/40 px-10 py-5 rounded-2xl font-bold transition-all flex items-center gap-2 text-lg"
          >
            Campus Tour
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-50 clip-path-wave" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }} />
    </section>

    <section className="max-w-7xl mx-auto px-4">
      <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 p-8 md:p-16 grid grid-cols-2 md:grid-cols-4 gap-12 -mt-32 relative z-20">
        {[
          { icon: GraduationCap, label: 'Alumni', count: '12,500+', color: 'bg-blue-50 text-blue-600' },
          { icon: Users, label: 'Faculty', count: '95+', color: 'bg-green-50 text-green-600' },
          { icon: Trophy, label: 'Awards', count: '310+', color: 'bg-yellow-50 text-yellow-600' },
          { icon: Calendar, label: 'Years', count: '39', color: 'bg-purple-50 text-purple-600' },
        ].map((stat, i) => (
          <div key={i} className="text-center group">
            <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.color} rounded-[24px] mb-6 transition-transform group-hover:scale-110 duration-500`}>
              <stat.icon size={28} />
            </div>
            <div className="text-4xl font-black text-slate-900 mb-2">{stat.count}</div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Latest Updates</h2>
        <div className="w-24 h-1.5 bg-yellow-400 mx-auto rounded-full" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          {
            image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
            title: "Future of Robotics: Student Project",
            date: "May 20, 2024",
            desc: "Our Class XI students developed an AI-based waste segregation robot."
          },
          {
            image: "https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&q=80&w=800",
            title: "Annual Sports Carnival",
            date: "May 12, 2024",
            desc: "Celebrating 3 days of athleticism, team spirit, and incredible performances."
          },
          {
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
            title: "Library Expansion Phase 2",
            date: "April 28, 2024",
            desc: "Our digital library now hosts over 50,000+ e-resources for deep research."
          }
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="h-64 overflow-hidden relative">
              <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
              <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full text-[10px] font-black text-blue-900 uppercase tracking-widest">
                {item.date}
              </div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-900 transition-colors leading-snug">{item.title}</h3>
              <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-2">{item.desc}</p>
              <button className="text-blue-900 font-bold text-sm flex items-center gap-2 group/btn">
                Read Article <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

const AboutPage = () => (
  <div className="max-w-7xl mx-auto px-4 py-24 space-y-32">
    <section className="flex flex-col md:flex-row items-center gap-16">
      <div className="flex-1 space-y-8">
        <div className="inline-block bg-blue-50 text-blue-900 px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest">Since 1985</div>
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">Our Journey of <span className="text-blue-900 italic font-serif">Excellence</span></h1>
        <p className="text-xl text-slate-600 leading-relaxed font-light">
          Babu Ji Senior Secondary School was established with a singular vision: to create a nurturing ground for the next generation of leaders, thinkers, and innovators.
        </p>
      </div>
      <div className="flex-1 relative">
        <div className="absolute -inset-4 bg-yellow-400 rounded-[60px] -rotate-3 z-0" />
        <img 
          src="https://images.unsplash.com/photo-1523050853063-bd8012fbb72a?auto=format&fit=crop&q=80&w=1200" 
          alt="School Campus" 
          className="relative z-10 w-full h-[500px] object-cover rounded-[50px] shadow-2xl" 
        />
      </div>
    </section>

    <section className="grid md:grid-cols-2 gap-20 items-center">
      <div className="relative group">
        <div className="absolute inset-0 bg-blue-900 rounded-[40px] translate-x-4 translate-y-4 -z-10 group-hover:translate-x-6 group-hover:translate-y-6 transition-transform" />
        <img 
          src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1000" 
          alt="Principal Dr. Ananya Singh" 
          className="w-full h-[600px] object-cover rounded-[40px] shadow-2xl" 
        />
        <div className="absolute bottom-10 left-10 right-10 bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl">
          <h4 className="text-2xl font-bold text-slate-900">Dr. Ananya Singh</h4>
          <p className="text-blue-900 font-bold text-sm mb-4">Principal & Visionary Leader</p>
          <div className="w-12 h-1 bg-yellow-400" />
        </div>
      </div>
      <div className="space-y-8">
        <h2 className="text-4xl font-bold text-slate-900 italic font-serif leading-snug">"Education is the most powerful weapon which you can use to change the world."</h2>
        <p className="text-slate-600 leading-relaxed text-lg">
          At Babu Ji School, we don't just teach subjects; we inspire curiosity. Our pedagogical approach is rooted in the belief that every child has a unique spark that needs to be fanned into a flame of brilliance.
        </p>
      </div>
    </section>
  </div>
);

const GalleryPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Academic', 'Sports', 'Cultural', 'Campus'];
  
  const images = [
    { url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800', category: 'Academic', title: 'Graduation Day' },
    { url: 'https://images.unsplash.com/photo-1511629091441-ee46146481b6?auto=format&fit=crop&q=80&w=800', category: 'Academic', title: 'Science Lab' },
    { url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800', category: 'Academic', title: 'Digital Library' },
    { url: 'https://images.unsplash.com/photo-1526721940322-1f57039299ed?auto=format&fit=crop&q=80&w=800', category: 'Sports', title: 'Athletics Meet' },
    { url: 'https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&q=80&w=800', category: 'Cultural', title: 'Art Workshop' },
    { url: 'https://images.unsplash.com/photo-1540317580114-ed684c15ffcc?auto=format&fit=crop&q=80&w=800', category: 'Cultural', title: 'Festival Celebration' },
    { url: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&q=80&w=800', category: 'Sports', title: 'Football Match' },
    { url: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&q=80&w=800', category: 'Campus', title: 'Morning Assembly' },
  ];

  const filteredImages = activeCategory === 'All' 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-slate-900 mb-6">Campus Chronicles</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">Step into the vibrant life of Babu Ji School through these captured moments.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-8 py-3 rounded-2xl text-sm font-bold transition-all ${
              activeCategory === cat 
                ? 'bg-blue-900 text-white shadow-xl shadow-blue-900/30' 
                : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredImages.map((img, i) => (
          <div key={i} className="group relative h-96 overflow-hidden rounded-[40px] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-700">
            <img src={img.url} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" alt={img.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
              <span className="text-yellow-400 text-xs font-black uppercase tracking-[0.2em] mb-2">{img.category}</span>
              <h3 className="text-white text-2xl font-bold">{img.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AuthPage = ({ type, onNavigate }: { type: 'login' | 'signup', onNavigate: (p: Page) => void }) => (
  <div className="min-h-[90vh] flex items-center justify-center px-4 py-24 bg-slate-50 relative overflow-hidden">
    <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-100 rounded-full blur-3xl opacity-50" />
    
    <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-slate-100 relative z-10">
      <div className="bg-blue-900 p-12 text-center text-white relative">
        <div className="bg-yellow-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
          <School size={32} className="text-blue-900" />
        </div>
        <h2 className="text-3xl font-bold mb-2">{type === 'login' ? 'Welcome Back' : 'Apply for Admission'}</h2>
        <p className="text-blue-200 text-sm font-light">{type === 'login' ? 'Log in to your student portal' : 'Start your educational journey today'}</p>
      </div>
      <div className="p-10 space-y-6">
        {type === 'signup' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">First Name</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-900 outline-none transition-all" placeholder="E.g. Rohan" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Last Name</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-900 outline-none transition-all" placeholder="E.g. Sharma" />
            </div>
          </div>
        )}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email ID</label>
          <input type="email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-900 outline-none transition-all" placeholder="user@babuji.edu" />
        </div>
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Password</label>
          <input type="password" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-blue-900 outline-none transition-all" placeholder="••••••••" />
        </div>
        <button className="w-full bg-blue-900 hover:bg-blue-800 text-white font-black py-5 rounded-[20px] shadow-xl transition-all active:scale-95 text-sm uppercase tracking-widest">
          {type === 'login' ? 'Sign In' : 'Create Profile'}
        </button>
        <div className="text-center">
          <button 
            onClick={() => onNavigate(type === 'login' ? 'signup' : 'login')}
            className="text-slate-500 text-xs hover:text-blue-900 font-bold transition-colors"
          >
            {type === 'login' ? "Don't have an account? Sign Up" : "Already applied? Log In"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const AIAssistant = ({ onNavigate }: { onNavigate: (page: Page) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Namaste! I am the Babu Ji School Guide. How can I assist you with admissions, academics, or our history today? I can also navigate you to different pages like Gallery, About Us, or Login.' }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);
  const chatSessionRef = useRef<any>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping, isVoiceActive]);

  const cleanupVoice = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    for (const source of sourcesRef.current) {
      source.stop();
    }
    sourcesRef.current.clear();
    if (inputAudioContextRef.current) inputAudioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;
    setIsVoiceActive(false);
    setIsSpeaking(false);
  };

  const navigateToPageDeclaration: FunctionDeclaration = {
    name: 'navigateToPage',
    parameters: {
      type: Type.OBJECT,
      description: 'Navigate the user to a specific page on the school website.',
      properties: {
        page: {
          type: Type.STRING,
          description: 'The target page name.',
          enum: ['home', 'about', 'gallery', 'login', 'signup']
        }
      },
      required: ['page']
    }
  };

  const startVoiceSession = async () => {
    try {
      setIsVoiceActive(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const outputNode = outputCtx.createGain();
      outputNode.connect(outputCtx.destination);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.toolCall) {
              for (const fc of message.toolCall.functionCalls) {
                if (fc.name === 'navigateToPage') {
                  const target = (fc.args as any).page as Page;
                  onNavigate(target);
                  const result = `Navigated to ${target} successfully.`;
                  sessionPromise.then(s => s.sendToolResponse({
                    functionResponses: { id: fc.id, name: fc.name, response: { result } }
                  }));
                }
              }
            }

            if (message.serverContent?.outputTranscription) {
              const text = message.serverContent.outputTranscription.text;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return [...prev.slice(0, -1), { ...last, content: last.content + text }];
                }
                return [...prev, { role: 'assistant', content: text }];
              });
            } else if (message.serverContent?.inputTranscription) {
              const text = message.serverContent.inputTranscription.text;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'user') {
                  return [...prev.slice(0, -1), { ...last, content: last.content + text }];
                }
                return [...prev, { role: 'user', content: text }];
              });
            }

            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setIsSpeaking(true);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              for (const source of sourcesRef.current) source.stop();
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onclose: () => cleanupVoice(),
          onerror: (e) => cleanupVoice()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } }
          },
          tools: [{ functionDeclarations: [navigateToPageDeclaration] }],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: 'You are "Babu Ji Guide". You help navigate the Babu Ji School website. Pages: home, about, gallery, login, signup. If someone asks to go somewhere, use the navigateToPage tool.'
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      cleanupVoice();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      if (!chatSessionRef.current) {
        chatSessionRef.current = ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            tools: [{ functionDeclarations: [navigateToPageDeclaration] }],
            systemInstruction: `You are the Babu Ji School Assistant. You can navigate the user to different pages (home, about, gallery, login, signup). Use function calling to navigate.`
          }
        });
      }
      const response = await chatSessionRef.current.sendMessage({ message: userMsg });
      
      if (response.functionCalls) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'navigateToPage') {
            const target = (fc.args as any).page as Page;
            onNavigate(target);
            setMessages(prev => [...prev, { role: 'assistant', content: `Certainly! Navigating you to the ${target} page now.` }]);
          }
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: response.text || "Namaste! I'm here to help." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Namaste! I seem to be having a momentary connection issue." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleAssistant = () => {
    if (isOpen) {
      cleanupVoice();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[60]">
      {isOpen ? (
        <div className="bg-white w-[380px] md:w-[420px] h-[600px] rounded-[40px] chat-shadow flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 origin-bottom-right border border-slate-100 ring-1 ring-slate-200">
          {/* Chat Header */}
          <div className="bg-blue-900 p-6 text-white flex justify-between items-center relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                <School size={24} className="text-yellow-400" />
              </div>
              <div>
                <h4 className="font-bold text-base leading-tight">Babu Ji Guide</h4>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400" />
                  <span className="text-[10px] text-blue-200 uppercase font-black tracking-widest">
                    {isVoiceActive ? 'Voice Assistant' : 'Smart Guide'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <button 
                onClick={toggleAssistant}
                className="hover:bg-white/10 p-2.5 rounded-full transition-colors flex items-center gap-1 group"
                title="Close Assistant"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Close</span>
                <X size={24} />
              </button>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-50/50 relative">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[85%] px-5 py-4 rounded-[24px] text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-900 text-white rounded-br-none' 
                    : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 px-5 py-4 rounded-[24px] rounded-bl-none shadow-sm flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-blue-900/40 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-1.5 h-1.5 bg-blue-900/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1.5 h-1.5 bg-blue-900/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}

            {isVoiceActive && (
              <div className="absolute inset-0 bg-blue-900/95 backdrop-blur-xl z-20 flex flex-col items-center justify-center text-white p-10 text-center space-y-10 animate-in fade-in duration-500">
                <div className="relative">
                  <div className={`absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-20 ${isSpeaking ? 'scale-[2]' : 'scale-125'}`} />
                  <div className={`absolute inset-0 bg-white/10 rounded-full animate-pulse opacity-40 ${isSpeaking ? 'scale-[1.8]' : 'scale-110'}`} />
                  <div className={`relative w-28 h-28 bg-white text-blue-900 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isSpeaking ? 'scale-110 shadow-yellow-400/20' : 'scale-100'}`}>
                    {isSpeaking ? <Volume2 size={48} className="animate-pulse" /> : <Mic size={48} className="animate-bounce" />}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold tracking-tight">{isSpeaking ? 'Assistant is Speaking' : 'Listening...'}</h3>
                  <p className="text-blue-100/70 text-sm leading-relaxed font-light">I can take you to the Gallery, About Us, or handle your Login.</p>
                </div>
                <button 
                  onClick={cleanupVoice}
                  className="bg-white/10 hover:bg-red-500/20 border border-white/20 px-8 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-3 group active:scale-95"
                >
                  <MicOff size={18} className="group-hover:rotate-12 transition-transform" /> Stop Session
                </button>
              </div>
            )}
          </div>
          
          {/* Chat Input */}
          {!isVoiceActive && (
            <div className="p-6 bg-white border-t border-slate-50 flex gap-3 items-center shrink-0">
              <button 
                onClick={startVoiceSession}
                className="bg-slate-100 text-slate-500 p-3.5 rounded-2xl hover:bg-yellow-400 hover:text-blue-900 transition-all group active:scale-90 shadow-sm"
                title="Voice Chat"
              >
                <Mic size={22} className="group-hover:scale-110 transition-transform" />
              </button>
              <div className="flex-1 relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask for navigation..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-900/10 transition-all placeholder:text-slate-400"
                />
              </div>
              <button 
                onClick={handleSend}
                className="bg-blue-900 text-white p-3.5 rounded-2xl hover:bg-blue-800 disabled:opacity-50 transition-all shadow-lg shadow-blue-900/20 active:scale-90"
                disabled={isTyping || !input.trim()}
              >
                <Send size={22} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-900 text-white p-5 rounded-[24px] shadow-2xl hover:scale-110 transition-all active:scale-95 group relative ring-4 ring-blue-900/10"
        >
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full border-4 border-slate-50 animate-bounce" />
          <MessageSquare size={32} />
        </button>
      )}
    </div>
  );
};

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderContent = () => {
    switch (currentPage) {
      case 'home': return <HomePage onNavigate={setCurrentPage} />;
      case 'about': return <AboutPage />;
      case 'gallery': return <GalleryPage />;
      case 'login': return <AuthPage type="login" onNavigate={setCurrentPage} />;
      case 'signup': return <AuthPage type="signup" onNavigate={setCurrentPage} />;
      default: return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-yellow-200 selection:text-blue-900">
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="flex-grow">
        <div className="animate-in fade-in duration-700 slide-in-from-bottom-4">
          {renderContent()}
        </div>
      </main>
      <Footer />
      <AIAssistant onNavigate={setCurrentPage} />
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
