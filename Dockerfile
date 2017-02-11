FROM node:6.9.1

RUN npm install pm2 -g

EXPOSE 80 27017
CMD ["pm2-docker", "process.yml"]
