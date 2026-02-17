FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY dist/ ./dist/
ENV EASYPANEL_MCP_MODE=http
ENV PORT=3000
EXPOSE 3000
CMD ["node", "dist/index.js"]
