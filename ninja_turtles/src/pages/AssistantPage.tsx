import { useState, useRef, useEffect } from "react";
import { askAssistant } from "../api/apiService";
import type { AiQueryResponse } from "../api/types";

interface Message {
  role: "user" | "assistant";
  text: string;
  data?: Record<string, unknown>[];
  chartType?: string | null;
  chartConfig?: {
    xAxis: string;
    yAxis: string;
    groupBy: string | null;
  } | null;
  loading?: boolean;
}

const suggestions = [
  "Сколько всего обращений в системе?",
  "Покажи распределение по типам обращений",
  "Какие менеджеры работают в Алматы?",
  "Какие обращения с негативной тональностью?",
  "Топ-5 менеджеров по нагрузке",
  "Распределение обращений по городам",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Привет! Я AI-ассистент системы FIRE. Задайте вопрос об обращениях, менеджерах или офисах — я проанализирую данные и отвечу.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", text: text.trim() };
    const loadingMsg: Message = { role: "assistant", text: "", loading: true };
    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response: AiQueryResponse = await askAssistant(text.trim());
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = {
          role: "assistant",
          text: response.answer,
          data: response.data,
          chartType: response.chartType,
          chartConfig: response.chartConfig,
        };
        return newMsgs;
      });
    } catch (err) {
      setMessages((prev) => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = {
          role: "assistant",
          text: `Ошибка: ${err instanceof Error ? err.message : "Не удалось получить ответ"}`,
        };
        return newMsgs;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - var(--header-height) - 64px)",
      }}
    >
      <div
        className="glass-card chat-container"
        style={{
          height: "calc(100vh - var(--header-height) - 48px)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          ref={chatRef}
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "16px 0",
          }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                animation: "slideUp 0.3s ease",
              }}
            >
              <div
                style={{
                  background:
                    msg.role === "user" ? "var(--lime)" : "var(--bg-surface)",
                  color: msg.role === "user" ? "#000" : "var(--text-primary)",
                  border:
                    msg.role === "user"
                      ? "none"
                      : "1px solid var(--border-default)",
                  borderRadius:
                    msg.role === "user"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                  padding: "14px 18px",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  boxShadow:
                    msg.role === "user"
                      ? "0 0 20px rgba(57,255,20,0.15)"
                      : "none",
                }}
              >
                {msg.loading ? (
                  <div
                    style={{ display: "flex", gap: "4px", padding: "4px 0" }}
                  >
                    {[0, 1, 2].map((j) => (
                      <span
                        key={j}
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "var(--lime)",
                          animation: `pulse 1s ease ${j * 0.2}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
                )}
              </div>

              {msg.data && msg.data.length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  {msg.chartType === "bar" && msg.chartConfig && (
                    <div
                      className="glass-card"
                      style={{ padding: "20px", marginBottom: "12px" }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          marginBottom: "12px",
                          fontFamily: "'Space Grotesk', sans-serif",
                          letterSpacing: "1px",
                        }}
                      >
                        📊 BAR CHART
                      </div>
                      <BarChart data={msg.data} config={msg.chartConfig} />
                    </div>
                  )}

                  {msg.chartType === "pie" && msg.chartConfig && (
                    <div
                      className="glass-card"
                      style={{ padding: "20px", marginBottom: "12px" }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          marginBottom: "12px",
                          fontFamily: "'Space Grotesk', sans-serif",
                          letterSpacing: "1px",
                        }}
                      >
                        🍕 PIE CHART
                      </div>
                      <PieChart data={msg.data} config={msg.chartConfig} />
                    </div>
                  )}

                  <div
                    className="glass-card"
                    style={{ padding: "16px", overflow: "auto" }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        marginBottom: "8px",
                        fontFamily: "'Space Grotesk', sans-serif",
                        letterSpacing: "1px",
                      }}
                    >
                      📋 ДАННЫЕ ({msg.data.length} записей)
                    </div>
                    <table className="data-table">
                      <thead>
                        <tr>
                          {Object.keys(msg.data[0]).map((key) => (
                            <th key={key}>{key}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {msg.data.slice(0, 20).map((row, ri) => (
                          <tr key={ri}>
                            {Object.values(row).map((val, ci) => (
                              <td key={ci} style={{ fontSize: "12px" }}>
                                {String(val ?? "—")}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {msg.data.length > 20 && (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "8px",
                          color: "var(--text-muted)",
                          fontSize: "11px",
                        }}
                      >
                        ...и еще {msg.data.length - 20} записей
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <div
          className="chat-suggestions"
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "16px",
          }}
        >
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="btn"
              onClick={() => sendMessage(s)}
              disabled={isLoading}
              style={{
                fontSize: "11px",
                padding: "6px 14px",
                borderRadius: "20px",
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-secondary)",
                transition: "all 0.2s ease",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div
          className="chat-input-row"
          style={{ display: "flex", gap: "12px" }}
        >
          <input
            className="input"
            style={{ flex: 1, borderRadius: "24px", padding: "12px 20px" }}
            placeholder="Задайте вопрос об обращениях, менеджерах..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            disabled={isLoading}
          />
          <button
            className="btn btn-primary"
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
            style={{ borderRadius: "24px", padding: "12px 20px" }}
          >
            {isLoading ? "⏳" : "🚀"}
          </button>
        </div>
      </div>
    </div>
  );
}

const chartColors = [
  "var(--lime)",
  "var(--fn-blue)",
  "var(--fn-red)",
  "var(--aurora-purple)",
  "var(--fn-orange)",
  "var(--fn-amber)",
  "#00bcd4",
  "#e91e63",
];

function BarChart({
  data,
  config,
}: {
  data: Record<string, unknown>[];
  config: { xAxis: string; yAxis: string };
}) {
  const maxVal = Math.max(...data.map((d) => Number(d[config.yAxis]) || 0), 1);
  const barWidth = Math.min(40, Math.floor(300 / data.length));

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "4px",
        height: "160px",
        padding: "0 8px",
      }}
    >
      {data.map((d, i) => {
        const val = Number(d[config.yAxis]) || 0;
        const h = (val / maxVal) * 140;
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
                fontSize: "10px",
                color: "var(--text-secondary)",
                marginBottom: "4px",
              }}
            >
              {val}
            </div>
            <div
              style={{
                width: `${barWidth}px`,
                height: `${h}px`,
                background: chartColors[i % chartColors.length],
                borderRadius: "4px 4px 0 0",
                boxShadow: `0 0 10px ${chartColors[i % chartColors.length]}30`,
                transition: "height 0.5s ease",
              }}
            />
            <div
              style={{
                fontSize: "9px",
                color: "var(--text-muted)",
                marginTop: "4px",
                textAlign: "center",
                maxWidth: `${barWidth + 10}px`,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {String(d[config.xAxis])}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PieChart({
  data,
  config,
}: {
  data: Record<string, unknown>[];
  config: { xAxis: string; yAxis: string };
}) {
  const total = data.reduce((s, d) => s + (Number(d[config.yAxis]) || 0), 0);
  if (total === 0)
    return (
      <div style={{ color: "var(--text-muted)", textAlign: "center" }}>
        Нет данных
      </div>
    );

  let cumAngle = 0;
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const r = 55;
  const strokeWidth = 24;

  const segments = data.map((d, i) => {
    const val = Number(d[config.yAxis]) || 0;
    const angle = (val / total) * 360;
    const startAngle = cumAngle;
    cumAngle += angle;
    return {
      label: String(d[config.xAxis]),
      val,
      angle,
      startAngle,
      endAngle: cumAngle,
      color: chartColors[i % chartColors.length],
    };
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {segments.map((seg, i) => {
          const startRad = ((seg.startAngle - 90) * Math.PI) / 180;
          const endRad = ((seg.endAngle - 90) * Math.PI) / 180;
          const largeArc = seg.angle > 180 ? 1 : 0;
          const x1 = cx + r * Math.cos(startRad);
          const y1 = cy + r * Math.sin(startRad);
          const x2 = cx + r * Math.cos(endRad);
          const y2 = cy + r * Math.sin(endRad);
          return (
            <path
              key={i}
              d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          );
        })}
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fill="var(--text-primary)"
          fontSize="18"
          fontFamily="'Space Grotesk', sans-serif"
        >
          {total}
        </text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {segments.map((seg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "2px",
                background: seg.color,
              }}
            />
            <span style={{ color: "var(--text-secondary)" }}>{seg.label}</span>
            <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>
              {seg.val}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
