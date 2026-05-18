export default function Header() {
  return (
    <header className="flex justify-between items-center w-full glass-panel rounded-xl p-4 shadow-sm border-b border-white/10 z-40">
      <div className="flex items-center gap-3">
        <button className="md:hidden text-primary-fixed p-2">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary-container text-glow">filter_drama</span>
          <h1 className="font-headline-md text-headline-md font-bold text-primary-container drop-shadow-[0_0_10px_#00F2FF] hidden sm:block">
            Laboratorium Atmosfer
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <input 
            className="bg-surface/30 border border-white/15 rounded-full py-2 px-4 pl-10 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all w-64 placeholder:text-on-surface-variant" 
            placeholder="Cari materi..." 
            type="text" 
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-sm">search</span>
        </div>
        <button className="text-on-surface-variant hover:text-primary-fixed-dim transition-colors relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary-container rounded-full doodle-glow"></span>
        </button>
      </div>
    </header>
  );
}
