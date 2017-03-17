FROM node:6.9.1-onbuild

RUN npm i -g pm2 node-gyp gulp

EXPOSE 3000
CMD ["pm2-dev", "process.yml"]
