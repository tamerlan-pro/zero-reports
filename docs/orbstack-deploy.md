# Local Server Deployment Guide for AI Agents

> **ВАЖНО ДЛЯ AI АГЕНТОВ**: Этот документ содержит пошаговые инструкции для деплоя на ЛОКАЛЬНЫЙ СЕРВЕР (OrbStack VM).
> Выполняйте команды ПОСЛЕДОВАТЕЛЬНО. НЕ пропускайте шаги. ПРОВЕРЯЙТЕ результат каждого шага.
>
> **КРИТИЧЕСКИ ВАЖНО — ДВА DOCKER-ОКРУЖЕНИЯ:**
> На этой машине работают ДВА НЕЗАВИСИМЫХ Docker-движка:
> 1. **macOS Docker** (хост) — `docker ps` на macOS. Это НЕ production-сервер.
> 2. **OrbStack VM Docker** — `orb run -m zero-reports docker ps`. Это ЕДИНСТВЕННЫЙ production-сервер.
>
> `zero-reports.orb.local` указывает на VM (`192.168.129.116`), а НЕ на macOS Docker.
> **ВСЕ команды сборки и деплоя ОБЯЗАНЫ выполняться ЧЕРЕЗ `orb run -m zero-reports`.**
> Выполнение `docker compose build/up` напрямую на macOS НЕ влияет на production.
> НИКОГДА не используй `docker compose` без `orb run -m zero-reports` для деплоя.

---

## КОНСТАНТЫ (используй эти значения буквально)

```
SSH_HOST = zero-reports.orb.local
SSH_USER = tamerlan
SSH_PASSWORD = Zool333el
APP_DIR_ON_SERVER = /home/tamerlan/zero-reports
PERSISTENT_ENV_PATH = /home/tamerlan/.env.zeroreports
APP_URL = http://zero-reports.orb.local
HEALTH_ENDPOINT = http://zero-reports.orb.local/api/health
LOCAL_PROJECT_PATH = /Volumes/Thunderlan/Yandex Drive/Yandex.Disk.localized/0to8/backend/zero-reports/zero-reports
```

OrbStack VM — Ubuntu внутри OrbStack на рабочем Mac.

**Сетевые особенности OrbStack:**
- **SSH** → используй `zero-reports.orb.local` (резолвится через `/etc/hosts` → `192.168.129.116`)
- **HTTP (curl, браузер)** → используй `zero-reports.orb.local`
- **Внутри VM** → OrbStack CLI: `orb run -m zero-reports <command>` (рекомендуется, не требует пароля)

**⚠️ ЛОВУШКА: macOS Docker ≠ VM Docker**
OrbStack регистрирует port-forwarding с macOS (`localhost:80`) на VM.
Однако Docker-контейнеры запущенные на macOS (`docker compose up -d` без `orb run`)
создают ДРУГИЕ контейнеры на хосте, которые тоже маппятся на `localhost:80`.
В итоге `curl http://localhost:80` может попасть в macOS-контейнер, а
`curl http://zero-reports.orb.local` — в VM-контейнер. Это два РАЗНЫХ сервера.
**Единственный правильный способ деплоя — через `orb run -m zero-reports`.**

**ВАЖНО — Сетевой fix (bridge subnet):**
OrbStack's DHCP назначает VM IP **динамически** — подсеть может меняться при перезапуске VM.
Bridge100 на macOS — в `192.168.128.0/24`. VM может получить IP в другой подсети (напр. `192.168.129.x`, `192.168.139.x`).

**Автоматическое исправление (при загрузке macOS):**
1. **LaunchDaemon** `com.orbstack.route-fix` → запускает `/usr/local/bin/orbfix-launchdaemon.sh`, который **динамически** определяет IP VM, добавляет маршрут и обновляет `/etc/hosts`
2. **На VM**: systemd-сервис `bridge-ip.service` добавляет обратный маршрут `192.168.128.0/24 dev eth0`

**Ручное исправление (если сеть не работает после перезагрузки OrbStack или VM):**
```bash
cd "/Volumes/Thunderlan/Yandex Drive/Yandex.Disk.localized/0to8/backend/zero-reports/zero-reports"
bash scripts/orbfix.sh
```
Скрипт автоматически: запустит VM (если остановлена), определит текущий IP, добавит маршрут, обновит `/etc/hosts`, настроит обратный маршрут на VM и проверит подключение.

**ВАЖНО: SSH через `sshpass` может зависать на этой VM. Используй `orb run -m zero-reports` для выполнения команд.**

---

## АРХИТЕКТУРА ЛОКАЛЬНОГО СЕРВЕРА

```
OrbStack VM "zero-reports" — Ubuntu 25.10, Docker 29.x

/home/tamerlan/
├── .env.zeroreports             ← ПЕРСИСТЕНТНЫЙ .env (НИКОГДА не удаляется деплоем)
│                                   Содержит: DB URL, пароли, VITE_MUI_LICENSE_KEY
│                                   Создаётся один раз скриптом scripts/setup-env.sh
└── zero-reports/                ← ZeroReports (этот проект)
    ├── .env -> ../.env.zeroreports  ← СИМЛИНК (пересоздаётся при каждом деплое)
    ├── docker-compose.dev.yml   ← postgres, server, client (читает .env автоматически)
    ├── server/                  ← NestJS API
    │   ├── Dockerfile
    │   ├── docker-entrypoint.sh ← миграции + запуск
    │   └── prisma/              ← схема и миграции БД
    ├── client/                  ← React + Vite + MUI
    │   ├── Dockerfile
    │   └── nginx.conf           ← reverse proxy /api/ → server
    ├── reports/                 ← примеры отчетов (JSON)
    └── scripts/
        └── setup-env.sh        ← одноразовая настройка .env на VM
```

**Сервисы (3 контейнера):**
- `postgres` — PostgreSQL 16 Alpine (локальная БД)
- `server` — NestJS backend (порт 3000 внутри), Prisma ORM
- `client` — React SPA (статика через Nginx, порт 80), reverse proxy для API

---

## ПЕРВОНАЧАЛЬНАЯ НАСТРОЙКА (выполняется ОДИН РАЗ)

> **Выполни эту секцию только если `/home/tamerlan/.env.zeroreports` ещё не существует на VM.**
> Проверить: `orb run -m zero-reports bash -c 'ls -la /home/tamerlan/.env.zeroreports'`

Если файл не существует — запусти после первого деплоя файлов:
```bash
orb run -m zero-reports bash -c '/home/tamerlan/zero-reports/scripts/setup-env.sh "ВАШ_MUI_X_КЛЮЧ"'
```

**Требуемые permissions:** `all`

**Ожидаемый результат:** `OK: Создан /home/tamerlan/.env.zeroreports (права: 600)`

MUI X ключ хранится в `.env.zeroreports` вне директории деплоя и **никогда не стирается** при последующих деплоях или рефакторингах.

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

### Шаг A0: Бэкап данных PostgreSQL

**Выполняется ПЕРЕД синхронизацией файлов.** Graceful — не падает если postgres не запущен.

**Команда:**
```bash
orb run -m zero-reports bash -c '
  if docker ps -q -f name=zeroreports-postgres | grep -q .; then
    docker exec zeroreports-postgres pg_dump -U zeroreports zeroreports \
      | gzip > /home/tamerlan/zeroreports-backup-$(date +%Y%m%d-%H%M%S).sql.gz
    echo "Backup: $(ls -t /home/tamerlan/zeroreports-backup-*.sql.gz | head -1)"
    ls -t /home/tamerlan/zeroreports-backup-*.sql.gz 2>/dev/null | tail -n +6 | xargs -r rm -f
    echo "Rotation: kept last 5 backups"
  else
    echo "SKIP: postgres not running (first deploy or after crash)"
  fi
'
```

**Требуемые permissions:** `all`

**Ожидаемый результат:** Путь к созданному `.sql.gz` файлу, либо `SKIP: postgres not running`

---

### Шаг A1: Создание архива проекта

**Команда (выполнить с macOS):**
```bash
cd "/Volumes/Thunderlan/Yandex Drive/Yandex.Disk.localized/0to8/backend/zero-reports/zero-reports" && \
tar czf /tmp/zero-reports-deploy.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.env' \
  --exclude='dist' \
  --exclude='coverage' \
  .
```

**Ожидаемый результат:** Файл `/tmp/zero-reports-deploy.tar.gz` создан (~400 KB)

> **Примечание:** `.env` исключён из архива намеренно — он хранится персистентно на VM
> в `/home/tamerlan/.env.zeroreports` и подключается через симлинк.

---

### Шаг A2: Распаковка на VM и подключение .env

**Команда:**
```bash
orb run -m zero-reports bash -c '
  rm -rf /home/tamerlan/zero-reports/*
  cp /mnt/mac/tmp/zero-reports-deploy.tar.gz /tmp/zr.tar.gz
  cd /home/tamerlan/zero-reports
  tar xzf /tmp/zr.tar.gz 2>/dev/null
  rm /tmp/zr.tar.gz
  ln -sf /home/tamerlan/.env.zeroreports .env
  echo "Files: $(find . -type f | wc -l)"
  [ -L .env ] && echo ".env: симлинк OK" || echo "ERROR: .env отсутствует! Запусти scripts/setup-env.sh"
'
```

**Требуемые permissions:** `all`

**Ожидаемый результат:**
```
Files: 180+
.env: симлинк OK
```

**Если ошибка:** Убедись что VM запущена: `orb list`. Если `zero-reports` в статусе `stopped` — запусти: `orb start zero-reports`.

**Если `.env` отсутствует:** Выполни первоначальную настройку из секции "ПЕРВОНАЧАЛЬНАЯ НАСТРОЙКА".

---

## СЕКЦИЯ B: ПОЛНЫЙ ДЕПЛОЙ

### Шаг B1: Синхронизация файлов

Выполни **Шаги A0, A1, A2** из Секции A.

---

### Шаг B2: Сборка и запуск

**⚠️ ОБЯЗАТЕЛЬНО через `orb run`! Без него сборка пойдёт в macOS Docker, а не на сервер.**

**Команда:**
```bash
orb run -m zero-reports bash -c '
  cd /home/tamerlan/zero-reports
  docker compose -f docker-compose.dev.yml down --remove-orphans
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

### Шаг B5: Верификация — правильный ли бандл отдаётся

**ОБЯЗАТЕЛЬНЫЙ шаг.** Убедись что VM отдаёт тот же JS-файл, что был собран при `docker compose build`.

**Команда:**
```bash
orb run -m zero-reports bash -c '
  BUILT=$(docker exec zeroreports-client-dev cat /usr/share/nginx/html/index.html | grep -o "index-[^\"]*\.js")
  SERVED=$(curl -s http://localhost/ | grep -o "index-[^\"]*\.js")
  echo "Built:  $BUILT"
  echo "Served: $SERVED"
  if [ "$BUILT" = "$SERVED" ]; then echo "✅ OK — бандлы совпадают"; else echo "❌ MISMATCH — сервер отдаёт старый файл!"; fi
'
```

**Требуемые permissions:** `all`

**Если ❌ MISMATCH:**
1. Останови контейнеры: `orb run -m zero-reports bash -c 'cd /home/tamerlan/zero-reports && docker compose -f docker-compose.dev.yml down --remove-orphans'`
2. Пересобери с нуля: вернись к Шагу B2
3. Если не помогает — см. TROUBLESHOOTING → "Сервер отдаёт старый бандл"

---

### Шаг B6: Проверка статуса контейнеров

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

### Шаг B7: Сообщи результат пользователю

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
**Если `Authentication failed` к postgres** — том содержит старые данные с другими кредами. Нужен ручной сброс (см. "Пустая БД" ниже).

---

### Проблема: Полная пересборка (кэш повреждён)

**Симптомы:** Непонятные ошибки, кэш повреждён

> **⛔ ЗАПРЕЩЕНО использовать `down -v`** — этот флаг удаляет том `postgres_data`
> и **безвозвратно стирает ВСЕ данные**. Перед любым использованием `-v` обязательно выполни шаг A0 (бэкап).

**Решение (без потери данных):**
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

**Причина:** OrbStack's bridge100 на macOS в подсети `192.168.128.0/24`, а VM получает DHCP-адрес в **другой подсети** (IP меняется при перезапуске VM).

**Решение — запустить скрипт автоматической настройки:**
```bash
cd "/Volumes/Thunderlan/Yandex Drive/Yandex.Disk.localized/0to8/backend/zero-reports/zero-reports"
bash scripts/orbfix.sh
```

Скрипт автоматически определяет текущий IP, добавляет маршрут, обновляет `/etc/hosts` и проверяет подключение.

**Требуемые permissions:** `all`

---

### Проблема: Сервер отдаёт старый бандл (MISMATCH на шаге B5)

**Симптомы:** `curl http://zero-reports.orb.local/` возвращает HTML со старым JS-файлом, хотя контейнер был пересобран.

**Причина:** Существуют ДВА Docker-окружения — macOS Docker и OrbStack VM Docker. Если деплой выполнялся через `docker compose` напрямую на macOS (без `orb run`), то контейнеры пересобирались на ХОСТЕ, а не на VM. VM продолжала отдавать старый код.

**Решение:**
```bash
# 1. Убедись что деплоишь на VM, а не на macOS:
orb run -m zero-reports bash -c '
  cd /home/tamerlan/zero-reports
  docker compose -f docker-compose.dev.yml down --remove-orphans
  docker compose -f docker-compose.dev.yml up --build -d 2>&1
'
```

**Как диагностировать — какой Docker используется:**
```bash
# Docker на macOS (НЕПРАВИЛЬНО для деплоя):
docker ps

# Docker на VM (ПРАВИЛЬНО):
orb run -m zero-reports docker ps
```

Если контейнеры с одинаковыми именами есть в обоих списках — macOS Docker перехватывает трафик. Останови macOS-контейнеры:
```bash
docker compose -f docker-compose.dev.yml down
```

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

### Проблема: Пустая БД (новый том или случайное удаление)

**Симптомы:** Отчёты возвращают 404, `GET /api/reports` возвращает `[]`

**Шаг 1 — попробуй восстановить из бэкапа:**
```bash
orb run -m zero-reports bash -c '
  LATEST=$(ls -t /home/tamerlan/zeroreports-backup-*.sql.gz 2>/dev/null | head -1)
  if [ -z "$LATEST" ]; then
    echo "ERROR: Бэкапов не найдено. Используй сидирование ниже."
    exit 1
  fi
  gunzip -c "$LATEST" | docker exec -i zeroreports-postgres psql -U zeroreports zeroreports
  echo "Restored from: $LATEST"
'
```

**Требуемые permissions:** `all`

**Шаг 2 — если бэкапов нет, засей примеры репортов:**
```bash
orb run -m zero-reports bash -c '
  cd /home/tamerlan/zero-reports
  for f in reports/*.report.json; do
    result=$(curl -s -X POST http://localhost:3000/reports \
      -H "Content-Type: application/json" \
      -d @"$f")
    slug=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get(\"slug\",\"error\"))" 2>/dev/null)
    token=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get(\"token\",\"?\"))" 2>/dev/null)
    echo "$slug -> $token"
  done
'
```

**Требуемые permissions:** `all`

---

## ОБЯЗАТЕЛЬНЫЕ ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ (.env)

> Все переменные хранятся в `/home/tamerlan/.env.zeroreports` на VM.
> Для изменения: `orb run -m zero-reports bash -c 'nano /home/tamerlan/.env.zeroreports'`

| Переменная | Подсистема | Без неё |
|------------|-----------|---------|
| `DATABASE_URL` | PostgreSQL/Prisma | Сервер не подключится к БД |
| `POSTGRES_PASSWORD` | postgres контейнер | БД стартует с неправильными кредами |
| `NODE_ENV` | NestJS | По умолчанию production |
| `PORT` | NestJS | По умолчанию 3000 |
| `VITE_API_URL` | Frontend | API запросы не работают |
| `VITE_MUI_LICENSE_KEY` | MUI X Pro | Watermark в графиках, DataGrid Pro |

---

## ЧЕКЛИСТ ДЕПЛОЯ (для самопроверки)

После деплоя убедись что ВСЕ пункты выполнены:

- [ ] OrbStack VM `zero-reports` в статусе `running` (`orb list`)
- [ ] Бэкап создан (шаг A0) или пропущен с причиной "first deploy"
- [ ] Файлы синхронизированы (tar → extract, шаги A1–A2)
- [ ] `.env` — симлинк на `/home/tamerlan/.env.zeroreports` (проверка в A2)
- [ ] **Все команды выполнялись через `orb run -m zero-reports` (НЕ через macOS Docker!)**
- [ ] Docker build завершился (строки "Built") — **без warning о VITE_MUI_LICENSE_KEY**
- [ ] `docker compose up -d` — 3 контейнера Started
- [ ] Подождал минимум 20 секунд после запуска
- [ ] Health endpoint вернул `{"status":"ok"}` на `/api/health`
- [ ] **Бандл верифицирован (Шаг B5): Built = Served ✅**
- [ ] Все контейнеры в статусе `(healthy)`
- [ ] macOS Docker НЕ запущен на порту 80 (нет конфликта)
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

### Полный деплой (бэкап + rsync + build + start):
```bash
cd "/Volumes/Thunderlan/Yandex Drive/Yandex.Disk.localized/0to8/backend/zero-reports/zero-reports" && \
orb run -m zero-reports bash -c '
  if docker ps -q -f name=zeroreports-postgres | grep -q .; then
    docker exec zeroreports-postgres pg_dump -U zeroreports zeroreports \
      | gzip > /home/tamerlan/zeroreports-backup-$(date +%Y%m%d-%H%M%S).sql.gz
    ls -t /home/tamerlan/zeroreports-backup-*.sql.gz 2>/dev/null | tail -n +6 | xargs -r rm -f
    echo "Backup OK"
  else
    echo "SKIP backup: postgres not running"
  fi
' && \
tar czf /tmp/zero-reports-deploy.tar.gz \
  --exclude='node_modules' --exclude='.git' --exclude='.env' \
  --exclude='dist' --exclude='coverage' . && \
orb run -m zero-reports bash -c '
  rm -rf /home/tamerlan/zero-reports/*
  cp /mnt/mac/tmp/zero-reports-deploy.tar.gz /tmp/zr.tar.gz
  cd /home/tamerlan/zero-reports
  tar xzf /tmp/zr.tar.gz 2>/dev/null
  rm /tmp/zr.tar.gz
  ln -sf /home/tamerlan/.env.zeroreports .env
  [ -L .env ] && echo ".env: OK" || echo "ERROR: .env missing!"
  docker compose -f docker-compose.dev.yml down --remove-orphans
  docker compose -f docker-compose.dev.yml up --build -d
'
```

**Требуемые permissions:** `all`

**Таймаут:** `block_until_ms: 600000`

### Верификация после деплоя:
```bash
sleep 15 && orb run -m zero-reports bash -c '
  BUILT=$(docker exec zeroreports-client-dev cat /usr/share/nginx/html/index.html | grep -o "index-[^\"]*\.js")
  SERVED=$(curl -s http://localhost/ | grep -o "index-[^\"]*\.js")
  echo "Built:  $BUILT"
  echo "Served: $SERVED"
  if [ "$BUILT" = "$SERVED" ]; then echo "✅ OK"; else echo "❌ MISMATCH"; fi
  curl -s http://localhost/api/health
'
```

### Просмотр бэкапов:
```bash
orb run -m zero-reports bash -c 'ls -lh /home/tamerlan/zeroreports-backup-*.sql.gz 2>/dev/null || echo "Бэкапов нет"'
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
| Persistent ENV | /home/tamerlan/.env.zeroreports |
| App URL | http://zero-reports.orb.local |
| Health Endpoint | http://zero-reports.orb.local/api/health |
| OS | Ubuntu 25.10 (OrbStack VM) |
| Docker | 29.2.1 |
| Docker Compose | v5.1.0 |
| Containers | 3 (postgres, server, client) |

**Важно:** Для выполнения команд используй `orb run -m zero-reports`. HTTP (curl/браузер) — через `zero-reports.orb.local` (→ `192.168.129.116`).

**Сетевой fix:** Маршрут macOS → VM через LaunchDaemon, обратный маршрут VM → macOS через systemd. DNS через `/etc/hosts`.

---

**Последнее обновление:** 2026-03-09

**Changelog:**
- 2026-03-09: Персистентный .env вне директории деплоя (`/home/tamerlan/.env.zeroreports` + симлинк). Добавлен шаг A0 (бэкап postgres с ротацией). Убран шаг A3 (генерация .env). `--exclude='.env'` в tar. Запрет `down -v` с предупреждением. Добавлены команды восстановления и сидирования. Добавлена колонка `VITE_MUI_LICENSE_KEY` и `POSTGRES_PASSWORD` в таблицу переменных. Обновлены все quick-команды.
- 2026-03-05: Добавлены предупреждения о двух Docker-окружениях (macOS vs VM). Добавлен обязательный шаг B5 (верификация бандла). Добавлен troubleshooting для MISMATCH. Обновлён чеклист.
- 2026-03-04: Первая версия документа.
