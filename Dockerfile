FROM node:6.9.1

RUN npm install pm2 -g

EXPOSE 3000
CMD ["pm2", "--no-daemon" "process.yml"]
