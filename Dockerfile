FROM node:20-alpine AS deps-prod

WORKDIR /app

COPY ./package*.json ./

# Устанавливаем только продакшн зависимости
RUN npm install --omit=dev

# Строим приложение
FROM deps-prod AS build

COPY . .

# Устанавливаем dev зависимости для сборки
RUN npm install --include=dev

# Генерация клиента Prisma
RUN npx prisma generate

# Запускаем сборку
RUN npm run build

# Продакшн образ
FROM node:20-alpine AS prod

WORKDIR /app

# Копируем необходимые файлы из предыдущих этапов
COPY --from=build /app/package*.json ./
COPY --from=deps-prod /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/tsconfig.json ./tsconfig.json

# Запуск приложения
CMD ["npm", "run", "start"]
