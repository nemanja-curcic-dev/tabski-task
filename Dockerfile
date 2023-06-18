FROM node:16.19-slim

COPY package.json package.json
COPY tsconfig.json tsconfig.json
RUN npm install

COPY src src
RUN npm run build

CMD ["node", "/dist/index.js"]