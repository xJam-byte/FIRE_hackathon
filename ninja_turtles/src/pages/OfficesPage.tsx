import { useState, useEffect } from "react";
import { getBusinessUnits, getBusinessUnitById } from "../api/apiService";
import type {
  BusinessUnitListItem,
  BusinessUnitDetail,
  Manager,
} from "../api/types";
import {
  MountainIcon,
  CityIcon,
  PeopleIcon,
  TicketIcon,
  TrendUpIcon,
  NinjaIcon,
} from "../components/Icons";

export default function OfficesPage() {
  const [offices, setOffices] = useState<BusinessUnitListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOffice, setSelectedOffice] =
    useState<BusinessUnitDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchOffices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBusinessUnits();
      setOffices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  const handleSelectOffice = async (id: number) => {
    if (selectedOffice?.id === id) {
      setSelectedOffice(null);
      return;
    }
    setDetailLoading(true);
    try {
      const detail = await getBusinessUnitById(id);
      setSelectedOffice(detail);
    } catch {
      setSelectedOffice(null);
    } finally {
      setDetailLoading(false);
    }
  };

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
        <button className="btn btn-primary" onClick={fetchOffices}>
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
            Загрузка офисов...
          </div>
        </div>
      </div>
    );
  }

  const officeIcons = [MountainIcon, CityIcon];

  return (
    <div>
      <div
        className="grid-offices"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: "24px",
          marginBottom: "32px",
        }}
      >
        {offices.map((office, i) => {
          const isSelected = selectedOffice?.id === office.id;
          const Icon = officeIcons[i % officeIcons.length];
          const totalLoad =
            selectedOffice?.id === office.id
              ? selectedOffice.managers.reduce(
                  (s: number, m: Manager) => s + m.currentLoad,
                  0,
                )
              : 0;

          return (
            <div
              key={office.id}
              className="glass-card"
              style={{
                padding: "28px",
                opacity: 0,
                animation: `slideUp 0.5s ease ${i * 0.15}s forwards`,
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                borderColor: isSelected ? "var(--lime)" : undefined,
              }}
              onClick={() => handleSelectOffice(office.id)}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background:
                    i % 2 === 0 ? "var(--fn-blue)" : "var(--fn-orange)",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "18px",
                      letterSpacing: "1px",
                      marginBottom: "4px",
                    }}
                  >
                    {office.name}
                  </h3>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--text-secondary)"
                      strokeWidth="2"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                      <circle cx="12" cy="9" r="2.5" />
                    </svg>
                    {office.address}
                  </div>
                </div>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={28} />
                </span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "16px",
                  marginBottom: "20px",
                }}
              >
                {[
                  {
                    l: "Менеджеры",
                    v: office._count.managers,
                    IconComp: PeopleIcon,
                  },
                  {
                    l: "Назначения",
                    v: office._count.assignments,
                    IconComp: TicketIcon,
                  },
                ].map((s, j) => (
                  <div
                    key={j}
                    style={{
                      background: "var(--bg-elevated)",
                      borderRadius: "var(--radius-md)",
                      padding: "14px",
                      textAlign: "center",
                      border: "1px solid var(--border-subtle)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginBottom: "4px",
                      }}
                    >
                      <s.IconComp size={20} />
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: 700 }}>
                      {s.v}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--text-muted)",
                        fontFamily: "'Space Grotesk', sans-serif",
                        marginTop: "2px",
                      }}
                    >
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>

              {isSelected && selectedOffice && (
                <div style={{ animation: "slideUp 0.3s ease" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Общая нагрузка
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 700 }}>
                      {totalLoad} обращений
                    </span>
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        fontFamily: "'Space Grotesk', sans-serif",
                        letterSpacing: "1px",
                        marginBottom: "10px",
                      }}
                    >
                      МЕНЕДЖЕРЫ
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {selectedOffice.managers.map((m) => (
                        <div
                          key={m.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "8px 12px",
                            background: "var(--bg-surface)",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--border-subtle)",
                            fontSize: "12px",
                          }}
                        >
                          <span
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <NinjaIcon
                              size={18}
                              color={
                                m.position === "Главный специалист"
                                  ? "var(--fn-amber)"
                                  : "var(--text-secondary)"
                              }
                            />
                          </span>
                          <span style={{ flex: 1 }}>
                            {m.fullName.split(" ").slice(0, 2).join(" ")}
                          </span>
                          <span
                            className={`badge ${m.position === "Главный специалист" ? "vip" : "neutral"}`}
                            style={{ fontSize: "9px" }}
                          >
                            {m.position}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              color:
                                m.currentLoad >= 8
                                  ? "var(--fn-red)"
                                  : "var(--text-secondary)",
                              fontWeight: 700,
                            }}
                          >
                            {m.currentLoad}
                          </span>
                        </div>
                      ))}
                      {selectedOffice.managers.length === 0 && (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "16px",
                            color: "var(--text-muted)",
                            fontSize: "12px",
                          }}
                        >
                          Нет менеджеров
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {isSelected && detailLoading && (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <div
                    style={{
                      fontSize: "20px",
                      animation: "pulse 1.5s ease infinite",
                    }}
                  >
                    🔥
                  </div>
                </div>
              )}

              {office.latitude && office.longitude && (
                <div
                  style={{
                    marginTop: "16px",
                    fontSize: "10px",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--text-muted)"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20M12 2a15.3 15.3 0 010 20 15.3 15.3 0 010-20z" />
                  </svg>
                  {office.latitude.toFixed(4)}, {office.longitude.toFixed(4)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="glass-card" style={{ padding: "28px" }}>
        <h3
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "14px",
            letterSpacing: "1px",
            marginBottom: "16px",
          }}
        >
          Каскад фильтров распределения
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            {
              s: "1",
              t: "Географический фильтр",
              d: "Поиск ближайшего к клиенту офиса. Неизвестный адрес / зарубеж → 50/50.",
              c: "var(--fn-blue)",
            },
            {
              s: "2",
              t: "Фильтр компетенций",
              d: "VIP/Priority → навык VIP. Смена данных → Глав спец. KZ/ENG → навык.",
              c: "var(--aurora-purple)",
            },
            {
              s: "3",
              t: "Round Robin",
              d: "Два менеджера с наименьшей нагрузкой → поочередное распределение.",
              c: "var(--lime)",
            },
          ].map((r) => (
            <div
              key={r.s}
              style={{
                display: "flex",
                gap: "16px",
                padding: "16px",
                background: "var(--bg-elevated)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                borderLeft: `3px solid ${r.c}`,
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "var(--bg-surface)",
                  border: `2px solid ${r.c}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "14px",
                  color: r.c,
                  flexShrink: 0,
                }}
              >
                {r.s}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "13px",
                    marginBottom: "4px",
                  }}
                >
                  {r.t}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {r.d}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
