### 1. Суть и Задача Проекта

Разработка **мульти-лейбловой ERP-системы** для управления музыкальными активами. Система предназначена для автоматизации работы музыкального лейбла, сбора аналитики и управления правами доступа сотрудников.

**Ключевые бизнес-задачи:**

- **Мульти-арендность (Multi-tenancy):** Поддержка иерархии "Главный лейбл -> Саб-лейблы". Данные изолированы (менеджер саб-лейбла не видит данные головной компании, если не разрешено).
- **Каталогизация:** Хранение и управление базой артистов и музыкальных треков (метаданные, ISRC).
- **Аналитика:** Сбор и визуализация статистики из соцсетей (YouTube, TikTok, Instagram) по каждому треку.
- **RBAC (Role-Based Access Control):** Гибкая система ролей и прав доступа (Админ, A&R-менеджер, Бухгалтер, Артист).

### 2. Технический Стек (Technology Stack)

**1. Подготовка Репозитория (Structure)**

- Git: Инициализация (`git init`).
- Структура: Создание папок `/server` и `/client`.

**2. Бэкенд: Фундамент (Server Core)**

- NestJS: Генерация проекта (`nest new .` внутри `/server`).
- Config: `@nestjs/config` (для работы с .env).
- Context: `nestjs-cls` (КРИТИЧНО для Multi-tenancy: хранение ID лейбла/тенанта в контексте запроса).
- Validation: `class-validator`, `class-transformer`.
- Documentation: `@nestjs/swagger`, `swagger-ui-express`.

**3. Бэкенд: Данные (Server Data)**

- Prisma CLI: `prisma` (Dev-зависимость).
- Prisma Client: `@prisma/client`.
- Инициализация: `npx prisma init`.

**4. Бэкенд: Безопасность и Логика (Security & Logic)**

- Auth (Authentication): `@nestjs/passport`, `passport`, `@nestjs/jwt`, `passport-jwt` (Фундамент для входа в систему).
- Access Control (Authorization): `@casl/ability`, `@casl/prisma` (Валидация прав на основе ролей и тенантов).
- Queues: `@nestjs/bullmq`, `bullmq` (Redis для аналитики).
- Scheduler: `@nestjs/schedule`.

**5. Фронтенд: Фундамент (Client Core)**

- Vite: Генерация проекта (`npm create vite@latest .` внутри `/client` -> React + TypeScript).

**6. Фронтенд: Экосистема Refine (Client Logic)**

- Core: `@refinedev/core`.
- Forms: `@refinedev/react-hook-form`, `react-hook-form` (Для валидации форм на клиенте и связи с бэкендом).
- Networking: `axios`.
- Routing: `react-router-dom`, `@refinedev/react-router-v6`.

**7. Фронтенд: UI и Компоненты (Client UI)**

- Material UI: `@mui/material`, `@emotion/react`, `@emotion/styled`.
- Refine UI Adapter: `@refinedev/mui`.
- Data Grid: `@mui/x-data-grid` (Таблицы для каталога треков).

**8. Инфраструктура (DevOps)**

- Server Dockerfile: Сборка NestJS (Multi-stage).
- Client Dockerfile: Сборка Vite + Nginx.
- Docker Compose: Оркестрация (postgres, redis, server, client).


Данные подключения

REDIS_URL=redis://default:J%212P%21PK2Q%29%29TK%2A@147.45.243.52:6379/1
редис для приложения (будет использовать куб и приложение)

DATABASE_URL=postgresql://zero_app_user:eB063hJb0%40(%3F9%26@46ee4abb312f170816f24166.twc1.net:5432/zero_app?sslmode=verify-full
база данных для приложения

DATABASE_URL_WAREHOUSE=postgresql://dw_user:%23%3FNy%3COL61f_q*9@46ee4abb312f170816f24166.twc1.net:5432/data_warehouse?sslmode=verify-full
база данных транзакций (будет использовать куб)

DATABASE_URL_ANALYTICS=postgresql://gen_user:f2Zfr3IH%7B%26ELzK@46ee4abb312f170816f24166.twc1.net:5432/default_db?sslmode=verify-full
база данных аналитики (будет использовать куб)

Сертификат к базе данных Postgres
mkdir -p ~/.cloud-certs && \
curl -o ~/.cloud-certs/root.crt "https://st.timeweb.com/cloud-static/ca.crt" && \
chmod 0600 ~/.cloud-certs/root.crt