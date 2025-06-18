import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // Stellt sicher, dass Umgebungsvariablen geladen werden


const pool = mysql.createPool({
    host: process.env.DB_HOST,      
    user: process.env.DB_USER,      
    password: process.env.DB_PASSWORD,  
    database: process.env.DB_NAME,  
    waitForConnections: true,
    connectionLimit: 10, // Anzahl der maximalen Verbindungen im Pool
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Fehler beim Verbinden mit der Datenbank:', err.stack);
        return;
    }
    console.log('Erfolgreich mit der MySQL-Datenbank verbunden (Pool).');
    connection.release(); // Verbindung zurück in den Pool geben
});

export default pool.promise(); 