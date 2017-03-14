FROM node:6.9.1-onbuild

RUN npm install -g pm2 node-gyp

RUN apt-get update
RUN apt-get install -y python-software-properties python3-software-properties software-properties-common
RUN apt-get install -y gcc-4.9
RUN apt-get upgrade -y libstdc++6

EXPOSE 3000
CMD ["pm2-docker", "process.yml"]
