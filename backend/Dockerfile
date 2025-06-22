FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

# Kopiere das Prisma-Schema und führe dann prisma generate aus.
# Dies stellt sicher, dass die Typen generiert werden, bevor der Build-Prozess beginnt.
COPY prisma ./prisma
RUN npx prisma generate # <-- Diese Zeile ist entscheidend hier!

COPY tsconfig.json ./
COPY src ./src

RUN npm run build # <-- Jetzt sollte der Build die generierten Prisma-Typen finden

# Das CMD bleibt gut, um sicherzustellen, dass Prisma auch beim Start generiert wird,
# falls das Schema sich ändert und der Container nicht neu gebaut wird.
CMD ["sh", "-c", "npx prisma generate && npm run start"]