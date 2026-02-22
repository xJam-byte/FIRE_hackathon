# 📡 FIRE Backend — API Reference для фронтенда

> **Base URL:** `http://localhost:3000/api`
>
> **Swagger UI:** `http://localhost:3000/api/docs`
>
> Все ответы в формате `application/json`. Все даты в формате ISO 8601.

---

## 📦 Модели данных (TypeScript интерфейсы)

```typescript
// ═══════════════════════════════════════════
// Основные модели
// ═══════════════════════════════════════════

interface BusinessUnit {
  id: number;
  name: string; // Название офиса: "Астана", "Алматы"
  address: string; // Адрес: "ул. Кунаева 2"
  latitude: number | null;
  longitude: number | null;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

interface Manager {
  id: number;
  fullName: string; // "Иванов Иван Иванович"
  position: string; // "Главный специалист" | "Ведущий специалист" | "Специалист"
  skills: string[]; // ["VIP", "ENG", "KZ"]
  currentLoad: number; // Текущее кол-во обращений в работе
  businessUnitId: number;
  createdAt: string;
  updatedAt: string;
}

interface Ticket {
  id: number;
  clientGuid: string; // GUID клиента
  gender: string | null; // "М" | "Ж" | null
  birthDate: string | null;
  segment: string; // "Mass" | "VIP" | "Priority"
  description: string; // Текст обращения
  attachments: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  street: string | null;
  house: string | null;
  status: string; // "new" | "analyzed" | "assigned"
  createdAt: string;
  updatedAt: string;
}

interface AiAnalysis {
  id: number;
  ticketId: number;
  type: string; // "Жалоба" | "Консультация" | "Претензия" | "Смена данных" |
  // "Неработоспособность приложения" | "Мошеннические действия" | "Спам"
  tonality: string; // "Позитивный" | "Нейтральный" | "Негативный"
  priority: number; // 1–10 (1 = наивысший)
  language: string; // "RU" | "KZ" | "ENG"
  summary: string; // Краткое содержание обращения
  latitude: number | null;
  longitude: number | null;
  createdAt: string;
  updatedAt: string;
}

interface Assignment {
  id: number;
  ticketId: number;
  managerId: number;
  businessUnitId: number;
  reason: string | null; // Причина назначения
  assignedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════
// Пагинация
// ═══════════════════════════════════════════

interface PaginationMeta {
  total: number; // Всего записей
  page: number; // Текущая страница (начиная с 1)
  limit: number; // Записей на страницу (по умолч. 20)
  totalPages: number; // Всего страниц
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
```

---

## 🎫 Обращения (Tickets)

### `GET /tickets` — Список обращений

**Query параметры:**

| Параметр  | Тип      | По умолч. | Описание                              |
| --------- | -------- | --------- | ------------------------------------- |
| `page`    | `number` | `1`       | Номер страницы                        |
| `limit`   | `number` | `20`      | Кол-во на страницу                    |
| `status`  | `string` | —         | Фильтр: `new`, `analyzed`, `assigned` |
| `segment` | `string` | —         | Фильтр: `Mass`, `VIP`, `Priority`     |

**Пример запроса:**

```
GET /api/tickets?page=1&limit=10&status=new
```

**Ответ:** `PaginatedResponse<TicketWithRelations>`

```typescript
interface TicketWithRelations extends Ticket {
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
```

```json
{
  "data": [
    {
      "id": 1,
      "clientGuid": "abc-123",
      "gender": "М",
      "birthDate": "1990-05-15T00:00:00.000Z",
      "segment": "VIP",
      "description": "Не могу войти в приложение",
      "attachments": null,
      "country": "Казахстан",
      "region": "Алматинская область",
      "city": "Алматы",
      "street": "ул. Абая",
      "house": "52",
      "status": "assigned",
      "createdAt": "2026-02-22T00:00:00.000Z",
      "updatedAt": "2026-02-22T00:00:00.000Z",
      "aiAnalysis": {
        "id": 1,
        "ticketId": 1,
        "type": "Неработоспособность приложения",
        "tonality": "Негативный",
        "priority": 2,
        "language": "RU",
        "summary": "Клиент не может авторизоваться...",
        "latitude": 43.238,
        "longitude": 76.945,
        "createdAt": "...",
        "updatedAt": "..."
      },
      "assignment": {
        "id": 1,
        "ticketId": 1,
        "managerId": 5,
        "businessUnitId": 2,
        "reason": "VIP-обращение, навык VIP, офис Алматы",
        "assignedAt": "...",
        "manager": { "id": 5, "fullName": "Сидоров С.С.", "...": "..." },
        "businessUnit": { "id": 2, "name": "Алматы", "...": "..." }
      }
    }
  ],
  "meta": {
    "total": 31,
    "page": 1,
    "limit": 10,
    "totalPages": 4
  }
}
```

---

### `GET /tickets/:id` — Детали обращения

**Ответ:** `TicketDetail`

```typescript
interface TicketDetail extends Ticket {
  aiAnalysis: AiAnalysis | null;
  assignment: {
    id: number;
    ticketId: number;
    managerId: number;
    businessUnitId: number;
    reason: string | null;
    assignedAt: string;
    manager: Manager & {
      businessUnit: BusinessUnit;
    };
    businessUnit: BusinessUnit;
  } | null;
}
```

---

### `PATCH /tickets/:id` — Обновить статус

**Request Body:**

```typescript
interface UpdateTicketDto {
  status?: string; // "new" | "analyzed" | "assigned"
}
```

**Пример:**

```json
{ "status": "analyzed" }
```

**Ответ:** обновлённый `TicketWithRelations`

---

## 👤 Менеджеры (Managers)

### `GET /managers` — Список менеджеров

**Query параметры:**

| Параметр         | Тип      | По умолч. | Описание            |
| ---------------- | -------- | --------- | ------------------- |
| `page`           | `number` | `1`       | Номер страницы      |
| `limit`          | `number` | `20`      | Кол-во на страницу  |
| `businessUnitId` | `number` | —         | Фильтр по ID офиса  |
| `position`       | `string` | —         | Фильтр по должности |

**Ответ:** `PaginatedResponse<ManagerListItem>`

```typescript
interface ManagerListItem extends Manager {
  businessUnit: BusinessUnit;
  _count: {
    assignments: number; // Кол-во назначенных обращений
  };
}
```

---

### `GET /managers/:id` — Детали менеджера

**Ответ:** `ManagerDetail`

```typescript
interface ManagerDetail extends Manager {
  businessUnit: BusinessUnit;
  assignments: Array<{
    id: number;
    ticketId: number;
    managerId: number;
    businessUnitId: number;
    reason: string | null;
    assignedAt: string;
    ticket: Ticket & {
      aiAnalysis: AiAnalysis | null;
    };
  }>; // Последние 50 назначений
}
```

---

## 🏢 Офисы (Business Units)

### `GET /business-units` — Список всех офисов

**Ответ:** `BusinessUnitListItem[]`

```typescript
interface BusinessUnitListItem extends BusinessUnit {
  _count: {
    managers: number; // Кол-во менеджеров в офисе
    assignments: number; // Кол-во назначений
  };
}
```

```json
[
  {
    "id": 1,
    "name": "Астана",
    "address": "ул. Кунаева 2",
    "latitude": null,
    "longitude": null,
    "createdAt": "...",
    "updatedAt": "...",
    "_count": { "managers": 5, "assignments": 12 }
  }
]
```

---

### `GET /business-units/:id` — Детали офиса

**Ответ:** `BusinessUnitDetail`

```typescript
interface BusinessUnitDetail extends BusinessUnit {
  managers: Manager[]; // Все менеджеры офиса (сортировка по currentLoad ↑)
  _count: {
    assignments: number;
  };
}
```

---

## 📊 Dashboard (Аналитика)

> Все эндпоинты без параметров — просто `GET` запросы.

### `GET /dashboard/stats` — Общая статистика

```typescript
interface DashboardStats {
  totalTickets: number;
  analyzedTickets: number;
  assignedTickets: number;
  pendingTickets: number; // totalTickets - assignedTickets
  totalManagers: number;
  totalBusinessUnits: number;
}
```

```json
{
  "totalTickets": 31,
  "analyzedTickets": 28,
  "assignedTickets": 25,
  "pendingTickets": 6,
  "totalManagers": 51,
  "totalBusinessUnits": 15
}
```

---

### `GET /dashboard/by-type` — По типам обращений

```typescript
type ByTypeResponse = Array<{
  type: string; // "Жалоба", "Консультация", "Претензия", ...
  count: number;
}>;
```

---

### `GET /dashboard/by-tonality` — По тональности

```typescript
type ByTonalityResponse = Array<{
  tonality: string; // "Позитивный" | "Нейтральный" | "Негативный"
  count: number;
}>;
```

---

### `GET /dashboard/by-language` — По языкам

```typescript
type ByLanguageResponse = Array<{
  language: string; // "RU" | "KZ" | "ENG"
  count: number;
}>;
```

---

### `GET /dashboard/by-office` — По офисам

```typescript
type ByOfficeResponse = Array<{
  id: number;
  name: string; // Название офиса
  address: string;
  managersCount: number; // Кол-во менеджеров
  assignmentsCount: number; // Кол-во назначений
  totalLoad: number; // Суммарная нагрузка менеджеров
}>;
```

---

### `GET /dashboard/by-manager` — Нагрузка менеджеров

```typescript
type ByManagerResponse = Array<{
  id: number;
  fullName: string;
  position: string;
  skills: string[];
  office: string; // Название офиса
  currentLoad: number;
  assignmentsCount: number;
}>;
```

---

### `GET /dashboard/by-city` — По городам

```typescript
type ByCityResponse = Array<{
  city: string;
  count: number;
}>;
// Сортировка: по убыванию count
```

---

### `GET /dashboard/by-segment` — По сегментам клиентов

```typescript
type BySegmentResponse = Array<{
  segment: string; // "Mass" | "VIP" | "Priority"
  count: number;
}>;
```

---

### `GET /dashboard/by-priority` — По приоритетам

```typescript
type ByPriorityResponse = Array<{
  priority: number; // 1–10
  count: number;
}>;
```

---

### `GET /dashboard/type-by-city` — Кросс-таблица: типы × города

```typescript
// Каждый объект = город + кол-во каждого типа
type TypeByCityResponse = Array<{
  city: string;
  [type: string]: string | number; // Динамические ключи: "Жалоба": 5, "Консультация": 3
}>;
```

```json
[
  { "city": "Алматы", "Жалоба": 5, "Консультация": 3, "Претензия": 1 },
  { "city": "Астана", "Жалоба": 2, "Смена данных": 4 }
]
```

---

## ⚙️ Маршрутизация (Routing)

### `POST /routing/process` — Запуск полного пайплайна

> ⚠️ Запускает AI-анализ + автоматическую маршрутизацию для ВСЕХ необработанных обращений. Может занять длительное время.

**Request Body:** отсутствует

**Ответ:**

```typescript
interface ProcessResult {
  total: number; // Всего обработано
  analyzed: number; // Проанализировано AI
  assigned: number; // Назначено менеджерам
  errors: number; // Ошибки
}
```

```json
{ "total": 31, "analyzed": 31, "assigned": 28, "errors": 3 }
```

---

### `GET /routing/assignments` — История назначений

**Query параметры:**

| Параметр         | Тип      | По умолч. | Описание               |
| ---------------- | -------- | --------- | ---------------------- |
| `page`           | `number` | `1`       | Номер страницы         |
| `limit`          | `number` | `20`      | Кол-во на страницу     |
| `businessUnitId` | `number` | —         | Фильтр по ID офиса     |
| `managerId`      | `number` | —         | Фильтр по ID менеджера |

**Ответ:** `PaginatedResponse<AssignmentDetail>`

```typescript
interface AssignmentDetail extends Assignment {
  ticket: Ticket & {
    aiAnalysis: AiAnalysis | null;
  };
  manager: Manager;
  businessUnit: BusinessUnit;
}
```

---

## 📥 Импорт CSV (Import)

### `POST /import` — Загрузка CSV файлов

**Content-Type:** `multipart/form-data`

**Form Fields:**

| Поле            | Тип    | Обязательное | Описание               |
| --------------- | ------ | ------------ | ---------------------- |
| `tickets`       | `file` | Нет          | CSV файл с обращениями |
| `managers`      | `file` | Нет          | CSV файл с менеджерами |
| `businessUnits` | `file` | Нет          | CSV файл с офисами     |

**Пример (JavaScript):**

```javascript
const formData = new FormData();
formData.append('tickets', ticketsFile);
formData.append('managers', managersFile);
formData.append('businessUnits', businessUnitsFile);

const response = await fetch('/api/import', {
  method: 'POST',
  body: formData,
});
```

**Ответ:**

```typescript
interface ImportResult {
  businessUnits: { imported: number };
  managers: { imported: number };
  tickets: { imported: number };
}
```

---

### `POST /import/seed` — Авто-импорт из файловой системы

> Импортирует CSV из папки `datasour/` на сервере. Не требует загрузки файлов.

**Request Body:** отсутствует

**Ответ:** `ImportResult`

---

## 🤖 AI-Ассистент (Assistant)

### `POST /assistant/query` — Вопрос на естественном языке

> Требует валидный `OPENAI_API_KEY` на сервере.

**Request Body:**

```typescript
interface AiQueryDto {
  question: string; // Вопрос на русском или английском
}
```

**Примеры вопросов:**

- `"Покажи распределение типов обращений по городам"`
- `"Сколько VIP обращений?"`
- `"Какой менеджер наиболее загружен?"`
- `"Какие обращения имеют негативную тональность?"`

**Ответ:**

```typescript
interface AiQueryResponse {
  answer: string; // Текстовый ответ на русском
  data: Record<string, any>[]; // Результат SQL-запроса
  sql: string; // Сгенерированный SQL (для отладки)
  chartType: string | null; // "bar" | "line" | "pie" | "table" | "doughnut" | null
  chartConfig: {
    xAxis: string; // Имя колонки для оси X
    yAxis: string; // Имя колонки для оси Y
    groupBy: string | null;
  } | null;
}
```

```json
{
  "answer": "Всего 8 VIP обращений. Большинство из Алматы (5).",
  "data": [
    { "city": "Алматы", "count": 5 },
    { "city": "Астана", "count": 3 }
  ],
  "sql": "SELECT city, COUNT(*) as count FROM tickets WHERE segment = 'VIP' GROUP BY city",
  "chartType": "bar",
  "chartConfig": {
    "xAxis": "city",
    "yAxis": "count",
    "groupBy": null
  }
}
```

---

## 🔗 Примеры использования (fetch)

### Базовый API-сервис

```typescript
const API_BASE = 'http://localhost:3000/api';

async function apiGet<T>(
  path: string,
  params?: Record<string, any>,
): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

async function apiPost<T>(path: string, body?: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

async function apiPatch<T>(path: string, body: any): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}
```

### Примеры вызовов

```typescript
// Получить обращения (страница 1, 10 штук, только VIP)
const tickets = await apiGet('/tickets', {
  page: 1,
  limit: 10,
  segment: 'VIP',
});

// Детали обращения
const ticket = await apiGet('/tickets/1');

// Обновить статус
const updated = await apiPatch('/tickets/1', { status: 'analyzed' });

// Менеджеры конкретного офиса
const managers = await apiGet('/managers', { businessUnitId: 2 });

// Все офисы
const offices = await apiGet('/business-units');

// Общая статистика
const stats = await apiGet('/dashboard/stats');

// Dashboard — все данные сразу
const [byType, byTonality, byCity, bySegment, byPriority, byOffice, byManager] =
  await Promise.all([
    apiGet('/dashboard/by-type'),
    apiGet('/dashboard/by-tonality'),
    apiGet('/dashboard/by-city'),
    apiGet('/dashboard/by-segment'),
    apiGet('/dashboard/by-priority'),
    apiGet('/dashboard/by-office'),
    apiGet('/dashboard/by-manager'),
  ]);

// Запуск обработки
const result = await apiPost('/routing/process');

// AI-вопрос
const aiResult = await apiPost('/assistant/query', {
  question: 'Сколько обращений по городам?',
});

// Загрузка CSV через FormData
const formData = new FormData();
formData.append('tickets', fileInput.files[0]);
const importResult = await fetch('/api/import', {
  method: 'POST',
  body: formData,
}).then((r) => r.json());
```

---

## ⚠️ Обработка ошибок

Все ошибки возвращаются в формате:

```typescript
interface ErrorResponse {
  statusCode: number; // HTTP код: 400, 404, 500
  message: string; // Текст ошибки
  error?: string; // Тип: "Bad Request", "Not Found", etc
}
```

| Код | Когда                                 |
| --- | ------------------------------------- |
| 400 | Невалидные параметры запроса          |
| 404 | Ресурс не найден (GET /:id)           |
| 500 | Ошибка сервера / нет подключения к БД |

---

## 🗺️ Enum-справочник значений

| Поле                  | Возможные значения                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `ticket.status`       | `new`, `analyzed`, `assigned`                                                                                             |
| `ticket.segment`      | `Mass`, `VIP`, `Priority`                                                                                                 |
| `ticket.gender`       | `М`, `Ж`                                                                                                                  |
| `aiAnalysis.type`     | `Жалоба`, `Консультация`, `Претензия`, `Смена данных`, `Неработоспособность приложения`, `Мошеннические действия`, `Спам` |
| `aiAnalysis.tonality` | `Позитивный`, `Нейтральный`, `Негативный`                                                                                 |
| `aiAnalysis.language` | `RU`, `KZ`, `ENG`                                                                                                         |
| `aiAnalysis.priority` | `1`–`10` (1 = наивысший)                                                                                                  |
| `manager.position`    | `Специалист`, `Ведущий специалист`, `Главный специалист`                                                                  |
| `manager.skills`      | `VIP`, `ENG`, `KZ`                                                                                                        |
