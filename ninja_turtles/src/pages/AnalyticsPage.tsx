import { useState, useEffect, useRef } from "react";
import { getAnalyticsStats, getAnalyticsReport } from "../api/apiService";
import type {
  AnalyticsStats,
  AnalyticsReport,
  AiRecommendation,
  AiRisk,
  AiKpi,
} from "../api/types";
import {
  ChartIcon,
  AlertIcon,
  StarIcon,
  PeopleIcon,
  OfficeIcon,
  DnaIcon,
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
  Жалоба: "#ff2d2d",
  Консультация: "#1e90ff",
  Претензия: "#ff6a00",
  "Смена данных": "#b44dff",
  "Неработоспособность приложения": "#39ff14",
  "Мошеннические действия": "#ff0055",
  Спам: "#777",
};

const tonalityColors: Record<string, string> = {
  Позитивный: "#39ff14",
  Нейтральный: "#60a5fa",
  Негативный: "#ff2d2d",
};

const priorityColor = (sev: string) => {
  switch (sev) {
    case "critical":
      return "var(--fn-red)";
    case "high":
      return "var(--fn-orange)";
    case "medium":
      return "var(--fn-amber)";
    default:
      return "var(--lime)";
  }
};

const kpiStatusColor = (s: string) => {
  switch (s) {
    case "good":
      return "var(--lime)";
    case "warning":
      return "var(--fn-orange)";
    case "critical":
      return "var(--fn-red)";
    default:
      return "var(--text-secondary)";
  }
};

const categoryLabels: Record<string, string> = {
  staffing: "👥 Кадры",
  process: "⚙️ Процессы",
  quality: "✨ Качество",
  technology: "💻 Технологии",
  training: "📚 Обучение",
};

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [report, setReport] = useState<AnalyticsReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "ai">("overview");

  useEffect(() => {
    setLoading(true);
    getAnalyticsStats()
      .then(setStats)
      .catch((err) =>
        setError(err instanceof Error ? err.message : "Ошибка загрузки"),
      )
      .finally(() => setLoading(false));
  }, []);

  const loadAiReport = async () => {
    if (report) {
      setActiveTab("ai");
      return;
    }
    setAiLoading(true);
    setActiveTab("ai");
    try {
      const r = await getAnalyticsReport();
      setReport(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка AI");
    } finally {
      setAiLoading(false);
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
            style={{ fontSize: "48px", animation: "pulse 1.5s ease infinite" }}
          >
            📊
          </div>
          <div
            style={{
              marginTop: "16px",
              color: "var(--text-secondary)",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "13px",
            }}
          >
            Загрузка аналитики...
          </div>
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div
        className="glass-card"
        style={{ padding: "40px", textAlign: "center" }}
      >
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>❌</div>
        <div style={{ color: "var(--fn-red)", marginBottom: "12px" }}>
          {error}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Повторить
        </button>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div>
      {/* Header */}
      <RevealSection>
        <div
          style={{
            background:
              "linear-gradient(135deg, var(--bg-surface) 0%, rgba(180,77,255,0.06) 50%, rgba(57,255,20,0.04) 100%)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-xl)",
            padding: "28px 32px",
            marginBottom: "28px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              background:
                "linear-gradient(90deg, var(--aurora-purple), var(--lime), var(--fn-blue))",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <h1
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)",
                  marginBottom: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <ChartIcon size={28} /> Полная аналитика FIRE
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
                Детальная статистика обращений с AI-рекомендациями для
                администраторов
              </p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className={`btn ${activeTab === "overview" ? "btn-primary" : ""}`}
                onClick={() => setActiveTab("overview")}
                style={{
                  padding: "8px 20px",
                  fontSize: "12px",
                  borderRadius: "20px",
                }}
              >
                📊 Обзор
              </button>
              <button
                className={`btn ${activeTab === "ai" ? "btn-primary" : ""}`}
                onClick={loadAiReport}
                style={{
                  padding: "8px 20px",
                  fontSize: "12px",
                  borderRadius: "20px",
                }}
              >
                🤖 AI-отчёт
              </button>
            </div>
          </div>
        </div>
      </RevealSection>

      {activeTab === "overview" ? (
        <OverviewTab stats={stats} />
      ) : (
        <AiTab report={report} loading={aiLoading} />
      )}
    </div>
  );
}

function OverviewTab({ stats }: { stats: AnalyticsStats }) {
  return (
    <>
      {/* Key metrics row */}
      <RevealSection delay={100}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          {[
            {
              label: "Всего тикетов",
              value: stats.overallStats.totalTickets,
              color: "var(--lime)",
              icon: "🎫",
            },
            {
              label: "Проанализировано",
              value: stats.overallStats.analyzedTickets,
              color: "var(--fn-blue)",
              icon: "🧠",
            },
            {
              label: "Назначено",
              value: stats.overallStats.assignedTickets,
              color: "var(--aurora-purple)",
              icon: "✅",
            },
            {
              label: "В ожидании",
              value: stats.overallStats.pendingTickets,
              color: "var(--fn-orange)",
              icon: "⏳",
            },
            {
              label: "Ср. приоритет",
              value: stats.recentTrends.avgPriority,
              color:
                stats.recentTrends.avgPriority >= 7
                  ? "var(--fn-red)"
                  : "var(--fn-amber)",
              icon: "🔥",
            },
            {
              label: "% негативных",
              value: `${stats.recentTrends.negativePercentage}%`,
              color:
                stats.recentTrends.negativePercentage > 40
                  ? "var(--fn-red)"
                  : "var(--lime)",
              icon: "😤",
            },
          ].map((m, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                padding: "18px",
                textAlign: "center",
                opacity: 0,
                animation: `fadeIn 0.4s ease ${i * 0.06}s forwards`,
              }}
            >
              <div style={{ fontSize: "20px", marginBottom: "6px" }}>
                {m.icon}
              </div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  color: m.color,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginTop: "4px",
                }}
              >
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </RevealSection>

      {/* Top problems + Tonality */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: "24px",
          marginBottom: "28px",
        }}
      >
        <RevealSection delay={200}>
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px",
                letterSpacing: "1px",
                marginBottom: "18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-primary)",
              }}
            >
              <AlertIcon size={20} color="#ff2d2d" glow="rgba(255,45,45,0.3)" />{" "}
              ТОП ПРОБЛЕМ
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {stats.topProblems.map((p, i) => {
                const color = typeColors[p.type] || "var(--text-secondary)";
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
                        alignItems: "center",
                        marginBottom: "4px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "16px",
                            fontWeight: 800,
                            color,
                            width: "24px",
                          }}
                        >
                          #{i + 1}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--text-primary)",
                          }}
                        >
                          {p.type}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <span
                          style={{ fontSize: "14px", fontWeight: 700, color }}
                        >
                          {p.count}
                        </span>
                        <span
                          style={{
                            fontSize: "11px",
                            color: "var(--text-muted)",
                          }}
                        >
                          ({p.percentage}%)
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        height: "5px",
                        background: "var(--bg-elevated)",
                        borderRadius: "3px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${p.percentage}%`,
                          background: color,
                          borderRadius: "3px",
                          boxShadow: `0 0 8px ${color}40`,
                          transition: "width 0.8s ease",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealSection>

        <RevealSection delay={300}>
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px",
                letterSpacing: "1px",
                marginBottom: "18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-primary)",
              }}
            >
              <DnaIcon size={20} color="#b44dff" glow="rgba(180,77,255,0.3)" />{" "}
              ТОНАЛЬНОСТЬ
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                flexWrap: "wrap",
              }}
            >
              <MiniDonut
                data={stats.tonalityBreakdown.map((t) => ({
                  label: t.tonality,
                  value: t.count,
                  color: tonalityColors[t.tonality] || "#777",
                }))}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  flex: 1,
                }}
              >
                {stats.tonalityBreakdown.map((t, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "3px",
                        background: tonalityColors[t.tonality] || "#777",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        flex: 1,
                      }}
                    >
                      {t.tonality}
                    </span>
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: tonalityColors[t.tonality] || "#777",
                      }}
                    >
                      {t.count}
                    </span>
                    <span
                      style={{ fontSize: "11px", color: "var(--text-muted)" }}
                    >
                      ({t.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealSection>
      </div>

      {/* Segments + Languages + Priority */}
      <div
        className="grid-stats"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        <RevealSection delay={350}>
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px",
                letterSpacing: "1px",
                marginBottom: "16px",
                color: "var(--text-primary)",
              }}
            >
              📋 Сегменты
            </h3>
            {stats.segmentBreakdown.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom:
                    i < stats.segmentBreakdown.length - 1
                      ? "1px solid var(--border-subtle)"
                      : "none",
                }}
              >
                <span
                  className={`badge ${s.segment === "VIP" ? "vip" : s.segment === "Priority" ? "warning" : "neutral"}`}
                >
                  {s.segment}
                </span>
                <span style={{ fontSize: "13px", fontWeight: 700 }}>
                  {s.count}{" "}
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      fontWeight: 400,
                    }}
                  >
                    ({s.percentage}%)
                  </span>
                </span>
              </div>
            ))}
          </div>
        </RevealSection>

        <RevealSection delay={400}>
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px",
                letterSpacing: "1px",
                marginBottom: "16px",
                color: "var(--text-primary)",
              }}
            >
              🌐 Языки
            </h3>
            {stats.languageBreakdown.map((l, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                  borderBottom:
                    i < stats.languageBreakdown.length - 1
                      ? "1px solid var(--border-subtle)"
                      : "none",
                }}
              >
                <span
                  className={`badge ${l.language === "ENG" ? "info" : l.language === "KZ" ? "warning" : "neutral"}`}
                >
                  {l.language}
                </span>
                <span style={{ fontSize: "13px", fontWeight: 700 }}>
                  {l.count}
                </span>
              </div>
            ))}
          </div>
        </RevealSection>

        <RevealSection delay={450}>
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px",
                letterSpacing: "1px",
                marginBottom: "16px",
                color: "var(--text-primary)",
              }}
            >
              🔥 Приоритеты
            </h3>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "3px",
                height: "100px",
              }}
            >
              {stats.priorityBreakdown.map((p, i) => {
                const max = Math.max(
                  ...stats.priorityBreakdown.map((x) => x.count),
                  1,
                );
                const h = (p.count / max) * 80;
                const color =
                  p.priority >= 8
                    ? "var(--fn-red)"
                    : p.priority >= 5
                      ? "var(--fn-orange)"
                      : "var(--lime)";
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "9px",
                        color: "var(--text-muted)",
                        marginBottom: "2px",
                      }}
                    >
                      {p.count}
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: `${h}px`,
                        background: color,
                        borderRadius: "3px 3px 0 0",
                        boxShadow: `0 0 6px ${color}30`,
                        transition: "height 0.6s ease",
                      }}
                    />
                    <div
                      style={{
                        fontSize: "9px",
                        color: "var(--text-muted)",
                        marginTop: "4px",
                      }}
                    >
                      {p.priority}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </RevealSection>
      </div>

      {/* Cities + Office load */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))",
          gap: "24px",
          marginBottom: "28px",
        }}
      >
        <RevealSection delay={500}>
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px",
                letterSpacing: "1px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-primary)",
              }}
            >
              🏙️ Топ городов
            </h3>
            {stats.cityBreakdown.slice(0, 8).map((c, i) => {
              const max = stats.cityBreakdown[0]?.count || 1;
              const pct = (c.count / max) * 100;
              return (
                <div
                  key={i}
                  style={{
                    marginBottom: "8px",
                    opacity: 0,
                    animation: `fadeIn 0.3s ease ${i * 0.05}s forwards`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "3px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {c.city}
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 700 }}>
                      {c.count}
                    </span>
                  </div>
                  <div
                    style={{
                      height: "4px",
                      background: "var(--bg-elevated)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: "var(--fn-blue)",
                        borderRadius: "2px",
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </RevealSection>

        <RevealSection delay={550}>
          <div className="glass-card" style={{ padding: "24px" }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px",
                letterSpacing: "1px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-primary)",
              }}
            >
              <OfficeIcon size={18} /> Нагрузка офисов
            </h3>
            {stats.officeLoad.map((o, i) => {
              const maxLoad = Math.max(
                ...stats.officeLoad.map((x) => x.totalLoad),
                1,
              );
              const pct = (o.totalLoad / maxLoad) * 100;
              const color =
                pct > 80
                  ? "var(--fn-red)"
                  : pct > 50
                    ? "var(--fn-orange)"
                    : "var(--lime)";
              return (
                <div
                  key={i}
                  style={{
                    marginBottom: "12px",
                    opacity: 0,
                    animation: `slideUp 0.4s ease ${i * 0.1}s forwards`,
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
                      style={{
                        fontSize: "12px",
                        color: "var(--text-primary)",
                        fontWeight: 600,
                      }}
                    >
                      {o.name}
                    </span>
                    <span
                      style={{ fontSize: "11px", color: "var(--text-muted)" }}
                    >
                      {o.managersCount} менеджеров · {o.assignmentsCount}{" "}
                      назначений
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "3px",
                    }}
                  >
                    <span
                      style={{ fontSize: "10px", color: "var(--text-muted)" }}
                    >
                      Общая нагрузка
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color }}>
                      {o.totalLoad}
                    </span>
                  </div>
                  <div
                    style={{
                      height: "5px",
                      background: "var(--bg-elevated)",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: color,
                        borderRadius: "3px",
                        boxShadow: `0 0 8px ${color}40`,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </RevealSection>
      </div>

      {/* Manager Load Top */}
      <RevealSection delay={600}>
        <div className="glass-card" style={{ padding: "24px" }}>
          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "13px",
              letterSpacing: "1px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-primary)",
            }}
          >
            <PeopleIcon size={18} /> Топ менеджеров по нагрузке
          </h3>
          <div className="table-scroll-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Менеджер</th>
                  <th>Должность</th>
                  <th>Навыки</th>
                  <th>Офис</th>
                  <th>Нагрузка</th>
                  <th>Назначений</th>
                </tr>
              </thead>
              <tbody>
                {stats.managerLoad.slice(0, 10).map((m, i) => {
                  const loadColor =
                    m.currentLoad >= 8
                      ? "var(--fn-red)"
                      : m.currentLoad >= 5
                        ? "var(--fn-orange)"
                        : "var(--lime)";
                  return (
                    <tr
                      key={m.id}
                      style={{
                        opacity: 0,
                        animation: `fadeIn 0.3s ease ${i * 0.04}s forwards`,
                      }}
                    >
                      <td
                        style={{ fontWeight: 700, color: "var(--text-muted)" }}
                      >
                        {i + 1}
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {m.fullName.split(" ").slice(0, 2).join(" ")}
                      </td>
                      <td>
                        <span
                          className={`badge ${m.position === "Главный специалист" ? "vip" : m.position === "Ведущий специалист" ? "info" : "neutral"}`}
                        >
                          {m.position}
                        </span>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "4px",
                            flexWrap: "wrap",
                          }}
                        >
                          {m.skills.map((s) => (
                            <span
                              key={s}
                              className={`badge ${s === "VIP" ? "vip" : s === "ENG" ? "info" : "warning"}`}
                              style={{ fontSize: "9px" }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ fontSize: "12px" }}>{m.office}</td>
                      <td>
                        <span style={{ color: loadColor, fontWeight: 700 }}>
                          {m.currentLoad}
                        </span>
                      </td>
                      <td>{m.assignmentsCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </RevealSection>

      {/* High Priority Tickets */}
      {stats.highPriorityTickets.length > 0 && (
        <RevealSection delay={700}>
          <div
            className="glass-card"
            style={{
              padding: "24px",
              marginTop: "28px",
              borderLeft: "3px solid var(--fn-red)",
            }}
          >
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px",
                letterSpacing: "1px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--fn-red)",
              }}
            >
              🚨 Критические обращения (приоритет 8-10)
            </h3>
            <div className="table-scroll-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Тип</th>
                    <th>Приоритет</th>
                    <th>Тональность</th>
                    <th>Сегмент</th>
                    <th>Город</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.highPriorityTickets.map((t, i) => (
                    <tr
                      key={t.id}
                      style={{
                        opacity: 0,
                        animation: `fadeIn 0.3s ease ${i * 0.04}s forwards`,
                      }}
                    >
                      <td style={{ fontWeight: 700, color: "var(--fn-red)" }}>
                        #{t.id}
                      </td>
                      <td>{t.aiAnalysis?.type || "—"}</td>
                      <td>
                        <span
                          style={{ color: "var(--fn-red)", fontWeight: 700 }}
                        >
                          {t.aiAnalysis?.priority}/10
                        </span>
                      </td>
                      <td>
                        {t.aiAnalysis && (
                          <span
                            className={`badge ${t.aiAnalysis.tonality === "Негативный" ? "negative" : t.aiAnalysis.tonality === "Позитивный" ? "positive" : "neutral"}`}
                          >
                            {t.aiAnalysis.tonality}
                          </span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge ${t.segment === "VIP" ? "vip" : t.segment === "Priority" ? "warning" : "neutral"}`}
                        >
                          {t.segment}
                        </span>
                      </td>
                      <td style={{ fontSize: "12px" }}>{t.city || "—"}</td>
                      <td>
                        <span
                          className={`badge ${t.status === "assigned" ? "positive" : t.status === "analyzed" ? "info" : "warning"}`}
                        >
                          {t.status === "assigned"
                            ? "Назначено"
                            : t.status === "analyzed"
                              ? "Проанализировано"
                              : "Новое"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </RevealSection>
      )}
    </>
  );
}

function AiTab({
  report,
  loading,
}: {
  report: AnalyticsReport | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "300px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{ fontSize: "48px", animation: "pulse 1.5s ease infinite" }}
          >
            🤖
          </div>
          <div
            style={{
              marginTop: "16px",
              color: "var(--text-secondary)",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "13px",
            }}
          >
            AI анализирует данные и генерирует рекомендации...
          </div>
          <div
            style={{
              marginTop: "8px",
              color: "var(--text-muted)",
              fontSize: "11px",
            }}
          >
            Это может занять 10-20 секунд
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const { aiReport } = report;

  return (
    <>
      {/* Summary */}
      <RevealSection>
        <div
          className="glass-card"
          style={{
            padding: "24px",
            marginBottom: "24px",
            borderLeft: "3px solid var(--aurora-purple)",
          }}
        >
          <h3
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "13px",
              letterSpacing: "1px",
              marginBottom: "10px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--aurora-purple)",
            }}
          >
            <StarIcon size={18} color="#b44dff" glow="rgba(180,77,255,0.3)" />{" "}
            ОБЩАЯ ОЦЕНКА
          </h3>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
              color: "var(--text-primary)",
            }}
          >
            {aiReport.summary}
          </p>
        </div>
      </RevealSection>

      {/* KPIs */}
      {aiReport.kpis && aiReport.kpis.length > 0 && (
        <RevealSection delay={100}>
          <div
            className="grid-kpis"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {aiReport.kpis.map((kpi: AiKpi, i: number) => (
              <div
                key={i}
                className="glass-card"
                style={{
                  padding: "20px",
                  borderTop: `3px solid ${kpiStatusColor(kpi.status)}`,
                  opacity: 0,
                  animation: `slideUp 0.4s ease ${i * 0.1}s forwards`,
                }}
              >
                <div
                  style={{
                    fontSize: "10px",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "8px",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {kpi.name}
                </div>
                <div
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    color: kpiStatusColor(kpi.status),
                    marginBottom: "4px",
                  }}
                >
                  {kpi.value}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Цель: {kpi.target}
                </div>
                <div style={{ marginTop: "8px" }}>
                  <span
                    className={`badge ${kpi.status === "good" ? "positive" : kpi.status === "warning" ? "warning" : "negative"}`}
                    style={{ fontSize: "9px" }}
                  >
                    {kpi.status === "good"
                      ? "✅ Норма"
                      : kpi.status === "warning"
                        ? "⚠️ Внимание"
                        : "🚨 Критично"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </RevealSection>
      )}

      {/* Recommendations */}
      {aiReport.recommendations && aiReport.recommendations.length > 0 && (
        <RevealSection delay={200}>
          <div
            className="glass-card"
            style={{ padding: "24px", marginBottom: "24px" }}
          >
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px",
                letterSpacing: "1px",
                marginBottom: "18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--lime)",
              }}
            >
              💡 РЕКОМЕНДАЦИИ ДЛЯ АДМИНИСТРАТОРОВ
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {aiReport.recommendations.map(
                (rec: AiRecommendation, i: number) => (
                  <div
                    key={i}
                    style={{
                      padding: "16px 20px",
                      background: "var(--bg-elevated)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-subtle)",
                      borderLeft: `3px solid ${priorityColor(rec.priority)}`,
                      opacity: 0,
                      animation: `slideUp 0.4s ease ${i * 0.08}s forwards`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "6px",
                        flexWrap: "wrap",
                        gap: "6px",
                      }}
                    >
                      <h4
                        style={{
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: "13px",
                          color: "var(--text-primary)",
                          margin: 0,
                        }}
                      >
                        {rec.title}
                      </h4>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span
                          className={`badge ${rec.priority === "high" ? "negative" : rec.priority === "medium" ? "warning" : "neutral"}`}
                          style={{ fontSize: "9px" }}
                        >
                          {rec.priority === "high"
                            ? "🔴 Высокий"
                            : rec.priority === "medium"
                              ? "🟡 Средний"
                              : "🟢 Низкий"}
                        </span>
                        <span
                          className="badge neutral"
                          style={{ fontSize: "9px" }}
                        >
                          {categoryLabels[rec.category] || rec.category}
                        </span>
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                        margin: 0,
                      }}
                    >
                      {rec.description}
                    </p>
                  </div>
                ),
              )}
            </div>
          </div>
        </RevealSection>
      )}

      {/* Risks */}
      {aiReport.risks && aiReport.risks.length > 0 && (
        <RevealSection delay={300}>
          <div
            className="glass-card"
            style={{ padding: "24px", borderLeft: "3px solid var(--fn-red)" }}
          >
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px",
                letterSpacing: "1px",
                marginBottom: "18px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--fn-red)",
              }}
            >
              ⚠️ ВЫЯВЛЕННЫЕ РИСКИ
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {aiReport.risks.map((risk: AiRisk, i: number) => (
                <div
                  key={i}
                  style={{
                    padding: "14px 18px",
                    background: "var(--bg-elevated)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    opacity: 0,
                    animation: `fadeIn 0.4s ease ${i * 0.1}s forwards`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <h4
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "13px",
                        color: "var(--text-primary)",
                        margin: 0,
                      }}
                    >
                      {risk.title}
                    </h4>
                    <span
                      className={`badge ${risk.severity === "critical" ? "negative" : risk.severity === "high" ? "warning" : "neutral"}`}
                      style={{ fontSize: "9px" }}
                    >
                      {risk.severity === "critical"
                        ? "🚨 Критический"
                        : risk.severity === "high"
                          ? "🔴 Высокий"
                          : risk.severity === "medium"
                            ? "🟡 Средний"
                            : "🟢 Низкий"}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {risk.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>
      )}
    </>
  );
}

function MiniDonut({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;
  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const r = 42;
  const sw = 18;
  let cum = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((d, i) => {
        const angle = (d.value / total) * 360;
        const start = cum;
        cum += angle;
        const sRad = ((start - 90) * Math.PI) / 180;
        const eRad = ((cum - 90) * Math.PI) / 180;
        const la = angle > 180 ? 1 : 0;
        return (
          <path
            key={i}
            d={`M ${cx + r * Math.cos(sRad)} ${cy + r * Math.sin(sRad)} A ${r} ${r} 0 ${la} 1 ${cx + r * Math.cos(eRad)} ${cy + r * Math.sin(eRad)}`}
            fill="none"
            stroke={d.color}
            strokeWidth={sw}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 4px ${d.color}40)` }}
          />
        );
      })}
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fill="var(--text-primary)"
        fontSize="16"
        fontFamily="'Space Grotesk', sans-serif"
      >
        {total}
      </text>
    </svg>
  );
}
