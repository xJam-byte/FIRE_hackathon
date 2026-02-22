export interface BusinessUnit {
  id: number;
  name: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Manager {
  id: number;
  fullName: string;
  position: string;
  skills: string[];
  currentLoad: number;
  businessUnitId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: number;
  clientGuid: string;
  gender: string | null;
  birthDate: string | null;
  segment: string;
  description: string;
  attachments: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  street: string | null;
  house: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiAnalysis {
  id: number;
  ticketId: number;
  type: string;
  tonality: string;
  priority: number;
  language: string;
  summary: string;
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  id: number;
  ticketId: number;
  managerId: number;
  businessUnitId: number;
  reason: string | null;
  assignedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface TicketWithRelations extends Ticket {
  aiAnalysis: AiAnalysis | null;
  assignment: {
    id: number;
    ticketId: number;
    managerId: number;
    businessUnitId: number;
    reason: string | null;
    assignedAt: string;
    manager: Manager;
    businessUnit: BusinessUnit;
  } | null;
}

export interface TicketDetail extends Ticket {
  aiAnalysis: AiAnalysis | null;
  assignment: {
    id: number;
    ticketId: number;
    managerId: number;
    businessUnitId: number;
    reason: string | null;
    assignedAt: string;
    manager: Manager & { businessUnit: BusinessUnit };
    businessUnit: BusinessUnit;
  } | null;
}

export interface ManagerListItem extends Manager {
  businessUnit: BusinessUnit;
  _count: {
    assignments: number;
  };
}

export interface ManagerDetail extends Manager {
  businessUnit: BusinessUnit;
  assignments: Array<{
    id: number;
    ticketId: number;
    managerId: number;
    businessUnitId: number;
    reason: string | null;
    assignedAt: string;
    ticket: Ticket & { aiAnalysis: AiAnalysis | null };
  }>;
}

export interface BusinessUnitListItem extends BusinessUnit {
  _count: {
    managers: number;
    assignments: number;
  };
}

export interface BusinessUnitDetail extends BusinessUnit {
  managers: Manager[];
  _count: {
    assignments: number;
  };
}

export interface DashboardStats {
  totalTickets: number;
  analyzedTickets: number;
  assignedTickets: number;
  pendingTickets: number;
  totalManagers: number;
  totalBusinessUnits: number;
}

export interface ByTypeItem {
  type: string;
  count: number;
}

export interface ByTonalityItem {
  tonality: string;
  count: number;
}

export interface ByLanguageItem {
  language: string;
  count: number;
}

export interface ByOfficeItem {
  id: number;
  name: string;
  address: string;
  managersCount: number;
  assignmentsCount: number;
  totalLoad: number;
}

export interface ByManagerItem {
  id: number;
  fullName: string;
  position: string;
  skills: string[];
  office: string;
  currentLoad: number;
  assignmentsCount: number;
}

export interface ByCityItem {
  city: string;
  count: number;
}

export interface BySegmentItem {
  segment: string;
  count: number;
}

export interface ByPriorityItem {
  priority: number;
  count: number;
}

export interface TypeByCityItem {
  city: string;
  [type: string]: string | number;
}

export interface ProcessResult {
  total: number;
  analyzed: number;
  assigned: number;
  errors: number;
}

export interface ImportResult {
  businessUnits: { imported: number };
  managers: { imported: number };
  tickets: { imported: number };
}

export interface AssignmentDetail extends Assignment {
  ticket: Ticket & { aiAnalysis: AiAnalysis | null };
  manager: Manager;
  businessUnit: BusinessUnit;
}

export interface AiQueryResponse {
  answer: string;
  data: Record<string, unknown>[];
  sql: string;
  chartType: string | null;
  chartConfig: {
    xAxis: string;
    yAxis: string;
    groupBy: string | null;
  } | null;
}

export interface AnalyticsTopProblem {
  type: string;
  count: number;
  percentage: number;
}

export interface AnalyticsTonality {
  tonality: string;
  count: number;
  percentage: number;
}

export interface AnalyticsPriority {
  priority: number;
  count: number;
}

export interface AnalyticsSegment {
  segment: string;
  count: number;
  percentage: number;
}

export interface AnalyticsLanguage {
  language: string;
  count: number;
}

export interface AnalyticsCity {
  city: string;
  count: number;
}

export interface AnalyticsManagerLoad {
  id: number;
  fullName: string;
  position: string;
  skills: string[];
  office: string;
  currentLoad: number;
  assignmentsCount: number;
}

export interface AnalyticsOfficeLoad {
  id: number;
  name: string;
  address: string;
  managersCount: number;
  assignmentsCount: number;
  totalLoad: number;
}

export interface AnalyticsRecentTrends {
  avgPriority: number;
  negativePercentage: number;
  totalRecent: number;
}

export interface AnalyticsStats {
  overallStats: DashboardStats;
  topProblems: AnalyticsTopProblem[];
  tonalityBreakdown: AnalyticsTonality[];
  priorityBreakdown: AnalyticsPriority[];
  segmentBreakdown: AnalyticsSegment[];
  languageBreakdown: AnalyticsLanguage[];
  cityBreakdown: AnalyticsCity[];
  managerLoad: AnalyticsManagerLoad[];
  officeLoad: AnalyticsOfficeLoad[];
  recentTrends: AnalyticsRecentTrends;
  highPriorityTickets: TicketWithRelations[];
}

export interface AiRecommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  category: string;
}

export interface AiRisk {
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
}

export interface AiKpi {
  name: string;
  value: string;
  target: string;
  status: "good" | "warning" | "critical";
}

export interface AiReport {
  summary: string;
  recommendations: AiRecommendation[];
  risks: AiRisk[];
  kpis: AiKpi[];
}

export interface AnalyticsReport extends AnalyticsStats {
  aiReport: AiReport;
}
