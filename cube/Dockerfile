# ================================
# Cube.js Analytics Engine
# ================================
FROM cubejs/cube:latest

WORKDIR /cube/conf

# Копируем конфигурацию
COPY cube.js .
COPY schema ./schema

# Открываем порты
# 4000 - API
# 3000 - Playground (dev only)
EXPOSE 4000

# Healthcheck (используем node т.к. wget/curl недоступны в образе)
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/livez', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"
