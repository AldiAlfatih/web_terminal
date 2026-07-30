export default function AppLogo() {
    return (
        <>
            {/* DAMRI Yellow square badge icon */}
            <div
                className="flex aspect-square size-8 items-center justify-center rounded-md"
                style={{ backgroundColor: '#FFC627' }}
            >
                {/* Bus icon SVG */}
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M3 7C3 5.34315 4.34315 4 6 4H18C19.6569 4 21 5.34315 21 7V15C21 16.3062 20.1652 17.4175 19 17.8293V19C19 19.5523 18.5523 20 18 20H17C16.4477 20 16 19.5523 16 19V18H8V19C8 19.5523 7.55228 20 7 20H6C5.44772 20 5 19.5523 5 19V17.8293C3.83481 17.4175 3 16.3062 3 15V7Z"
                        fill="#003B70"
                    />
                    <rect x="5" y="6" width="14" height="6" rx="1" fill="#f9f7f3" />
                    <circle cx="7.5" cy="15.5" r="1.5" fill="#FFC627" />
                    <circle cx="16.5" cy="15.5" r="1.5" fill="#FFC627" />
                </svg>
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span
                    className="truncate text-xs font-bold leading-none tracking-tight"
                    style={{ color: '#ffffff', fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                    Terminal Parepare
                </span>
                <span
                    className="truncate text-[10px] leading-none"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                    Admin Panel
                </span>
            </div>
        </>
    );
}
