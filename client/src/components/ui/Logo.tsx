interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

export default function Logo({
  size = 'md',
  className = '',
  showText = false,
}: LogoProps) {
  const containerSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div
        className={`${containerSizes[size]} shrink-0 transition-transform duration-300 hover:scale-105 flex items-center justify-center`}
      >
        <img
          src="/logo.png"
          alt="Personal Command Center Logo"
          className="w-full h-full object-contain filter drop-shadow-md"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold text-surface-400 tracking-[0.25em] uppercase">
            PERSONAL
          </span>
          <h1 className="text-lg font-extrabold tracking-tight text-surface-900 dark:text-white flex items-center gap-1">
            <span>Command</span>
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Center
            </span>
          </h1>
          <span className="text-[9px] font-medium text-surface-400 tracking-wider uppercase mt-0.5">
            Focus today. A brighter tomorrow.
          </span>
        </div>
      )}
    </div>
  );
}
