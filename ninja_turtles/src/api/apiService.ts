import type {
  PaginatedResponse,
  TicketWithRelations,
  TicketDetail,
  ManagerListItem,
  ManagerDetail,
  BusinessUnitListItem,
  BusinessUnitDetail,
  DashboardStats,
  ByTypeItem,
  ByTonalityItem,
  ByLanguageItem,
  ByOfficeItem,
  ByManagerItem,
  ByCityItem,
  BySegmentItem,
  ByPriorityItem,
  TypeByCityItem,
  ProcessResult,
  ImportResult,
  AssignmentDetail,
  AiQueryResponse,
  AnalyticsStats,
  AnalyticsReport,
} from "./types";

const API_BASE = "/api";

async function apiGet<T>(
  path: string,
  params?: Record<string, unknown>,
): Promise<T> {
  const url = new URL(`${window.location.origin}${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API Error: ${res.status}`);
  }
  return res.json();
}

async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API Error: ${res.status}`);
  }
  return res.json();
}

async function apiPatch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API Error: ${res.status}`);
  }
  return res.json();
}

export function getTickets(params?: {
  page?: number;
  limit?: number;
  status?: string;
  segment?: string;
}) {
  return apiGet<PaginatedResponse<TicketWithRelations>>(
    "/tickets",
    params as Record<string, unknown>,
  );
}

export function getTicketById(id: number) {
  return apiGet<TicketDetail>(`/tickets/${id}`);
}

export function updateTicketStatus(id: number, status: string) {
  return apiPatch<TicketWithRelations>(`/tickets/${id}`, { status });
}

export function getManagers(params?: {
  page?: number;
  limit?: number;
  businessUnitId?: number;
  position?: string;
}) {
  return apiGet<PaginatedResponse<ManagerListItem>>(
    "/managers",
    params as Record<string, unknown>,
  );
}

export function getManagerById(id: number) {
  return apiGet<ManagerDetail>(`/managers/${id}`);
}

export function getBusinessUnits() {
  return apiGet<BusinessUnitListItem[]>("/business-units");
}

export function getBusinessUnitById(id: number) {
  return apiGet<BusinessUnitDetail>(`/business-units/${id}`);
}

export function getDashboardStats() {
  return apiGet<DashboardStats>("/dashboard/stats");
}

export function getDashboardByType() {
  return apiGet<ByTypeItem[]>("/dashboard/by-type");
}

export function getDashboardByTonality() {
  return apiGet<ByTonalityItem[]>("/dashboard/by-tonality");
}

export function getDashboardByLanguage() {
  return apiGet<ByLanguageItem[]>("/dashboard/by-language");
}

export function getDashboardByOffice() {
  return apiGet<ByOfficeItem[]>("/dashboard/by-office");
}

export function getDashboardByManager() {
  return apiGet<ByManagerItem[]>("/dashboard/by-manager");
}

export function getDashboardByCity() {
  return apiGet<ByCityItem[]>("/dashboard/by-city");
}

export function getDashboardBySegment() {
  return apiGet<BySegmentItem[]>("/dashboard/by-segment");
}

export function getDashboardByPriority() {
  return apiGet<ByPriorityItem[]>("/dashboard/by-priority");
}

export function getDashboardTypeByCity() {
  return apiGet<TypeByCityItem[]>("/dashboard/type-by-city");
}

export function processRouting() {
  return apiPost<ProcessResult>("/routing/process");
}

export function getAssignments(params?: {
  page?: number;
  limit?: number;
  businessUnitId?: number;
  managerId?: number;
}) {
  return apiGet<PaginatedResponse<AssignmentDetail>>(
    "/routing/assignments",
    params as Record<string, unknown>,
  );
}

export async function importCSV(files: {
  tickets?: File;
  managers?: File;
  businessUnits?: File;
}): Promise<ImportResult> {
  const formData = new FormData();
  if (files.tickets) formData.append("tickets", files.tickets);
  if (files.managers) formData.append("managers", files.managers);
  if (files.businessUnits)
    formData.append("businessUnits", files.businessUnits);

  const res = await fetch(`${API_BASE}/import`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API Error: ${res.status}`);
  }
  return res.json();
}

export function importSeed() {
  return apiPost<ImportResult>("/import/seed");
}

export function askAssistant(question: string) {
  return apiPost<AiQueryResponse>("/assistant/query", { question });
}

export function getAnalyticsStats() {
  return apiGet<AnalyticsStats>("/analytics/stats");
}

export function getAnalyticsReport() {
  return apiGet<AnalyticsReport>("/analytics/report");
}
