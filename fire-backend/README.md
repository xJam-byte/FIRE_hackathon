# 🔥 FIRE Backend — Freedom Intelligent Routing Engine

Автоматическая система обработки и маршрутизации клиентских обращений с AI-анализом.

---

## 📋 Требования

- **Node.js** >= 18
- **Docker Desktop** (для PostgreSQL)
- **npm** >= 9

---

## 🚀 Быстрый старт (пошагово)

### 1. Установка зависимостей

```bash
cd fire-backend
npm install
```

### 2. Запуск PostgreSQL через Docker

Убедитесь, что **Docker Desktop запущен**, затем:

```bash
docker compose up -d
```

Это поднимет PostgreSQL на порту **5433** с параметрами:

- База: `fire_db`
- Пользователь: `postgres`
- Пароль: `root`

Проверить, что контейнер работает:

```bash
docker ps
```

Вы должны увидеть контейнер `fire-postgres` со статусом `Up`.

### 3. Создание таблиц в БД

```bash
docker exec fire-postgres psql -U postgres -d fire_db -c "
CREATE TABLE IF NOT EXISTS business_units (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS managers (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  position TEXT NOT NULL DEFAULT '',
  skills TEXT[] NOT NULL DEFAULT '{}',
  current_load INTEGER NOT NULL DEFAULT 0,
  business_unit_id INTEGER NOT NULL REFERENCES business_units(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tickets (
  id SERIAL PRIMARY KEY,
  client_guid TEXT NOT NULL DEFAULT '',
  gender TEXT,
  birth_date TIMESTAMPTZ,
  segment TEXT NOT NULL DEFAULT 'Mass',
  description TEXT NOT NULL DEFAULT '',
  attachments TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  street TEXT,
  house TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_analyses (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL UNIQUE REFERENCES tickets(id),
  type TEXT NOT NULL DEFAULT '',
  tonality TEXT NOT NULL DEFAULT '',
  priority INTEGER NOT NULL DEFAULT 5,
  language TEXT NOT NULL DEFAULT 'RU',
  summary TEXT NOT NULL DEFAULT '',
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assignments (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER NOT NULL UNIQUE REFERENCES tickets(id),
  manager_id INTEGER NOT NULL REFERENCES managers(id),
  business_unit_id INTEGER NOT NULL REFERENCES business_units(id),
  reason TEXT NOT NULL DEFAULT '',
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
"
```

Должно вывести `CREATE TABLE` 5 раз.

### 4. Генерация Prisma Client

```bash
npx prisma generate
```

### 5. Загрузка данных из CSV (seed)

CSV-файлы (`business_units.csv`, `managers.csv`, `tickets.csv`) должны лежать в папке `datasour/` (на уровень выше `fire-backend/`).

```bash
npx ts-node prisma/seed.ts
```

Ожидаемый вывод:

```
Starting seed...
Cleared existing data
Imported 15 business units
Imported 51 managers
Imported 31 tickets
Seed completed!
```

### 6. Настройка переменных окружения

Отредактируйте файл `.env` в корне `fire-backend/`:

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5433/fire_db?schema=public&connect_timeout=30"
OPENAI_API_KEY="sk-ваш-ключ"          # Замените на реальный ключ OpenAI
OPENAI_BASE_URL="https://api.openai.com/v1"
OPENAI_MODEL="gpt-4o-mini"
NOMINATIM_URL="https://nominatim.openstreetmap.org"
PORT=3000
```

> ⚠️ **Важно:** Без валидного `OPENAI_API_KEY` AI-анализ и маршрутизация работать не будут. Остальные эндпоинты (CRUD, Dashboard) работают без ключа.

### 7. Запуск приложения

**Режим разработки (с hot-reload):**

```bash
npm run start:dev
```

**Продакшн-сборка:**

```bash
npm run build
npm run start:prod
```

После запуска вы увидите:

```
🔥 FIRE API is running on http://localhost:3000
📚 Swagger docs: http://localhost:3000/api/docs
```

---

## 📖 Swagger UI (документация API)

Откройте в браузере:

```
http://localhost:3000/api/docs
```

Здесь можно интерактивно тестировать все эндпоинты.

---

## 🔌 Основные API-эндпоинты

| Метод  | URL                           | Описание                                      |
| ------ | ----------------------------- | --------------------------------------------- |
| `POST` | `/api/import`                 | Загрузка CSV файлов (multipart/form-data)     |
| `POST` | `/api/import/seed`            | Авто-импорт CSV из папки `datasour/`          |
| `GET`  | `/api/tickets`                | Все обращения (пагинация, фильтры)            |
| `GET`  | `/api/tickets/:id`            | Детали обращения + AI-анализ + назначение     |
| `GET`  | `/api/managers`               | Все менеджеры                                 |
| `GET`  | `/api/managers/:id`           | Детали менеджера + назначения                 |
| `GET`  | `/api/business-units`         | Все офисы                                     |
| `GET`  | `/api/business-units/:id`     | Детали офиса + менеджеры                      |
| `POST` | `/api/routing/process`        | Запуск полного пайплайна (AI + маршрутизация) |
| `GET`  | `/api/routing/assignments`    | История назначений                            |
| `GET`  | `/api/dashboard/stats`        | Общая статистика                              |
| `GET`  | `/api/dashboard/by-type`      | Распределение по типам                        |
| `GET`  | `/api/dashboard/by-tonality`  | Распределение по тональности                  |
| `GET`  | `/api/dashboard/by-office`    | Распределение по офисам                       |
| `GET`  | `/api/dashboard/by-manager`   | Нагрузка менеджеров                           |
| `GET`  | `/api/dashboard/by-city`      | Распределение по городам                      |
| `GET`  | `/api/dashboard/by-segment`   | Распределение по сегментам                    |
| `GET`  | `/api/dashboard/by-priority`  | Распределение по приоритетам                  |
| `GET`  | `/api/dashboard/type-by-city` | Кросс-таблица тип × город                     |
| `POST` | `/api/assistant/query`        | AI-ассистент (вопросы на естественном языке)  |

---

## 🧪 Полный цикл обработки обращений

После загрузки данных и настройки `OPENAI_API_KEY`:

```bash
# 1. Запустить полный пайплайн (AI-анализ + маршрутизация)
curl -X POST http://localhost:3000/api/routing/process

# 2. Посмотреть результаты назначений
curl http://localhost:3000/api/routing/assignments

# 3. Посмотреть статистику
curl http://localhost:3000/api/dashboard/stats
```

Или используйте Swagger UI: `http://localhost:3000/api/docs`

---

## 🛠️ Полезные команды

| Команда                      | Описание                       |
| ---------------------------- | ------------------------------ |
| `npm run start:dev`          | Запуск в режиме разработки     |
| `npm run build`              | Сборка проекта                 |
| `npm run start:prod`         | Запуск продакшн-сборки         |
| `npx prisma generate`        | Перегенерация Prisma Client    |
| `npx prisma studio`          | Визуальный редактор БД (GUI)   |
| `npx ts-node prisma/seed.ts` | Повторная загрузка CSV данных  |
| `docker compose up -d`       | Запуск PostgreSQL              |
| `docker compose down`        | Остановка PostgreSQL           |
| `docker compose down -v`     | Остановка + удаление данных БД |

---

## 🔄 Перезапуск с нуля

Если нужно полностью пересоздать БД и данные:

```bash
# 1. Остановить и удалить контейнер с данными
docker compose down -v

# 2. Запустить заново
docker compose up -d

# 3. Подождать 5 секунд, пока БД инициализируется
timeout 5

# 4. Создать таблицы (SQL из шага 3 выше)
docker exec fire-postgres psql -U postgres -d fire_db -c "CREATE TABLE IF NOT EXISTS ..."

# 5. Загрузить данные
npx ts-node prisma/seed.ts

# 6. Запустить приложение
npm run start:dev
```

---

## 📁 Структура проекта

```
fire-backend/
├── prisma/
│   ├── schema.prisma          # Схема базы данных (5 моделей)
│   └── seed.ts                # Скрипт загрузки CSV данных
├── prisma.config.ts           # Конфигурация Prisma 7.x
├── docker-compose.yml         # PostgreSQL контейнер
├── .env                       # Переменные окружения
└── src/
    ├── main.ts                # Точка входа + Swagger
    ├── app.module.ts          # Корневой модуль
    ├── prisma/                # Сервис подключения к БД
    ├── csv-import/            # Импорт CSV (POST /api/import)
    ├── ai-analysis/           # AI-анализ обращений (OpenAI)
    ├── routing/               # Маршрутизация (бизнес-правила)
    ├── tickets/               # CRUD обращений
    ├── managers/              # CRUD менеджеров
    ├── business-units/        # CRUD офисов
    ├── dashboard/             # Аналитика (10 эндпоинтов)
    └── ai-assistant/          # AI-ассистент (NL → SQL)
```
