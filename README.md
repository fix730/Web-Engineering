Docker installieren

1. ins Verzeichnis navigieren
2. Befehl in Konsole eingeben um Docker zu starten:
docker-compose up --build
3. Beim ersten mal folgen Befehl eingeben um Prisma Schema zu laden:
docker-compose run --rm backend npx prisma migrate dev --name initial_setup

