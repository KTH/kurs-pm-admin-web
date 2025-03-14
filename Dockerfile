FROM kthregistry.azurecr.io/kth-nodejs-20:latest
LABEL maintainer="KTH-studadm studadm.developers@kth.se"

WORKDIR /application
ENV NODE_PATH /application

ENV TZ Europe/Stockholm
# Copy files used by Gulp.
COPY ["config", "config"]
COPY ["common", "common"]
COPY ["common-context", "common-context"]
COPY ["public", "public"]
COPY ["i18n", "i18n"]
COPY [".babelrc", ".babelrc"]
COPY [".eslintrc", ".eslintrc"]
COPY ["package.json", "package.json"]
COPY ["package-lock.json", "package-lock.json"]

# Copy source files, so changes does not trigger gulp.
COPY ["app.js", "app.js"]
COPY ["server", "server"]
COPY ["build.sh", "build.sh"]
COPY ["webpack.config.js", "webpack.config.js"]

RUN chmod a+rx build.sh && \
    chown -R node:node /application

USER node

RUN npm pkg delete scripts.prepare && \
    npm ci --unsafe-perm && \
    #    yarn install --no-lockfile && \
    npm run build && \
    npm prune --production 

EXPOSE 3000

CMD ["node", "app.js"]