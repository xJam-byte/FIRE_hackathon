import { useState, useEffect, useRef } from "react";
import {
  getDashboardStats,
  getDashboardByType,
  getDashboardByManager,
  getTickets,
  processRouting,
} from "../api/apiService";
import type {
  DashboardStats,
  ByTypeItem,
  ByManagerItem,
  TicketWithRelations,
  ProcessResult,
} from "../api/types";
import {
  TurtleHead,
  SwordsIcon,
  AlertIcon,
  DnaIcon,
  HourglassIcon,
  ChartIcon,
  PeopleIcon,
  TicketIcon,
  NinjaIcon,
  OfficeIcon,
  StarIcon,
} from "../components/Icons";

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const typeColors: Record<string, string> = {
  Жалоба: "var(--fn-red)",
  Консультация: "var(--fn-blue)",
  Претензия: "var(--fn-orange)",
  "Смена данных": "var(--aurora-purple)",
  "Неработоспособность приложения": "var(--lime)",
  "Мошеннические действия": "#ff0055",
  Спам: "var(--text-muted)",
};

function DonutChart({
  data,
}: {
  data: { type: string; count: number; color: string }[];
}) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0)
    return (
      <div
        style={{
          color: "var(--text-muted)",
          padding: "40px",
          textAlign: "center",
        }}
      >
        Нет данных
      </div>
    );
  let cumAngle = 0;
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = 75;
  const strokeWidth = 28;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "24px",
        flexWrap: "wrap",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((d, i) => {
          const angle = (d.count / total) * 360;
          const startAngle = cumAngle;
          cumAngle += angle;
          const endAngle = cumAngle;
          const startRad = ((startAngle - 90) * Math.PI) / 180;
          const endRad = ((endAngle - 90) * Math.PI) / 180;
          const largeArc = angle > 180 ? 1 : 0;
          const x1 = cx + r * Math.cos(startRad);
          const y1 = cy + r * Math.sin(startRad);
          const x2 = cx + r * Math.cos(endRad);
          const y2 = cy + r * Math.sin(endRad);
          return (
            <path
              key={i}
              d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{
                filter: `drop-shadow(0 0 6px ${d.color}40)`,
                opacity: 0,
                animation: `fadeIn 0.5s ease ${i * 0.1}s forwards`,
              }}
            />
          );
        })}
        <text
          x={cx}
          y={cy - 5}
          textAnchor="middle"
          fill="var(--text-primary)"
          fontSize="24"
          fontFamily="'Space Grotesk', sans-serif"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 14}
          textAnchor="middle"
          fill="var(--text-secondary)"
          fontSize="10"
          fontFamily="'Space Mono', monospace"
        >
          обращений
        </text>
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {data.map((d, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "12px",
            }}
          >
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "3px",
                background: d.color,
                flexShrink: 0,
              }}
            />
            <span style={{ color: "var(--text-secondary)", minWidth: "100px" }}>
              {d.type}
            </span>
            <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>
              {d.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoadBar({
  data,
}: {
  data: { name: string; load: number; max: number }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {data.map((d, i) => {
        const pct = d.max > 0 ? (d.load / d.max) * 100 : 0;
        const barColor =
          pct > 80
            ? "var(--fn-red)"
            : pct > 50
              ? "var(--fn-orange)"
              : "var(--lime)";
        return (
          <div
            key={i}
            style={{
              opacity: 0,
              animation: `slideUp 0.4s ease ${i * 0.08}s forwards`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span
                style={{ fontSize: "12px", color: "var(--text-secondary)" }}
              >
                {d.name}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-primary)",
                  fontWeight: 700,
                }}
              >
                {d.load}/{d.max}
              </span>
            </div>
            <div
              style={{
                height: "6px",
                background: "var(--bg-elevated)",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: barColor,
                  borderRadius: "3px",
                  boxShadow: `0 0 10px ${barColor}50`,
                  transition: "width 1s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

const statCardIcons = [
  <SwordsIcon size={28} color="#1e90ff" glow="rgba(30,144,255,0.4)" />,
  <AlertIcon size={28} color="#ff2d2d" glow="rgba(255,45,45,0.4)" />,
  <DnaIcon size={28} color="#b44dff" glow="rgba(180,77,255,0.4)" />,
  <HourglassIcon size={28} color="#ff6a00" glow="rgba(255,106,0,0.4)" />,
];

function PriorityDot({ priority }: { priority: number }) {
  const color =
    priority >= 8 ? "#ff2d2d" : priority >= 5 ? "#ffa500" : "#39ff14";
  const glow =
    priority >= 8
      ? "rgba(255,45,45,0.5)"
      : priority >= 5
        ? "rgba(255,165,0,0.5)"
        : "rgba(57,255,20,0.5)";
  return (
    <span
      style={{
        display: "inline-block",
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 6px ${glow}`,
        marginRight: "4px",
        verticalAlign: "middle",
      }}
    />
  );
}

const statusMap: Record<string, { label: string; cls: string }> = {
  new: { label: "Новое", cls: "warning" },
  analyzed: { label: "Проанализировано", cls: "info" },
  assigned: { label: "Назначено", cls: "positive" },
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [byType, setByType] = useState<ByTypeItem[]>([]);
  const [byManager, setByManager] = useState<ByManagerItem[]>([]);
  const [recentTickets, setRecentTickets] = useState<TicketWithRelations[]>([]);
  const [selectedTicket, setSelectedTicket] =
    useState<TicketWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processResult, setProcessResult] = useState<ProcessResult | null>(
    null,
  );

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, typeData, managerData, ticketsData] = await Promise.all(
        [
          getDashboardStats(),
          getDashboardByType(),
          getDashboardByManager(),
          getTickets({ page: 1, limit: 6 }),
        ],
      );
      setStats(statsData);
      setByType(typeData);
      setByManager(managerData);
      setRecentTickets(ticketsData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProcess = async () => {
    setProcessing(true);
    setProcessResult(null);
    try {
      const result = await processRouting();
      setProcessResult(result);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка обработки");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "40px", animation: "pulse 1.5s ease infinite" }}
          >
            🔥
          </div>
          <div
            style={{
              marginTop: "16px",
              color: "var(--text-secondary)",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "13px",
            }}
          >
            Загрузка данных...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="glass-card"
        style={{ padding: "40px", textAlign: "center" }}
      >
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>❌</div>
        <div style={{ color: "var(--fn-red)", marginBottom: "12px" }}>
          {error}
        </div>
        <button className="btn btn-primary" onClick={fetchData}>
          Повторить
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    { label: "Всего обращений", value: stats.totalTickets, cls: "leo" },
    { label: "Проанализировано AI", value: stats.analyzedTickets, cls: "raph" },
    { label: "Назначено", value: stats.assignedTickets, cls: "donnie" },
    { label: "В ожидании", value: stats.pendingTickets, cls: "mikey" },
  ];

  const donutData = byType.map((t) => ({
    type: t.type,
    count: t.count,
    color: typeColors[t.type] || "var(--text-secondary)",
  }));

  const managerLoadData = byManager.map((m) => ({
    name: m.fullName.split(" ").slice(0, 2).join(" "),
    load: m.currentLoad,
    max:
      m.assignmentsCount > 0
        ? Math.max(m.assignmentsCount, m.currentLoad)
        : Math.max(10, m.currentLoad),
  }));

  return (
    <div>
      <RevealSection>
        <div
          style={{
            background:
              "linear-gradient(135deg, var(--bg-surface) 0%, rgba(57, 255, 20, 0.05) 100%)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-xl)",
            padding: "32px",
            marginBottom: "32px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-10px",
              right: "10px",
              opacity: 0.08,
              transform: "rotate(-15deg)",
            }}
          >
            <TurtleHead size={140} color="#39ff14" glow="rgba(57,255,20,0.1)" />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "'Bungee Shade', cursive",
                  fontSize: "clamp(1.2rem, 3vw, 2rem)",
                  marginBottom: "8px",
                }}
              >
                TURTLE POWER
              </h1>
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  maxWidth: "600px",
                }}
              >
                Система FIRE обработала{" "}
                <span style={{ color: "var(--lime)", fontWeight: 700 }}>
                  {stats.analyzedTickets}
                </span>{" "}
                обращений. {stats.pendingTickets} обращений ожидают назначения.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                className="btn btn-primary"
                onClick={handleProcess}
                disabled={processing}
                style={{ opacity: processing ? 0.6 : 1 }}
              >
                {processing ? "⏳ Обработка..." : "🚀 Запустить обработку"}
              </button>
            </div>
          </div>
          {processResult && (
            <div
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--lime)",
                fontSize: "13px",
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <span>
                Обработано:{" "}
                <strong style={{ color: "var(--lime)" }}>
                  {processResult.total}
                </strong>
              </span>
              <span>
                Проанализировано:{" "}
                <strong style={{ color: "var(--fn-blue)" }}>
                  {processResult.analyzed}
                </strong>
              </span>
              <span>
                Назначено:{" "}
                <strong style={{ color: "var(--aurora-purple)" }}>
                  {processResult.assigned}
                </strong>
              </span>
              {processResult.errors > 0 && (
                <span>
                  Ошибки:{" "}
                  <strong style={{ color: "var(--fn-red)" }}>
                    {processResult.errors}
                  </strong>
                </span>
              )}
            </div>
          )}
        </div>
      </RevealSection>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        {statCards.map((card, i) => (
          <RevealSection key={i} delay={i * 100}>
            <div className={`stat-card ${card.cls}`}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      marginBottom: "8px",
                      fontFamily: "'Space Grotesk', sans-serif",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {card.label}
                  </div>
                  <div
                    style={{
                      fontSize: "32px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      lineHeight: 1,
                    }}
                  >
                    {card.value}
                  </div>
                </div>
                {statCardIcons[i]}
              </div>
            </div>
          </RevealSection>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        <RevealSection delay={200}>
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "14px",
                letterSpacing: "1px",
                marginBottom: "20px",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ChartIcon size={20} /> Распределение по типам
            </h3>
            <DonutChart data={donutData} />
          </div>
        </RevealSection>

        <RevealSection delay={300}>
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "14px",
                letterSpacing: "1px",
                marginBottom: "20px",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <PeopleIcon size={20} /> Нагрузка менеджеров
            </h3>
            <LoadBar data={managerLoadData} />
          </div>
        </RevealSection>
      </div>

      <RevealSection delay={400}>
        <div className="glass-card" style={{ padding: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "14px",
                letterSpacing: "1px",
                color: "var(--text-primary)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <TicketIcon size={20} /> Последние обращения
            </h3>
            <a
              href="/tickets"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "11px",
                letterSpacing: "1px",
                color: "var(--lime)",
              }}
            >
              ВСЕ →
            </a>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Тип</th>
                  <th>Сегмент</th>
                  <th>Приоритет</th>
                  <th>Тональность</th>
                  <th>Менеджер</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {recentTickets.map((t, i) => {
                  const ai = t.aiAnalysis;
                  const st = statusMap[t.status] || {
                    label: t.status,
                    cls: "neutral",
                  };
                  return (
                    <tr
                      key={t.id}
                      onClick={() => setSelectedTicket(t)}
                      style={{
                        opacity: 0,
                        animation: `fadeIn 0.3s ease ${i * 0.05}s forwards`,
                      }}
                    >
                      <td
                        style={{
                          fontWeight: 700,
                          color: "var(--lime)",
                          fontSize: "12px",
                        }}
                      >
                        #{t.id}
                      </td>
                      <td>{ai?.type || "—"}</td>
                      <td>
                        <span
                          className={`badge ${t.segment === "VIP" ? "vip" : t.segment === "Priority" ? "warning" : "neutral"}`}
                        >
                          {t.segment}
                        </span>
                      </td>
                      <td>
                        {ai ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              color:
                                ai.priority >= 8
                                  ? "var(--fn-red)"
                                  : ai.priority >= 5
                                    ? "var(--fn-orange)"
                                    : "var(--text-secondary)",
                              fontWeight: 700,
                            }}
                          >
                            <PriorityDot priority={ai.priority} /> {ai.priority}
                            /10
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>
                        {ai ? (
                          <span
                            className={`badge ${ai.tonality === "Позитивный" ? "positive" : ai.tonality === "Негативный" ? "negative" : "neutral"}`}
                          >
                            {ai.tonality}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td style={{ fontSize: "12px" }}>
                        {t.assignment?.manager?.fullName || "—"}
                      </td>
                      <td>
                        <span className={`badge ${st.cls}`}>{st.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </RevealSection>

      {selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}

function TicketModal({
  ticket,
  onClose,
}: {
  ticket: TicketWithRelations;
  onClose: () => void;
}) {
  const ai = ticket.aiAnalysis;
  const st = statusMap[ticket.status] || {
    label: ticket.status,
    cls: "neutral",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: "var(--radius-xl)",
          maxWidth: "700px",
          width: "100%",
          maxHeight: "85vh",
          overflow: "auto",
          padding: "32px",
          animation: "slideUp 0.3s ease",
          boxShadow: "0 0 60px rgba(57, 255, 20, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "18px",
                marginBottom: "4px",
              }}
            >
              #{ticket.id}
            </h2>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <span
                className={`badge ${ticket.segment === "VIP" ? "vip" : ticket.segment === "Priority" ? "warning" : "neutral"}`}
              >
                {ticket.segment}
              </span>
              <span className={`badge ${st.cls}`}>{st.label}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn"
            style={{ padding: "8px 12px", fontSize: "16px" }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            background: "var(--bg-elevated)",
            borderRadius: "var(--radius-md)",
            padding: "16px",
            marginBottom: "20px",
            borderLeft: "3px solid var(--lime)",
          }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "var(--text-muted)",
              marginBottom: "6px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Текст обращения
          </div>
          <p style={{ fontSize: "13px", lineHeight: 1.6 }}>
            {ticket.description}
          </p>
        </div>

        {ai && (
          <>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px",
                marginBottom: "12px",
                color: "var(--aurora-purple)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <DnaIcon size={20} color="#b44dff" glow="rgba(180,77,255,0.3)" />{" "}
              AI-аналитика
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              {[
                { label: "Тип", value: ai.type },
                { label: "Тональность", value: ai.tonality },
                { label: "Приоритет", value: `${ai.priority}/10` },
                { label: "Язык", value: ai.language },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "var(--bg-elevated)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "4px",
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
                marginBottom: "20px",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  color: "var(--lime)",
                  marginBottom: "6px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: "1px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <StarIcon
                  size={16}
                  color="#39ff14"
                  glow="rgba(57,255,20,0.3)"
                />{" "}
                SUMMARY
              </div>
              <p style={{ fontSize: "13px", lineHeight: 1.5 }}>{ai.summary}</p>
            </div>
          </>
        )}

        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div
            style={{
              flex: 1,
              minWidth: "200px",
              background: "var(--bg-elevated)",
              borderRadius: "var(--radius-md)",
              padding: "16px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                marginBottom: "6px",
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "1px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <NinjaIcon size={16} /> Менеджер
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700 }}>
              {ticket.assignment?.manager?.fullName || "—"}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              minWidth: "200px",
              background: "var(--bg-elevated)",
              borderRadius: "var(--radius-md)",
              padding: "16px",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-muted)",
                marginBottom: "6px",
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "1px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <OfficeIcon size={16} /> Офис
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700 }}>
              {ticket.assignment?.businessUnit?.name || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
