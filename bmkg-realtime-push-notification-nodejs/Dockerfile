FROM node:16-alpine

RUN mkdir -p /app
COPY --chown=node:node ./ /app
RUN chmod -R 777 /app
RUN chown -R node:node /app
WORKDIR /app
EXPOSE 80
CMD ["node", "index.js"]