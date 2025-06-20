// src/routes/user.ts
import express from 'express';
import multer from 'multer';
import path from 'path'; // Wird weiterhin für die Dateierweiterung benötigt
import { AuthenticatedRequest, protect } from '../middleware/protect';
import { updateImageById, getImageById } from '../utils/dbQuery'; // Importieren Sie Ihre DB-Funktionen

const router = express.Router();

// Multer-Konfiguration: Speichert die Datei im Arbeitsspeicher als Buffer.
export const storage = multer.memoryStorage();
export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Dateigrößenlimit: 5 MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; //erlaubte dateien
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true); // Akzeptiere die Datei
        }
        // Lehne die Datei ab und sende eine Fehlermeldung
        cb(new Error("Fehler: Es werden nur folgende Dateitypen unterstützt: JPEG, JPG, PNG, GIF."));
    }
});

// POST-Route zum Hochladen eines Profilbilds
// 'upload.single('profileImage')' erwartet ein Feld namens 'profileImage' in den FormData des Requests.
router.post('/upload-profile-image', protect, upload.single('profileImage'), async (req: AuthenticatedRequest, res: any) => {
    // Überprüfen, ob überhaupt eine Datei hochgeladen wurde
    if (!req.file) {
        return res.status(400).json({ message: "Keine Datei zum Hochladen ausgewählt." });
    }

    // Überprüfen, ob der Benutzer authentifiziert ist und seine Bild-ID im Request-Objekt vorhanden ist.
    if (!req.user || !req.user.iduser || req.user.image_idimage === undefined) {
        return res.status(401).json({ message: "Benutzer nicht authentifiziert oder Bild-ID fehlt." });
    }

    const imageData = req.file.buffer;       // Binärdaten des Bildes
    const imageMimeType = req.file.mimetype;  // MIME-Typ (z.B. 'image/jpeg')
    const imageName = req.file.originalname;  // Ursprünglicher Dateiname

    try {
        // Rufen Sie die Funktion aus dbQuery.ts auf, um den bestehenden Bilddatensatz zu aktualisieren.
        const updatedImage = await updateImageById(req.user.image_idimage, imageData, imageMimeType, imageName);

        res.status(200).json({
            message: "Profilbild erfolgreich hochgeladen und aktualisiert.",
            imageId: updatedImage.idimage, // Senden Sie die ID des aktualisierten Bildes zurück
        });
    } catch (error) {
        console.error("Fehler beim Hochladen des Profilbilds:", error);
        const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler beim Bild-Upload.";
        res.status(500).json({ message: "Fehler beim Hochladen des Profilbilds.", error: errorMessage });
    }
});

export default router;


