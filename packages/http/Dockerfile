FROM node:24.21.0-bookworm-slim@sha256:d6aa754f16b3197301076f047b5def2f02ea1dbbc2ca920407d46d7ec7f87b20 AS build
WORKDIR /src
RUN npm install --global pnpm@11.25.0 --ignore-scripts --no-audit --no-fund
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json LICENSE ./
COPY packages/core packages/core
COPY packages/http packages/http
COPY shared shared
RUN pnpm install --frozen-lockfile \
    && pnpm --filter lazy-avatars build \
    && pnpm --filter @paulaquiin/lazy-avatars-http build \
    && mkdir /out \
    && pnpm --filter lazy-avatars pack --out /out/core.tgz \
    && pnpm --filter @paulaquiin/lazy-avatars-http pack --out /out/http.tgz

FROM node:24.21.0-bookworm-slim@sha256:d6aa754f16b3197301076f047b5def2f02ea1dbbc2ca920407d46d7ec7f87b20
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=build /out /tmp/avatars
RUN npm install --ignore-scripts --omit=dev --no-audit --no-fund /tmp/avatars/core.tgz \
    && npm install --offline --ignore-scripts --omit=dev --no-audit --no-fund /tmp/avatars/http.tgz \
    && rm -rf /tmp/avatars /root/.npm
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD ["node", "-e", "fetch('http://127.0.0.1:3000/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
CMD ["node", "node_modules/@paulaquiin/lazy-avatars-http/dist/bin.js"]
