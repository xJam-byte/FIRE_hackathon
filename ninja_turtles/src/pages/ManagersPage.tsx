import { useState, useEffect } from "react";
import { getManagers } from "../api/apiService";
import type { ManagerListItem, PaginationMeta } from "../api/types";
import { TurtleHead, OfficeIcon } from "../components/Icons";

const turtleColors = ["#1e90ff", "#ff2d2d", "#b44dff", "#ff6a00"];
const turtleGlows = [
  "rgba(30,144,255,0.3)",
  "rgba(255,45,45,0.3)",
  "rgba(180,77,255,0.3)",
  "rgba(255,106,0,0.3)",
];

export default function ManagersPage() {
  const [managers, setManagers] = useState<ManagerListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchManagers = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getManagers({ page, limit: 20 });
      setManagers(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, [page]);

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
        <button className="btn btn-primary" onClick={fetchManagers}>
          Повторить
        </button>
      </div>
    );
  }

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
              fontSize: "13px",
            }}
          >
            Загрузка менеджеров...
          </div>
        </div>
      </div>
    );
  }

  const totalManagers = meta?.total || managers.length;
  const avgLoad =
    managers.length > 0
      ? Math.round(
          (managers.reduce((s, m) => s + m.currentLoad, 0) / managers.length) *
            10,
        ) / 10
      : 0;
  const chiefCount = managers.filter(
    (m) => m.position === "Главный специалист",
  ).length;
  const vipCount = managers.filter((m) => m.skills.includes("VIP")).length;

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {[
          {
            label: "Всего менеджеров",
            value: totalManagers,
            color: "var(--lime)",
          },
          { label: "Средн. нагрузка", value: avgLoad, color: "var(--fn-blue)" },
          {
            label: "Глав. специалисты",
            value: chiefCount,
            color: "var(--aurora-purple)",
          },
          { label: "VIP-навык", value: vipCount, color: "var(--fn-amber)" },
        ].map((stat, i) => (
          <div key={i} className="glass-card" style={{ padding: "20px" }}>
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-secondary)",
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: "1px",
                marginBottom: "8px",
                textTransform: "uppercase",
              }}
            >
              {stat.label}
            </div>
            <div
              style={{ fontSize: "28px", fontWeight: 700, color: stat.color }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {managers.map((mgr, i) => {
          const color = turtleColors[i % turtleColors.length];
          const maxLoad = Math.max(
            10,
            mgr.currentLoad,
            mgr._count?.assignments || 0,
          );
          const pct = (mgr.currentLoad / maxLoad) * 100;
          const loadColor =
            pct > 80
              ? "var(--fn-red)"
              : pct > 50
                ? "var(--fn-orange)"
                : "var(--lime)";

          return (
            <div
              key={mgr.id}
              className="glass-card"
              style={{
                padding: "24px",
                opacity: 0,
                animation: `slideUp 0.4s ease ${i * 0.08}s forwards`,
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
                  background: color,
                  boxShadow: `0 0 15px ${color}50`,
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    background: "var(--bg-elevated)",
                    border: `2px solid ${color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 15px ${color}30`,
                    overflow: "hidden",
                  }}
                >
                  <TurtleHead
                    size={36}
                    color={turtleColors[i % turtleColors.length]}
                    glow={turtleGlows[i % turtleGlows.length]}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "14px",
                      color: "var(--text-primary)",
                    }}
                  >
                    {mgr.fullName.split(" ").slice(0, 2).join(" ")}
                  </div>
                  <div
                    style={{ fontSize: "11px", color: "var(--text-secondary)" }}
                  >
                    {mgr.fullName.split(" ")[2] || ""}
                  </div>
                </div>
                <span
                  className={`badge ${mgr.position === "Главный специалист" ? "vip" : mgr.position === "Ведущий специалист" ? "info" : "neutral"}`}
                >
                  {mgr.position}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                }}
              >
                {mgr.skills.length > 0 ? (
                  mgr.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`badge ${skill === "VIP" ? "vip" : skill === "ENG" ? "info" : "warning"}`}
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span
                    style={{ fontSize: "11px", color: "var(--text-muted)" }}
                  >
                    Нет спец. навыков
                  </span>
                )}
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{ fontSize: "11px", color: "var(--text-secondary)" }}
                  >
                    Нагрузка
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: loadColor,
                    }}
                  >
                    {mgr.currentLoad} обращ. ({mgr._count?.assignments || 0}{" "}
                    назначений)
                  </span>
                </div>
                <div
                  style={{
                    height: "6px",
                    background: "var(--bg-surface)",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: loadColor,
                      borderRadius: "3px",
                      boxShadow: `0 0 10px ${loadColor}50`,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: "12px",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <OfficeIcon size={14} color="var(--text-muted)" />{" "}
                  {mgr.businessUnit?.name || "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {meta && meta.totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            padding: "24px 0",
          }}
        >
          <button
            className="btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            style={{ padding: "6px 14px", fontSize: "12px" }}
          >
            ← Назад
          </button>
          <span
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Стр. {meta.page} / {meta.totalPages}
          </span>
          <button
            className="btn"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            style={{ padding: "6px 14px", fontSize: "12px" }}
          >
            Далее →
          </button>
        </div>
      )}
    </div>
  );
}
