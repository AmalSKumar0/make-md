import { ArrowRight, Sun, Moon } from 'lucide-react';

interface LandingProps {
  onStart: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function Landing({ onStart, isDarkMode, onToggleTheme }: LandingProps) {
  return (
    <div className="min-h-screen bg-[#fcfaf5] dark:bg-[#0d1117] flex flex-col font-sans transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-soft dark:opacity-10 pointer-events-none mt-[40vh]" style={{ maskImage: 'linear-gradient(to bottom, transparent, black)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)' }}></div>

      {/* Floating illustrations in the background */}
      {/* Star SVG on left */}
      <svg className="hidden md:block absolute left-8 lg:left-16 top-24 w-12 h-12 text-yellow-500/20 dark:text-yellow-400/10 animate-float-svg pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.8-6.3 4.8 2.3-7.4-6-4.6h7.6z"/>
      </svg>

      {/* Document SVG on right top */}
      <svg className="hidden md:block absolute right-10 lg:right-24 top-28 w-14 h-14 text-indigo-500/20 dark:text-indigo-400/10 animate-float-reverse-svg animation-delay-200 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>

      {/* Paper Airplane SVG on left mid-lower */}
      <svg className="hidden md:block absolute left-12 lg:left-24 bottom-[38%] w-14 h-14 text-pink-500/20 dark:text-pink-400/10 animate-float-svg animation-delay-400 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>

      {/* Rainbow SVG on right mid-lower */}
      <svg className="hidden md:block absolute right-12 lg:right-28 bottom-[28%] w-24 h-24 text-teal-500/20 dark:text-teal-400/10 animate-float-reverse-svg animation-delay-300 pointer-events-none" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
        <path d="M 10 90 A 40 40 0 0 1 90 90" />
        <path d="M 26 90 A 24 24 0 0 1 74 90" />
        <path d="M 42 90 A 8 8 0 0 1 58 90" />
      </svg>

      {/* Sparkle/Magic Star SVG on left center */}
      <svg className="hidden md:block absolute left-[18%] top-[48%] w-8 h-8 text-yellow-500/30 dark:text-yellow-400/15 animate-pulse pointer-events-none" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.813 15.904L9 21L8.188 15.904L3 15L8.188 14.096L9 9L9.813 14.096L15 15L9.813 15.904Z" />
      </svg>

      <header className="px-4 py-8 flex justify-center w-full max-w-7xl mx-auto relative z-10 animate-fade-in-up">
        <nav className="flex items-center gap-1 sm:gap-6 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-full p-2 sm:pl-6 soft-shadow-sm">
          <div className="hidden sm:flex gap-6 font-medium text-sm text-gray-700 dark:text-gray-300 pr-2">
            <a href="#" className="hover:text-black dark:hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">Home</a>
            <a href="https://www.amalskumar.dev/" className="hover:text-black dark:hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">About</a>
            <a href="https://www.amalskumar.dev/" className="hover:text-black dark:hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">Blog</a>
            <a href="https://www.amalskumar.dev/contact" className="hover:text-black dark:hover:text-white transition-all duration-300 hover:scale-105 active:scale-95">Contact</a>
          </div>
          <button
            onClick={onToggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-full transition-all duration-300 hover:scale-110 active:scale-90 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button 
            onClick={onStart}
            className="bg-[#111] dark:bg-white text-white dark:text-[#111] px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:bg-black dark:hover:bg-gray-100 hover:scale-105 active:scale-95 hover:shadow-md hover:-translate-y-0.5"
          >
            Try Now
          </button>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center pt-8 sm:pt-16 pb-12 px-6 relative z-10 w-full max-w-5xl mx-auto text-center">
        
        {/* Social Proof */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8 animate-fade-in-up">
          <div className="flex -space-x-3">
            <img className="w-9 h-9 rounded-full border-2 border-[#fcfaf5] dark:border-[#0d1117] object-cover relative z-30 transition-transform duration-300 hover:scale-110" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="User 1" />
            <img className="w-9 h-9 rounded-full border-2 border-[#fcfaf5] dark:border-[#0d1117] object-cover relative z-20 transition-transform duration-300 hover:scale-110" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="User 2" />
            <img className="w-9 h-9 rounded-full border-2 border-[#fcfaf5] dark:border-[#0d1117] object-cover relative z-10 transition-transform duration-300 hover:scale-110" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64" alt="User 3" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 tracking-wide">Many creators chose Make.md</span>
        </div>

        {/* Hero Text */}
        <div className="relative w-full max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] text-[#111] dark:text-white mb-6 tracking-tight animate-fade-in-up animation-delay-100">
            Impress the crowd with elegant markdown
          </h1>
        </div>

        <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-lg md:text-xl leading-relaxed mb-10 animate-fade-in-up animation-delay-200">
          Enjoy a premium markdown experience that can help elevate your writing and give it a magic touch
        </p>

        <button 
          onClick={onStart}
          className="bg-[#111] dark:bg-white text-white dark:text-[#111] px-8 py-3.5 rounded-full text-lg font-medium transition-all duration-300 hover:-translate-y-1.5 hover:scale-105 active:scale-95 hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_12px_24px_rgba(255,255,255,0.08)] hover:bg-black dark:hover:bg-gray-100 animate-fade-in-up animation-delay-300"
        >
          Get started
        </button>

        {/* 3 Images / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl mx-auto">
           {/* Card 1 */}
           <div className="rounded-[32px] overflow-hidden soft-shadow-lg aspect-[4/5] bg-[#fbcfe8] animate-scale-in animation-delay-300 transition-all duration-500 ease-out hover:-translate-y-4 hover:scale-[1.03] hover:rotate-[-2deg] hover:shadow-2xl">
              <img src="/image/Screenshot 2026-04-09 at 12-30-56 Pin on drawings and paintings.png" alt="Drawings and paintings" className="w-full h-full object-cover" />
           </div>
           
           {/* Card 2 */}
           <div className="rounded-[32px] overflow-hidden soft-shadow-lg aspect-[4/5] bg-[#a7f3d0] animate-scale-in animation-delay-400 md:-translate-y-8 transition-all duration-500 ease-out hover:scale-[1.03] hover:rotate-[1deg] hover:shadow-2xl hover:md:-translate-y-12">
              <img src="/image/Aesthetic Frog Wallpaper.jpg" alt="Aesthetic Frog" className="w-full h-full object-cover" />
           </div>

           {/* Card 3 */}
           <div className="rounded-[32px] overflow-hidden soft-shadow-lg aspect-[4/5] bg-[#fef08a] animate-scale-in animation-delay-500 transition-all duration-500 ease-out hover:-translate-y-4 hover:scale-[1.03] hover:rotate-[2deg] hover:shadow-2xl">
              <img src="/image/‘see the wild’ for @ourplanetweek __We look up to find wonder, but the wild has always been watching us_ Its roots run deeper than memory, its branches stretch through time. To truly see the wild is to recognize tha.jpg" alt="See the Wild" className="w-full h-full object-cover" />
           </div>
        </div>

      </main>

      <footer className="w-full max-w-5xl mx-auto px-6 py-8 mt-8 border-t border-gray-200 dark:border-[#30363d] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400 dark:text-gray-500 relative z-10 animate-fade-in-up animation-delay-500">
        <div>
          &copy; {new Date().getFullYear()} Make.md. All rights reserved.
        </div>
        <div>
          Designed and developed by{' '}
          <a 
            href="https://amalskumar.dev" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 inline-block underline decoration-dotted underline-offset-4"
          >
            Amal S Kumar
          </a>
        </div>
      </footer>
    </div>
  );
}
