// Кастомные SVG-иконки в TMNT-неон стиле
// Заменяют все эмодзи на стилизованные векторные иконки

interface IconProps {
    size?: number
    color?: string
    glow?: string
    style?: React.CSSProperties
}

// 🔥 Логотип FIRE — стилизованное пламя
export function FireLogo({ size = 40, color = '#a3f75c', glow = 'rgba(163,247,92,0.4)' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 8px ${glow})` }}>
            <path d="M32 4C32 4 18 20 18 36C18 44 24 52 32 56C40 52 46 44 46 36C46 20 32 4 32 4Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M32 16C32 16 24 26 24 36C24 42 28 48 32 50C36 48 40 42 40 36C40 26 32 16 32 16Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M32 28C32 28 28 33 28 38C28 41 30 44 32 45C34 44 36 41 36 38C36 33 32 28 32 28Z" fill={color} fillOpacity="0.6" />
            <circle cx="32" cy="38" r="3" fill={color} />
        </svg>
    )
}

// 🐢 Голова черепашки (универсальная, цвет бандана через color)
export function TurtleHead({ size = 48, color = '#a3f75c', glow = 'rgba(163,247,92,0.3)', style }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 6px ${glow})`, ...style }}>
            <ellipse cx="32" cy="34" rx="22" ry="20" fill="#1a4a1a" stroke="#2a6a2a" strokeWidth="1.5" />
            {/* Бандана */}
            <path d="M10 30C10 30 16 24 32 24C48 24 54 30 54 30L54 36C54 36 48 30 32 30C16 30 10 36 10 36Z" fill={color} fillOpacity="0.9" stroke={color} strokeWidth="1" />
            {/* Хвосты бандан */}
            <path d="M54 30L62 26L58 34" fill={color} fillOpacity="0.7" />
            <path d="M54 33L60 32L56 38" fill={color} fillOpacity="0.5" />
            {/* Глаза */}
            <ellipse cx="24" cy="32" rx="5" ry="4" fill="white" />
            <ellipse cx="40" cy="32" rx="5" ry="4" fill="white" />
            <circle cx="25" cy="32" r="2.5" fill="#111" />
            <circle cx="41" cy="32" r="2.5" fill="#111" />
            <circle cx="26" cy="31" r="1" fill="white" />
            <circle cx="42" cy="31" r="1" fill="white" />
            {/* Рот */}
            <path d="M26 42C26 42 32 46 38 42" stroke="#2a6a2a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
    )
}

// ⚔️ Dashboard / мечи-катаны (Лео)
export function SwordsIcon({ size = 24, color = '#1e90ff', glow = 'rgba(30,144,255,0.3)' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
            <line x1="6" y1="26" x2="26" y2="6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="26" y1="26" x2="6" y2="6" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <rect x="3" y="23" width="6" height="3" rx="1" fill={color} transform="rotate(-45 6 26)" fillOpacity="0.6" />
            <rect x="23" y="23" width="6" height="3" rx="1" fill={color} transform="rotate(45 26 26)" fillOpacity="0.6" />
            <circle cx="16" cy="16" r="3" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1" />
        </svg>
    )
}

// 🎫 Тикеты / обращения
export function TicketIcon({ size = 24, color = '#ff2d2d', glow = 'rgba(255,45,45,0.3)' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
            <rect x="4" y="8" width="24" height="16" rx="3" fill={color} fillOpacity="0.12" stroke={color} strokeWidth="1.5" />
            <circle cx="4" cy="16" r="3" fill="var(--bg-surface)" stroke={color} strokeWidth="1" />
            <circle cx="28" cy="16" r="3" fill="var(--bg-surface)" stroke={color} strokeWidth="1" />
            <line x1="10" y1="13" x2="22" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.6" />
            <line x1="10" y1="17" x2="18" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.4" />
            <line x1="10" y1="21" x2="15" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
        </svg>
    )
}

// 🥷 Менеджеры / ниндзя
export function NinjaIcon({ size = 24, color = '#b44dff', glow = 'rgba(180,77,255,0.3)' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
            <circle cx="16" cy="14" r="10" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.5" />
            <path d="M6 13C6 13 10 10 16 10C22 10 26 13 26 13V17C26 17 22 14 16 14C10 14 6 17 6 17Z" fill={color} fillOpacity="0.8" />
            <ellipse cx="12" cy="14" rx="2" ry="1.5" fill="white" />
            <ellipse cx="20" cy="14" rx="2" ry="1.5" fill="white" />
            <circle cx="12.5" cy="14" r="1" fill="#111" />
            <circle cx="20.5" cy="14" r="1" fill="#111" />
            <path d="M26 13L30 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M26 15L29 14" stroke={color} strokeWidth="1" strokeLinecap="round" />
            <path d="M10 26L16 22L22 26" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1" />
        </svg>
    )
}

// 🏢 Офисы
export function OfficeIcon({ size = 24, color = '#ff6a00', glow = 'rgba(255,106,0,0.3)' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
            <rect x="8" y="6" width="16" height="22" rx="2" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.5" />
            <rect x="11" y="10" width="4" height="3" rx="0.5" fill={color} fillOpacity="0.5" />
            <rect x="17" y="10" width="4" height="3" rx="0.5" fill={color} fillOpacity="0.5" />
            <rect x="11" y="16" width="4" height="3" rx="0.5" fill={color} fillOpacity="0.5" />
            <rect x="17" y="16" width="4" height="3" rx="0.5" fill={color} fillOpacity="0.5" />
            <rect x="14" y="22" width="4" height="6" rx="0.5" fill={color} fillOpacity="0.7" />
            <line x1="8" y1="28" x2="24" y2="28" stroke={color} strokeWidth="1.5" />
        </svg>
    )
}

// 🧠 AI / мозг
export function BrainIcon({ size = 24, color = '#b44dff', glow = 'rgba(180,77,255,0.3)' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
            <path d="M16 4C10 4 6 8 6 14C6 18 8 21 10 23V28H22V23C24 21 26 18 26 14C26 8 22 4 16 4Z" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.5" />
            <path d="M12 12C12 12 14 14 16 12C18 10 20 12 20 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M12 17C12 17 14 19 16 17C18 15 20 17 20 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <line x1="12" y1="28" x2="20" y2="28" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="13" y1="26" x2="19" y2="26" stroke={color} strokeWidth="1" strokeLinecap="round" strokeOpacity="0.5" />
            <circle cx="16" cy="8" r="1.5" fill={color} fillOpacity="0.5" />
        </svg>
    )
}

// 🍕 Пицца
export function PizzaIcon({ size = 32, color = '#ffd700', glow = 'rgba(255,215,0,0.3)' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
            <path d="M16 4L4 28H28L16 4Z" fill="#c89030" fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M16 8L7 26H25L16 8Z" fill={color} fillOpacity="0.2" />
            <circle cx="14" cy="18" r="2.5" fill="#ff2d2d" fillOpacity="0.7" stroke="#ff2d2d" strokeWidth="0.5" />
            <circle cx="19" cy="22" r="2" fill="#ff2d2d" fillOpacity="0.7" stroke="#ff2d2d" strokeWidth="0.5" />
            <circle cx="16" cy="14" r="1.5" fill="#ff2d2d" fillOpacity="0.7" stroke="#ff2d2d" strokeWidth="0.5" />
            <circle cx="12" cy="23" r="1" fill="#2a8a2a" fillOpacity="0.6" />
            <circle cx="21" cy="18" r="1" fill="#2a8a2a" fillOpacity="0.6" />
        </svg>
    )
}

// 📊 Dashboard / Графики
export function ChartIcon({ size = 24, color = '#a3f75c', glow = 'rgba(163,247,92,0.3)' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
            <rect x="5" y="18" width="5" height="10" rx="1" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="1" />
            <rect x="13" y="10" width="5" height="18" rx="1" fill={color} fillOpacity="0.6" stroke={color} strokeWidth="1" />
            <rect x="21" y="4" width="5" height="24" rx="1" fill={color} fillOpacity="0.8" stroke={color} strokeWidth="1" />
            <line x1="3" y1="28" x2="29" y2="28" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
        </svg>
    )
}

// 🔴 Критическое / тревога
export function AlertIcon({ size = 24, color = '#ff2d2d', glow = 'rgba(255,45,45,0.4)' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
            <path d="M16 4L2 28H30L16 4Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="16" y1="12" x2="16" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="16" cy="24" r="1.5" fill={color} />
        </svg>
    )
}

// 🧬 DNA / AI обработка
export function DnaIcon({ size = 24, color = '#b44dff', glow = 'rgba(180,77,255,0.3)' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
            <path d="M10 4C10 4 10 10 16 16C22 22 22 28 22 28" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M22 4C22 4 22 10 16 16C10 22 10 28 10 28" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
            <line x1="10" y1="8" x2="22" y2="8" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
            <line x1="12" y1="12" x2="20" y2="12" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
            <line x1="12" y1="20" x2="20" y2="20" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
            <line x1="10" y1="24" x2="22" y2="24" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="16" cy="16" r="2" fill={color} fillOpacity="0.5" />
        </svg>
    )
}

// ⏳ Ожидание / песочные часы
export function HourglassIcon({ size = 24, color = '#ff6a00', glow = 'rgba(255,106,0,0.3)' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
            <path d="M10 4H22V10L16 16L10 10V4Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
            <path d="M10 28H22V22L16 16L10 22V28Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
            <line x1="8" y1="4" x2="24" y2="4" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="28" x2="24" y2="28" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="22" r="1.5" fill={color} fillOpacity="0.6" />
            <line x1="16" y1="16" x2="16" y2="20" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
        </svg>
    )
}

// 🏔️ Горы (Астана)
export function MountainIcon({ size = 32, color = '#1e90ff', glow = 'rgba(30,144,255,0.3)' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
            <path d="M4 28L14 8L20 18L24 12L28 28H4Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M12 14L14 8L16 12" fill="white" fillOpacity="0.3" />
            <path d="M22 16L24 12L26 16" fill="white" fillOpacity="0.2" />
        </svg>
    )
}

// 🏙️ Город (Алматы)
export function CityIcon({ size = 32, color = '#ff6a00', glow = 'rgba(255,106,0,0.3)' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
            <rect x="4" y="12" width="6" height="16" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" />
            <rect x="12" y="6" width="8" height="22" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1" />
            <rect x="22" y="10" width="6" height="18" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1" />
            <rect x="5" y="15" width="2" height="2" fill={color} fillOpacity="0.5" />
            <rect x="5" y="20" width="2" height="2" fill={color} fillOpacity="0.5" />
            <rect x="14" y="9" width="2" height="2" fill={color} fillOpacity="0.5" />
            <rect x="18" y="9" width="2" height="2" fill={color} fillOpacity="0.5" />
            <rect x="14" y="14" width="2" height="2" fill={color} fillOpacity="0.5" />
            <rect x="18" y="14" width="2" height="2" fill={color} fillOpacity="0.5" />
            <rect x="24" y="14" width="2" height="2" fill={color} fillOpacity="0.5" />
            <rect x="24" y="20" width="2" height="2" fill={color} fillOpacity="0.5" />
            <line x1="2" y1="28" x2="30" y2="28" stroke={color} strokeWidth="1.5" />
        </svg>
    )
}

// 👥 Люди / группа
export function PeopleIcon({ size = 24, color = '#a3f75c', glow = 'rgba(163,247,92,0.3)' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
            <circle cx="12" cy="10" r="4" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
            <circle cx="22" cy="10" r="4" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
            <path d="M4 26C4 20 8 18 12 18C16 18 20 20 20 26" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.5" />
            <path d="M16 26C16 21 18 18 22 18C26 18 28 20 28 26" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.5" />
        </svg>
    )
}

// 📈 Тренд вверх
export function TrendUpIcon({ size = 24, color = '#a3f75c', glow = 'rgba(163,247,92,0.3)' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
            <polyline points="4,24 12,16 18,20 28,8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <polyline points="20,8 28,8 28,16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
    )
}

// Звезда (Star Task)
export function StarIcon({ size = 24, color = '#ffd700', glow = 'rgba(255,215,0,0.4)' }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: `drop-shadow(0 0 4px ${glow})` }}>
            <path d="M16 2L20 12L30 13L22 20L24 30L16 25L8 30L10 20L2 13L12 12Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    )
}
