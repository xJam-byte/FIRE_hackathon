import { NavLink, useLocation } from "react-router-dom";
import {
  FireLogo,
  SwordsIcon,
  TicketIcon,
  NinjaIcon,
  OfficeIcon,
  BrainIcon,
  PizzaIcon,
  ChartIcon,
} from "./Icons";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    path: "/",
    label: "Dashboard",
    Icon: SwordsIcon,
    iconColor: "#60a5fa",
    iconGlow: "rgba(96,165,250,0.3)",
  },
  {
    path: "/tickets",
    label: "Обращения",
    Icon: TicketIcon,
    iconColor: "#f87171",
    iconGlow: "rgba(248,113,113,0.3)",
  },
  {
    path: "/managers",
    label: "Менеджеры",
    Icon: NinjaIcon,
    iconColor: "#a78bfa",
    iconGlow: "rgba(167,139,250,0.3)",
  },
  {
    path: "/offices",
    label: "Офисы",
    Icon: OfficeIcon,
    iconColor: "#fb923c",
    iconGlow: "rgba(251,146,60,0.3)",
  },
  {
    path: "/analytics",
    label: "Аналитика",
    Icon: ChartIcon,
    iconColor: "#f472b6",
    iconGlow: "rgba(244,114,182,0.3)",
  },
  {
    path: "/assistant",
    label: "AI Ассистент",
    Icon: BrainIcon,
    iconColor: "#38f8d2",
    iconGlow: "rgba(56,248,210,0.3)",
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <aside className={`app-sidebar ${isOpen ? "open" : ""}`}>
      {/* Логотип + Close button */}
      <div
        style={{
          padding: "24px 20px",
          borderBottom: "1px solid var(--border-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <FireLogo size={40} />
          <div>
            <h1
              style={{
                fontFamily: "'Bungee Shade', cursive",
                fontSize: "1.1rem",
                color: "var(--lime)",
                textShadow: "0 0 15px var(--lime-glow)",
                lineHeight: 1.2,
                letterSpacing: "1px",
              }}
            >
              FIRE
            </h1>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "9px",
                color: "var(--text-secondary)",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              Routing Engine
            </span>
          </div>
        </div>

        <button
          className="sidebar-close-btn"
          onClick={onClose}
          style={{
            background: "none",
            border: "1px solid var(--border-default)",
            color: "var(--text-secondary)",
            width: "32px",
            height: "32px",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            fontSize: "16px",
            alignItems: "center",
            justifyContent: "center",
            transition: "all var(--transition-fast)",
          }}
        >
          ✕
        </button>
      </div>

      {/* Навигация */}
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    color: isActive ? "var(--lime)" : "var(--text-secondary)",
                    background: isActive ? "var(--lime-subtle)" : "transparent",
                    border: isActive
                      ? "1px solid var(--border-default)"
                      : "1px solid transparent",
                    transition: "all var(--transition-normal)",
                    textDecoration: "none",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "13px",
                    fontWeight: 500,
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "var(--bg-hover)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  <item.Icon
                    size={22}
                    color={isActive ? "#a3f75c" : item.iconColor}
                    glow={isActive ? "rgba(163,247,92,0.4)" : item.iconGlow}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        right: "12px",
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "var(--lime)",
                        boxShadow: "0 0 10px var(--lime-glow)",
                      }}
                    />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Нижняя секция */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px",
            borderRadius: "var(--radius-md)",
            background: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <PizzaIcon size={32} />
          <div>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "11px",
                color: "var(--fn-amber)",
                letterSpacing: "1px",
              }}
            >
              COWABUNGA!
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "var(--text-muted)",
                marginTop: "2px",
              }}
            >
              v1.0 • TURTLE POWER
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
