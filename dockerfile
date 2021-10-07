FROM node:alpine
# expose ports
EXPOSE 3000 4000
# specify Working dir 
WORKDIR /app
# install app dependencies
COPY ./app/package.json ./
COPY ./app/package-lock.json ./
RUN npm install --silent
#RUN npm install react-scripts@3.4.1 -g --silentexit
# first Run 
# RUN npx json-server -- watch data/db.json --port 4000

# copy App 
COPY ./app /.

CMD ["npm", "start"]

# docker buld & run
# docker cp wartezimmer:/app/* ./app 
# pwd
# docker run  -it --rm -p 3000:3000 -p 4000:4000 -v/home/bubbazz/Documents/docker/florian/react-wartezimmer/app:/app wartezimmer
# docker exec -it 699 npx json-server --watch data/db.json --port 4000 --host 0.0.0.0   