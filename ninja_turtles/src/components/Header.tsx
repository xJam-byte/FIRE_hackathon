import { useLocation } from 'react-router-dom'
import { SwordsIcon, TicketIcon, NinjaIcon, OfficeIcon, BrainIcon } from './Icons'

interface HeaderProps {
    onMenuClick: () => void
}

const pageConfig: Record<string, { title: string; subtitle: string; Icon: typeof SwordsIcon; color: string; glow: string }> = {
    '/': { title: 'Dashboard', subtitle: 'Командный центр', Icon: SwordsIcon, color: '#60a5fa', glow: 'rgba(96,165,250,0.3)' },
    '/tickets': { title: 'Обращения', subtitle: 'Входящие запросы', Icon: TicketIcon, color: '#f87171', glow: 'rgba(248,113,113,0.3)' },
    '/managers': { title: 'Менеджеры', subtitle: 'Команда ниндзя', Icon: NinjaIcon, color: '#a78bfa', glow: 'rgba(167,139,250,0.3)' },
    '/offices': { title: 'Офисы', subtitle: 'Точки присутствия', Icon: OfficeIcon, color: '#fb923c', glow: 'rgba(251,146,60,0.3)' },
    '/assistant': { title: 'AI Ассистент', subtitle: 'Star Task', Icon: BrainIcon, color: '#38f8d2', glow: 'rgba(56,248,210,0.3)' },
}

export default function Header({ onMenuClick }: HeaderProps) {
    const location = useLocation()
    const config = pageConfig[location.pathname] || pageConfig['/']

    return (
        <header className="app-header glass" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            height: 'var(--header-height)',
            borderBottom: '1px solid var(--border-subtle)',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {/* Бургер для мобильных */}
                <button
                    className="mobile-menu-btn"
                    onClick={onMenuClick}
                    style={{
                        display: 'none',
                        background: 'none',
                        border: '1px solid var(--border-default)',
                        color: 'var(--lime)',
                        padding: '8px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: '18px',
                        lineHeight: 1,
                    }}
                >
                    ☰
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <config.Icon size={28} color={config.color} glow={config.glow} />
                    <div>
                        <h2 style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                        }}>
                            {config.title}
                        </h2>
                        <span style={{
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            letterSpacing: '0.5px',
                        }}>
                            {config.subtitle}
                        </span>
                    </div>
                </div>
            </div>

            {/* Статус AI */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--lime-subtle)',
                border: '1px solid var(--border-subtle)',
            }}>
                <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--lime)',
                    boxShadow: '0 0 8px var(--lime-glow)',
                    animation: 'neonPulse 2s ease-in-out infinite',
                }} />
                <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--lime)',
                }}>
                    AI ONLINE
                </span>
            </div>
        </header>
    )
}
