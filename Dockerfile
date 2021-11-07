FROM node:16.10.0

LABEL version="1.0"
LABEL description="Syscompiler frontend image"
LABEL maintainer = ["alexdsantosv@gmail.com"]

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
