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

      <header className="px-4 py-8 flex justify-center w-full max-w-7xl mx-auto relative z-10">
        <nav className="flex items-center gap-1 sm:gap-6 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-[#30363d] rounded-full p-2 sm:pl-6 soft-shadow-sm">
          <div className="hidden sm:flex gap-6 font-medium text-sm text-gray-700 dark:text-gray-300 pr-2">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Home</a>
            <a href="https://www.amalskumar.dev/" className="hover:text-black dark:hover:text-white transition-colors">About</a>
            <a href="https://www.amalskumar.dev/" className="hover:text-black dark:hover:text-white transition-colors">Blog</a>
            <a href="https://www.amalskumar.dev/contact" className="hover:text-black dark:hover:text-white transition-colors">Contact</a>
          </div>
          <button
            onClick={onToggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white rounded-full transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button 
            onClick={onStart}
            className="bg-[#111] dark:bg-white text-white dark:text-[#111] px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-sm font-medium transition-all hover:bg-black dark:hover:bg-gray-100"
          >
            Try Now
          </button>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center pt-8 sm:pt-16 pb-12 px-6 relative z-10 w-full max-w-5xl mx-auto text-center">
        
        {/* Social Proof */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-8">
          <div className="flex -space-x-3">
            <img className="w-9 h-9 rounded-full border-2 border-[#fcfaf5] dark:border-[#0d1117] object-cover relative z-30" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=64&h=64" alt="User 1" />
            <img className="w-9 h-9 rounded-full border-2 border-[#fcfaf5] dark:border-[#0d1117] object-cover relative z-20" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=64&h=64" alt="User 2" />
            <img className="w-9 h-9 rounded-full border-2 border-[#fcfaf5] dark:border-[#0d1117] object-cover relative z-10" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=64&h=64" alt="User 3" />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 tracking-wide">Many creators chose Make.md</span>
        </div>

        {/* Hero Text */}
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Star SVG on left */}
          <svg className="hidden md:block absolute -left-12 top-20 w-12 h-12 text-[#111] dark:text-white transform -rotate-12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7.4-6.3-4.8-6.3 4.8 2.3-7.4-6-4.6h7.6z"/>
          </svg>

          {/* Rainbow SVG on right */}
          <svg className="hidden md:block absolute -right-16 bottom-0 w-24 h-24 text-[#111] dark:text-white transform rotate-[15deg]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round">
            <path d="M 10 90 A 40 40 0 0 1 90 90" />
            <path d="M 26 90 A 24 24 0 0 1 74 90" />
            <path d="M 42 90 A 8 8 0 0 1 58 90" />
          </svg>

          <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.05] text-[#111] dark:text-white mb-6 tracking-tight">
            Impress the crowd with elegant markdown
          </h1>
        </div>

        <p className="text-gray-500 dark:text-gray-400 max-w-2xl text-lg md:text-xl leading-relaxed mb-10">
          Enjoy a premium markdown experience that can help elevate your writing and give it a magic touch
        </p>

        <button 
          onClick={onStart}
          className="bg-[#111] dark:bg-white text-white dark:text-[#111] px-8 py-3.5 rounded-full text-lg font-medium transition-all hover:-translate-y-1 hover:shadow-xl hover:bg-black"
        >
          Get started
        </button>

        {/* 3 Images / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl mx-auto">
           {/* Card 1 */}
           <div className="rounded-[32px] overflow-hidden soft-shadow-lg transform transition-transform hover:-translate-y-2 aspect-[4/5] bg-[#fbcfe8]">
              <img src="/image/Screenshot 2026-04-09 at 12-30-56 Pin on drawings and paintings.png" alt="Drawings and paintings" className="w-full h-full object-cover" />
           </div>
           
           {/* Card 2 */}
           <div className="rounded-[32px] overflow-hidden soft-shadow-lg transform transition-transform hover:-translate-y-2 md:-translate-y-8 aspect-[4/5] bg-[#a7f3d0]">
              <img src="/image/Aesthetic Frog Wallpaper.jpg" alt="Aesthetic Frog" className="w-full h-full object-cover" />
           </div>

           {/* Card 3 */}
           <div className="rounded-[32px] overflow-hidden soft-shadow-lg transform transition-transform hover:-translate-y-2 aspect-[4/5] bg-[#fef08a]">
              <img src="/image/‘see the wild’ for @ourplanetweek __We look up to find wonder, but the wild has always been watching us_ Its roots run deeper than memory, its branches stretch through time. To truly see the wild is to recognize tha.jpg" alt="See the Wild" className="w-full h-full object-cover" />
           </div>
        </div>

      </main>
    </div>
  );
}
