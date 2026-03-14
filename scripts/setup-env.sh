#!/usr/bin/env bash
# =============================================================================
# Одноразовая настройка персистентного .env на OrbStack VM zero-reports.
#
# Использование:
#   orb run -m zero-reports bash /home/tamerlan/zero-reports/scripts/setup-env.sh "МОЙ_MUI_X_КЛЮЧ"
#
# Файл создаётся в /home/tamerlan/.env.zeroreports (вне директории деплоя)
# и симлинкуется в /home/tamerlan/zero-reports/.env при каждом деплое.
# Таким образом ключи НИКОГДА не стираются при рефакторинге или деплое.
#
# Повторный запуск безопасен — файл не перезаписывается если уже существует.
# Для обновления: nano /home/tamerlan/.env.zeroreports
# =============================================================================

set -euo pipefail

ENV_PATH="/home/tamerlan/.env.zeroreports"
MUI_KEY="${1:-}"

if [ -f "$ENV_PATH" ]; then
  echo "INFO: $ENV_PATH уже существует — пропускаем создание."
  echo "      Для обновления: nano $ENV_PATH"
  echo "      Текущее содержимое (без секретов):"
  grep -v "KEY\|PASSWORD\|SECRET\|DATABASE_URL" "$ENV_PATH" || true
  exit 0
fi

if [ -z "$MUI_KEY" ]; then
  echo "ERROR: Не передан MUI X License Key."
  echo ""
  echo "Использование:"
  echo "  orb run -m zero-reports bash /home/tamerlan/zero-reports/scripts/setup-env.sh \"ВАШ_КЛЮЧ\""
  echo ""
  echo "Ключ можно получить на: https://mui.com/x/introduction/licensing/"
  exit 1
fi

cat > "$ENV_PATH" << ENVEOF
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://zeroreports:zeroreports_secret@postgres:5432/zeroreports
POSTGRES_PASSWORD=zeroreports_secret
VITE_API_URL=/api
VITE_MUI_LICENSE_KEY=${MUI_KEY}
ENVEOF

chmod 600 "$ENV_PATH"

echo "OK: Создан $ENV_PATH (права: 600)"
echo ""
echo "Следующий шаг: запустить деплой."
echo "Симлинк .env будет создан автоматически в шаге A2."
