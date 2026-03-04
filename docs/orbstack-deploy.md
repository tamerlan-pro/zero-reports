# Local Server Deployment Guide for AI Agents

> **ВАЖНО ДЛЯ AI АГЕНТОВ**: Этот документ содержит пошаговые инструкции для деплоя на ЛОКАЛЬНЫЙ СЕРВЕР (OrbStack VM).
> Выполняйте команды ПОСЛЕДОВАТЕЛЬНО. НЕ пропускайте шаги. ПРОВЕРЯЙТЕ результат каждого шага.

---

## КОНСТАНТЫ (используй эти значения буквально)

```
SSH_HOST = zero-reports.orb.local
SSH_USER = tamerlan
SSH_PASSWORD = Zool333el
APP_DIR_ON_SERVER = /home/tamerlan/zero-reports
APP_URL = http://zero-reports.orb.local
HEALTH_ENDPOINT = http://zero-reports.orb.local/api/health
LOCAL_PROJECT_PATH = /Volumes/Thunderlan/Yandex Drive/Yandex.Disk.localized/0to8/backend/zero-reports/zero-reports
```

OrbStack VM — Ubuntu внутри OrbStack на рабочем Mac.

**Сетевые особенности OrbStack:**
- **SSH** → используй `zero-reports.orb.local` (резолвится через `/etc/hosts` → `192.168.139.116`)
- **HTTP (curl, браузер)** → используй `zero-reports.orb.local`
- **Внутри VM** → OrbStack CLI: `orb run -m zero-reports <command>` (рекомендуется, не требует пароля)

**ВАЖНО — Сетевой fix (bridge subnet):**
OrbStack's DHCP назначает VM IP в подсети `192.168.139.0/24`, но bridge100 на macOS — в `192.168.128.0/24`.
Из-за этого VM недоступна с macOS по умолчанию. Применены два постоянных исправления:
1. **На macOS**: LaunchDaemon `com.orbstack.route-fix` добавляет маршрут `192.168.139.0/24 → bridge100` при загрузке
2. **На macOS**: запись в `/etc/hosts`: `192.168.139.116  zero-reports.orb.local`
3. **На VM**: systemd-сервис `bridge-ip.service` добавляет обратный маршрут `192.168.128.0/24 dev eth0`

Если после перезагрузки macOS или OrbStack сеть снова недоступна — см. TROUBLESHOOTING → "Сеть OrbStack не работает".

**ВАЖНО: SSH через `sshpass` может зависать на этой VM. Используй `orb run -m zero-reports` для выполнения команд.**

---

## АРХИТЕКТУРА ЛОКАЛЬНОГО СЕРВЕРА

```
OrbStack VM "zero-reports" — Ubuntu 25.10, Docker 29.x

/home/tamerlan/
└── zero-reports/                    ← ZeroReports (этот проект)
    ├── docker-compose.dev.yml       ← postgres, server, client
    ├── docker-compose.yml           ← production (без postgres)
    ├── server/                      ← NestJS API
    │   ├── Dockerfile
    │   ├── docker-entrypoint.sh     ← миграции + запуск
    │   └── prisma/                  ← схема и миграции БД
    ├── client/                      ← React + Vite + MUI
    │   ├── Dockerfile
    │   └── nginx.conf               ← reverse proxy /api/ → server
    ├── reports/                     ← примеры отчетов (JSON)
    └── .env                         ← конфигурация
```

**Сервисы (3 контейнера):**
- `postgres` — PostgreSQL 16 Alpine (локальная БД)
- `server` — NestJS backend (порт 3000 внутри), Prisma ORM
- `client` — React SPA (статика через Nginx, порт 80), reverse proxy для API

---

## ВЫБОР ТИПА ДЕПЛОЯ

**Прочитай это ПЕРЕД началом деплоя:**

| Если изменения в... | Тип деплоя | Перейди к секции |
|---------------------|------------|------------------|
| `client/` (любые файлы) | Полный деплой | СЕКЦИЯ B |
| `server/` (любые файлы) | Полный деплой | СЕКЦИЯ B |
| `client/` И `server/` | Полный деплой | СЕКЦИЯ B |
| Только `.env` или `docker-compose` | Рестарт | СЕКЦИЯ C |
| Не уверен | Полный деплой | СЕКЦИЯ B |

---

## СЕКЦИЯ A: СИНХРОНИЗАЦИЯ ФАЙЛОВ (используется во всех деплоях)

### Шаг A1: Создание архива проекта

**Команда (выполнить с macOS):**
```bash
cd "/Volumes/Thunderlan/Yandex Drive/Yandex.Disk.localized/0to8/backend/zero-reports/zero-reports" && \
tar czf /tmp/zero-reports-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='dist' \
  --exclude='coverage' \
  .
```

**Ожидаемый результат:** Файл `/tmp/zero-reports-deploy.tar.gz` создан (~170 KB)

---

### Шаг A2: Распаковка на VM

**Команда:**
```bash
orb run -m zero-reports bash -c '
  rm -rf /home/tamerlan/zero-reports/*
  cp /mnt/mac/tmp/zero-reports-deploy.tar.gz /tmp/zr.tar.gz
  cd /home/tamerlan/zero-reports
  tar xzf /tmp/zr.tar.gz 2>/dev/null
  rm /tmp/zr.tar.gz
  echo "Files: $(find . -type f | wc -l)"
'
```

**Требуемые permissions:** `all`

**Ожидаемый результат:** `Files: 70+`

**Если ошибка:** Убедись что VM запущена: `orb list`. Если `zero-reports` в статусе `stopped` — запусти: `orb start zero-reports`.

---

### Шаг A3: Создание .env

**Команда:**
```bash
orb run -m zero-reports bash -c '
  cat > /home/tamerlan/zero-reports/.env << "ENVEOF"
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://zeroreports:zeroreports_secret@postgres:5432/zeroreports
VITE_API_URL=/api
ENVEOF
  echo ".env created"
'
```

**Требуемые permissions:** `all`

---

## СЕКЦИЯ B: ПОЛНЫЙ ДЕПЛОЙ

### Шаг B1: Синхронизация файлов

Выполни **Шаги A1, A2, A3** из Секции A.

---

### Шаг B2: Сборка и запуск

**Команда:**
```bash
orb run -m zero-reports bash -c '
  cd /home/tamerlan/zero-reports
  docker compose -f docker-compose.dev.yml up --build -d 2>&1
'
```

**Требуемые permissions:** `all`

**Таймаут:** `block_until_ms: 600000` (10 минут, первая сборка ~2 мин, повторные ~30 сек)

**Ожидаемый результат:**
- Строки "Built" для server и client
- 3 контейнера Started
- Последняя строка: `Container zeroreports-client-dev Started`

**Если ошибка при `npm ci` (client):**
- Проверь что `client/package-lock.json` присутствует

**Если ошибка TypeScript при сборке client:**
- Исправь ошибки в исходниках, повтори с Секции A

---

### Шаг B3: Ожидание запуска

**ВАЖНО:** После запуска контейнеры НЕ сразу готовы. Нужно подождать.

**Команда:**
```bash
sleep 20
```

---

### Шаг B4: Проверка health endpoint

**Команда:**
```bash
orb run -m zero-reports bash -c 'curl -s http://localhost/api/health'
```

**Требуемые permissions:** `all`

**Ожидаемый результат:** `{"status":"ok","timestamp":"..."}`

**Если пустой ответ или ошибка:**
1. Подожди ещё 15 секунд
2. Повтори curl
3. Если 3 попытки неудачны — проверь логи (см. TROUBLESHOOTING)

---

### Шаг B5: Проверка статуса контейнеров

**Команда:**
```bash
orb run -m zero-reports bash -c '
  cd /home/tamerlan/zero-reports
  docker compose -f docker-compose.dev.yml ps
'
```

**Требуемые permissions:** `all`

**Ожидаемый результат:** 3 контейнера в статусе `Up`, все — `(healthy)`

**Если server `(unhealthy)` или `(health: starting)`:** Подожди 30 секунд и повтори.

---

### Шаг B6: Сообщи результат пользователю

**Если все шаги успешны, напиши:**
```
Локальный деплой успешно завершён!
- Приложение: http://zero-reports.orb.local/
- API: http://zero-reports.orb.local/api/health
- Swagger: http://zero-reports.orb.local/api/docs
- Статус: healthy
- Контейнеры: 3/3 running
```

---

## СЕКЦИЯ C: РЕСТАРТ (без пересборки)

**Команда:**
```bash
orb run -m zero-reports bash -c '
  cd /home/tamerlan/zero-reports
  docker compose -f docker-compose.dev.yml up -d
'
```

**Требуемые permissions:** `all`

**ВАЖНО:** `docker compose restart` НЕ перечитывает `.env`! Используй `docker compose up -d`.

Затем выполни **Шаги B3, B4, B5** для проверки.

---

## TROUBLESHOOTING

### Проблема: OrbStack VM не запущена

**Симптомы:** `orb run` возвращает ошибку

**Решение:**
```bash
orb list
orb start zero-reports
```

---

### Проблема: Docker build failed

**Симптомы:** Ошибка при `docker compose build`

**Решение — просмотр логов:**
```bash
orb run -m zero-reports bash -c '
  cd /home/tamerlan/zero-reports
  docker compose -f docker-compose.dev.yml logs server --tail=50
'
```

---

### Проблема: Контейнер server unhealthy

**Симптомы:** `docker compose ps` показывает `(unhealthy)`

**Решение — проверь логи:**
```bash
orb run -m zero-reports bash -c 'docker logs zeroreports-server-dev 2>&1 | tail -30'
```

**Если `Cannot find module`** — проверь CMD в `server/Dockerfile`.
**Если `Connection refused` к postgres** — postgres ещё стартует, подожди 10 секунд.

---

### Проблема: Полная пересборка

**Симптомы:** Непонятные ошибки, кэш повреждён

**Решение:**
```bash
orb run -m zero-reports bash -c '
  cd /home/tamerlan/zero-reports
  docker compose -f docker-compose.dev.yml down --remove-orphans
  docker container prune -f
  docker compose -f docker-compose.dev.yml up --build -d
'
```

**Таймаут:** `block_until_ms: 600000` (10 минут)

---

### Проблема: Сеть OrbStack не работает (VM недоступна с macOS)

**Симптомы:** `curl http://zero-reports.orb.local/` зависает, ping 100% packet loss

**Причина:** OrbStack's bridge100 на macOS в подсети `192.168.128.0/24`, а VM получает DHCP-адрес в `192.168.139.0/24`. Подсети не совпадают → нет маршрута.

**Решение — проверить и восстановить:**
```bash
# 1. Проверить маршрут на macOS (должна быть строка 192.168.139 → bridge100)
netstat -rn | grep 192.168.139

# 2. Если маршрута нет — добавить (потребует пароль администратора macOS)
osascript -e 'do shell script "route add -net 192.168.139.0/24 -interface bridge100" with administrator privileges'

# 3. Проверить обратный маршрут на VM
orb run -m zero-reports bash -c 'ip route show | grep 192.168.128'

# 4. Если маршрута нет — перезапустить сервис
orb run -m zero-reports sudo bash -c 'systemctl start bridge-ip.service'

# 5. Проверить /etc/hosts на macOS (должна быть строка: 192.168.139.116  zero-reports.orb.local)
grep zero-reports /etc/hosts

# 6. Проверить
ping -c 1 192.168.139.116
curl -s http://zero-reports.orb.local/api/health
```

**Требуемые permissions:** `all`

---

### Проблема: Конфликт портов

**Симптомы:** `Bind for 0.0.0.0:80: address already in use`

**Решение:**
```bash
orb run -m zero-reports bash -c 'ss -tlnp | grep ":80 "'
```

---

### Проблема: Миграции не прошли

**Симптомы:** Сервер стартует но возвращает ошибки БД

**Решение — ручной запуск миграций:**
```bash
orb run -m zero-reports bash -c '
  cd /home/tamerlan/zero-reports
  docker compose -f docker-compose.dev.yml exec -T server npx prisma migrate deploy
'
```

**Требуемые permissions:** `all`

**Таймаут:** `block_until_ms: 60000`

---

## ОБЯЗАТЕЛЬНЫЕ ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (.env)

| Переменная | Подсистема | Без неё |
|------------|-----------|---------|
| `DATABASE_URL` | PostgreSQL/Prisma | Сервер не подключится к БД |
| `NODE_ENV` | NestJS | По умолчанию production |
| `PORT` | NestJS | По умолчанию 3000 |
| `VITE_API_URL` | Frontend | API запросы не работают |

---

## ЧЕКЛИСТ ДЕПЛОЯ (для самопроверки)

После деплоя убедись что ВСЕ пункты выполнены:

- [ ] OrbStack VM `zero-reports` в статусе `running` (`orb list`)
- [ ] Файлы синхронизированы (tar → extract)
- [ ] `.env` создан на VM
- [ ] Docker build завершился (строки "Built")
- [ ] `docker compose up -d` — 3 контейнера Started
- [ ] Подождал минимум 20 секунд после запуска
- [ ] Health endpoint вернул `{"status":"ok"}` на `/api/health`
- [ ] Все контейнеры в статусе `(healthy)`
- [ ] Сообщил пользователю результат

---

## БЫСТРЫЕ КОМАНДЫ (copy-paste)

### Проверить статус VM:
```bash
orb list
```

### Проверить статус контейнеров:
```bash
orb run -m zero-reports bash -c 'docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"'
```

### Health check:
```bash
orb run -m zero-reports bash -c 'curl -s http://localhost/api/health'
```

### Посмотреть логи server:
```bash
orb run -m zero-reports bash -c 'docker logs zeroreports-server-dev --tail=50 2>&1'
```

### Посмотреть логи client (nginx):
```bash
orb run -m zero-reports bash -c 'docker logs zeroreports-client-dev --tail=50 2>&1'
```

### Посмотреть все логи:
```bash
orb run -m zero-reports bash -c 'cd /home/tamerlan/zero-reports && docker compose -f docker-compose.dev.yml logs --tail=30'
```

### Перезапустить без пересборки:
```bash
orb run -m zero-reports bash -c 'cd /home/tamerlan/zero-reports && docker compose -f docker-compose.dev.yml up -d'
```

### Остановить все контейнеры:
```bash
orb run -m zero-reports bash -c 'cd /home/tamerlan/zero-reports && docker compose -f docker-compose.dev.yml down'
```

### Полный rsync + build + start:
```bash
cd "/Volumes/Thunderlan/Yandex Drive/Yandex.Disk.localized/0to8/backend/zero-reports/zero-reports" && \
tar czf /tmp/zero-reports-deploy.tar.gz --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='coverage' . && \
orb run -m zero-reports bash -c '
  rm -rf /home/tamerlan/zero-reports/*
  cp /mnt/mac/tmp/zero-reports-deploy.tar.gz /tmp/zr.tar.gz
  cd /home/tamerlan/zero-reports
  tar xzf /tmp/zr.tar.gz 2>/dev/null
  rm /tmp/zr.tar.gz
  cat > .env << "ENVEOF"
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://zeroreports:zeroreports_secret@postgres:5432/zeroreports
VITE_API_URL=/api
ENVEOF
  docker compose -f docker-compose.dev.yml up --build -d
'
```

---

## ДОСТУП К СЕРВИСАМ

| Сервис | URL |
|--------|-----|
| Frontend | http://zero-reports.orb.local/ |
| API | http://zero-reports.orb.local/api/ |
| Health | http://zero-reports.orb.local/api/health |
| Swagger | http://zero-reports.orb.local/api/docs |

**Авторизация:** Не требуется. Отчёты доступны публично по уникальному токену.

---

## Информация о сервере

| Параметр | Значение |
|----------|----------|
| OrbStack VM | zero-reports |
| SSH Host | zero-reports.orb.local |
| SSH User | tamerlan |
| SSH Password | Zool333el |
| App Directory | /home/tamerlan/zero-reports |
| App URL | http://zero-reports.orb.local |
| Health Endpoint | http://zero-reports.orb.local/api/health |
| OS | Ubuntu 25.10 (OrbStack VM) |
| Docker | 29.2.1 |
| Docker Compose | v5.1.0 |
| Containers | 3 (postgres, server, client) |

**Важно:** Для выполнения команд используй `orb run -m zero-reports`. HTTP (curl/браузер) — через `zero-reports.orb.local` (→ `192.168.139.116`).

**Сетевой fix:** Маршрут macOS → VM через LaunchDaemon, обратный маршрут VM → macOS через systemd. DNS через `/etc/hosts`.

---

**Последнее обновление:** 2026-03-04
