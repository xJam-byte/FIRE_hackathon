import { useState, useEffect, useCallback } from "react";
import { getTickets, getTicketById } from "../api/apiService";
import type {
  TicketWithRelations,
  TicketDetail,
  PaginationMeta,
} from "../api/types";
import {
  NinjaIcon,
  OfficeIcon,
  PizzaIcon,
  DnaIcon,
  StarIcon,
} from "../components/Icons";

const statusMap: Record<string, { label: string; cls: string }> = {
  new: { label: "Новое", cls: "warning" },
  analyzed: { label: "Проанализировано", cls: "info" },
  assigned: { label: "Назначено", cls: "positive" },
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<TicketWithRelations[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSegment, setFilterSegment] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<TicketDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTickets({
        page,
        limit,
        status: filterStatus || undefined,
        segment: filterSegment || undefined,
      });
      setTickets(result.data);
      setMeta(result.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterStatus, filterSegment]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  useEffect(() => {
    if (selectedTicketId === null) {
      setSelectedDetail(null);
      return;
    }
    setDetailLoading(true);
    getTicketById(selectedTicketId)
      .then(setSelectedDetail)
      .catch(() => setSelectedDetail(null))
      .finally(() => setDetailLoading(false));
  }, [selectedTicketId]);

  const handleFilterChange = (type: "status" | "segment", value: string) => {
    setPage(1);
    if (type === "status") setFilterStatus(value);
    else setFilterSegment(value);
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
        <button className="btn btn-primary" onClick={fetchTickets}>
          Повторить
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <select
          className="input"
          style={{ width: "auto", minWidth: "180px", cursor: "pointer" }}
          value={filterStatus}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">▸ Все статусы</option>
          <option value="new">Новое</option>
          <option value="analyzed">Проанализировано</option>
          <option value="assigned">Назначено</option>
        </select>

        <select
          className="input"
          style={{ width: "auto", minWidth: "160px", cursor: "pointer" }}
          value={filterSegment}
          onChange={(e) => handleFilterChange("segment", e.target.value)}
        >
          <option value="">▸ Все сегменты</option>
          <option value="Mass">Mass</option>
          <option value="VIP">VIP</option>
          <option value="Priority">Priority</option>
        </select>

        {meta && (
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "12px",
              color: "var(--text-secondary)",
              letterSpacing: "0.5px",
              marginLeft: "auto",
            }}
          >
            Всего: <span style={{ color: "var(--lime)" }}>{meta.total}</span> •
            Стр. {meta.page}/{meta.totalPages}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "24px" }}>
        <div
          className="glass-card"
          style={{ flex: 1, padding: "0", overflow: "hidden" }}
        >
          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "60px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "28px",
                    animation: "pulse 1.5s ease infinite",
                  }}
                >
                  🔥
                </div>
                <div
                  style={{
                    marginTop: "12px",
                    color: "var(--text-secondary)",
                    fontSize: "12px",
                  }}
                >
                  Загрузка...
                </div>
              </div>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Сегмент</th>
                    <th>Тип</th>
                    <th>Приоритет</th>
                    <th>Тональность</th>
                    <th>Язык</th>
                    <th>Город</th>
                    <th>Менеджер</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t, i) => {
                    const ai = t.aiAnalysis;
                    const st = statusMap[t.status] || {
                      label: t.status,
                      cls: "neutral",
                    };
                    return (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedTicketId(t.id)}
                        style={{
                          background:
                            selectedTicketId === t.id
                              ? "var(--lime-subtle)"
                              : undefined,
                          opacity: 0,
                          animation: `fadeIn 0.3s ease ${i * 0.03}s forwards`,
                        }}
                      >
                        <td
                          style={{
                            fontWeight: 700,
                            color: "var(--lime)",
                            fontSize: "12px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          #{t.id}
                        </td>
                        <td>
                          <span
                            className={`badge ${t.segment === "VIP" ? "vip" : t.segment === "Priority" ? "warning" : "neutral"}`}
                          >
                            {t.segment}
                          </span>
                        </td>
                        <td style={{ fontSize: "12px" }}>{ai?.type || "—"}</td>
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
                              <span
                                style={{
                                  width: "8px",
                                  height: "8px",
                                  borderRadius: "50%",
                                  background:
                                    ai.priority >= 8
                                      ? "#ff2d2d"
                                      : ai.priority >= 5
                                        ? "#ffa500"
                                        : "#39ff14",
                                  boxShadow: `0 0 6px ${ai.priority >= 8 ? "rgba(255,45,45,0.5)" : ai.priority >= 5 ? "rgba(255,165,0,0.5)" : "rgba(57,255,20,0.5)"}`,
                                }}
                              />
                              {ai.priority}
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
                          {ai?.language || "—"}
                        </td>
                        <td style={{ fontSize: "12px" }}>{t.city || "—"}</td>
                        <td style={{ fontSize: "12px" }}>
                          {t.assignment?.manager?.fullName || "—"}
                        </td>
                        <td>
                          <span className={`badge ${st.cls}`}>{st.label}</span>
                        </td>
                      </tr>
                    );
                  })}
                  {tickets.length === 0 && !loading && (
                    <tr>
                      <td
                        colSpan={9}
                        style={{
                          textAlign: "center",
                          padding: "40px",
                          color: "var(--text-muted)",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                          }}
                        >
                          <PizzaIcon size={24} /> Ничего не найдено. Попробуйте
                          изменить фильтры.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {meta && meta.totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                padding: "16px",
                borderTop: "1px solid var(--border-subtle)",
              }}
            >
              <button
                className="btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                style={{ padding: "6px 14px", fontSize: "12px" }}
              >
                ← Назад
              </button>
              {Array.from({ length: Math.min(meta.totalPages, 7) }, (_, i) => {
                let pageNum: number;
                if (meta.totalPages <= 7) {
                  pageNum = i + 1;
                } else if (page <= 4) {
                  pageNum = i + 1;
                } else if (page >= meta.totalPages - 3) {
                  pageNum = meta.totalPages - 6 + i;
                } else {
                  pageNum = page - 3 + i;
                }
                return (
                  <button
                    key={pageNum}
                    className="btn"
                    onClick={() => setPage(pageNum)}
                    style={{
                      padding: "6px 12px",
                      fontSize: "12px",
                      background: page === pageNum ? "var(--lime)" : undefined,
                      color: page === pageNum ? "#000" : undefined,
                      fontWeight: page === pageNum ? 700 : undefined,
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                className="btn"
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                style={{ padding: "6px 14px", fontSize: "12px" }}
              >
                Далее →
              </button>
            </div>
          )}
        </div>

        {selectedTicketId !== null && (
          <div
            className="glass-card"
            style={{
              width: "380px",
              padding: "24px",
              flexShrink: 0,
              animation: "slideUp 0.3s ease",
              alignSelf: "flex-start",
              position: "sticky",
              top: "calc(var(--header-height) + 32px)",
            }}
          >
            {detailLoading ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <div
                  style={{
                    fontSize: "24px",
                    animation: "pulse 1.5s ease infinite",
                  }}
                >
                  🔥
                </div>
              </div>
            ) : selectedDetail ? (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "14px",
                    }}
                  >
                    #{selectedDetail.id}
                  </h3>
                  <button
                    onClick={() => setSelectedTicketId(null)}
                    className="btn"
                    style={{ padding: "4px 8px", fontSize: "12px" }}
                  >
                    ✕
                  </button>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    className={`badge ${selectedDetail.segment === "VIP" ? "vip" : selectedDetail.segment === "Priority" ? "warning" : "neutral"}`}
                  >
                    {selectedDetail.segment}
                  </span>
                  {selectedDetail.aiAnalysis && (
                    <span
                      className={`badge ${selectedDetail.aiAnalysis.tonality === "Позитивный" ? "positive" : selectedDetail.aiAnalysis.tonality === "Негативный" ? "negative" : "neutral"}`}
                    >
                      {selectedDetail.aiAnalysis.tonality}
                    </span>
                  )}
                  <span
                    className={`badge ${(statusMap[selectedDetail.status] || { cls: "neutral" }).cls}`}
                  >
                    {
                      (
                        statusMap[selectedDetail.status] || {
                          label: selectedDetail.status,
                        }
                      ).label
                    }
                  </span>
                </div>

                <div
                  style={{
                    background: "var(--bg-elevated)",
                    borderRadius: "var(--radius-md)",
                    padding: "14px",
                    marginBottom: "14px",
                    borderLeft: "3px solid var(--lime)",
                    fontSize: "12px",
                    lineHeight: 1.6,
                  }}
                >
                  {selectedDetail.description}
                </div>

                {selectedDetail.aiAnalysis && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div>
                      <strong style={{ color: "var(--aurora-purple)" }}>
                        Тип:
                      </strong>{" "}
                      {selectedDetail.aiAnalysis.type}
                    </div>
                    <div>
                      <strong style={{ color: "var(--fn-blue)" }}>Язык:</strong>{" "}
                      {selectedDetail.aiAnalysis.language}
                    </div>
                    <div>
                      <strong style={{ color: "var(--fn-orange)" }}>
                        Приоритет:
                      </strong>{" "}
                      {selectedDetail.aiAnalysis.priority}/10
                    </div>
                    <div
                      style={{
                        marginTop: "8px",
                        padding: "10px",
                        background: "var(--bg-surface)",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "10px",
                          color: "var(--lime)",
                          marginBottom: "4px",
                          fontFamily: "'Space Grotesk', sans-serif",
                          letterSpacing: "1px",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <StarIcon
                          size={12}
                          color="#39ff14"
                          glow="rgba(57,255,20,0.3)"
                        />{" "}
                        SUMMARY
                      </div>
                      {selectedDetail.aiAnalysis.summary}
                    </div>
                  </div>
                )}

                <div
                  style={{
                    marginTop: "12px",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {selectedDetail.assignment && (
                    <>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <NinjaIcon size={14} />{" "}
                        {selectedDetail.assignment.manager?.fullName} •{" "}
                        {selectedDetail.assignment.businessUnit?.name}
                      </span>
                      {selectedDetail.assignment.reason && (
                        <div
                          style={{
                            padding: "8px 10px",
                            background: "var(--bg-surface)",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--border-subtle)",
                            fontSize: "11px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "10px",
                              color: "var(--fn-orange)",
                              marginBottom: "2px",
                              fontFamily: "'Space Grotesk', sans-serif",
                              letterSpacing: "1px",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <DnaIcon
                              size={12}
                              color="var(--fn-orange)"
                              glow="rgba(255,106,0,0.3)"
                            />{" "}
                            ПРИЧИНА
                          </div>
                          {selectedDetail.assignment.reason}
                        </div>
                      )}
                    </>
                  )}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <OfficeIcon size={14} />{" "}
                    {[
                      selectedDetail.city,
                      selectedDetail.street,
                      selectedDetail.house,
                    ]
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </span>
                </div>
              </>
            ) : (
              <div
                style={{
                  textAlign: "center",
                  padding: "40px",
                  color: "var(--text-muted)",
                }}
              >
                Не удалось загрузить
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
