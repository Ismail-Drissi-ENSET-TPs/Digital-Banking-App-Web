FROM node:latest AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

CMD ["npm", "start"]

#FROM node:latest AS runtime
#WORKDIR /app
#COPY --from=build /app/dist/digital-banking-web .
#CMD ["npx", "serve", "-s", "."]
