Veraussetzung: Docker installieren

1. ins Verzeichnis navigieren
2. Befehl in Konsole eingeben um Docker zu starten:
docker-compose down
docker volume rm web-engineering_mysql_data # Nur wenn du init.sql geändert hast und eine Neuinitialisierung möchtest
docker-compose up --build

Kalender installieren:
Terminal: npm install react-big-calendar moment
