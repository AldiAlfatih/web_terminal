export default function AppLogo() {
    return (
        <>
            {/* Kemenhub Logo Badge */}
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/10 p-0.5 shadow-sm border border-white/20">
                <img
                    src="/images/logo.png"
                    alt="Logo Kemenhub"
                    className="h-full w-full object-contain"
                />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span
                    className="truncate text-xs font-bold leading-none tracking-tight"
                    style={{ color: '#ffffff', fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                    Terminal Parepare
                </span>
                <span
                    className="truncate text-[10px] leading-none mt-0.5"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                    Admin Panel
                </span>
            </div>
        </>
    );
}
