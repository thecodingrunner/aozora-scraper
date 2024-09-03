FROM node

WORKDIR /app

RUN apt-get update && apt-get install -y \
    # chromium \
    # libgconf-2-4 \
    # libatk1.0-0 \
    # libatk-bridge2.0-0 \
    # libgdk-pixbuf2.0-0 \
    # libgtk-3-0 \
    # libgbm-dev \
    # libnss3-dev \
    # libxss-dev \
    # fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    # --no-install-recommends
    chromium \
    libgconf-2-4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libgbm-dev \
    libnss3-dev \
    libxss-dev \
    libasound2 \
    libxshmfence1 \
    xvfb \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*


ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]

# FROM node:16-slim

# WORKDIR /app

# RUN apt-get update && apt-get install -y \
#     chromium \
#     libgconf-2-4 \
#     libatk1.0-0 \
#     libatk-bridge2.0-0 \
#     libgdk-pixbuf2.0-0 \
#     libgtk-3-0 \
#     libgbm-dev \
#     libnss3-dev \
#     libxss-dev \
#     libasound2 \
#     libxshmfence1 \
#     xvfb \
#     fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf \
#     --no-install-recommends \
#     && rm -rf /var/lib/apt/lists/*

# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
# ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser
# ENV NODE_ENV production

# RUN groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
#     && mkdir -p /home/pptruser/Downloads \
#     && chown -R pptruser:pptruser /home/pptruser \
#     && chown -R pptruser:pptruser /app

# COPY package*.json ./

# RUN npm ci --only=production

# COPY . .

# EXPOSE 3000

# RUN npm run build

# USER pptruser

# CMD ["npm", "start"]