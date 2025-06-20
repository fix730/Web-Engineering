import express from 'express';
import { protect } from '../middleware/protect';
import { getImageById } from '../utils/dbQuery';
const router = express.Router();

router.get('/:imageId', protect, async (req: any, res: any) => {
    const imageId = parseInt(req.params.imageId, 10); // Extrahieren und Parsen der Bild-ID aus der URL

    if (isNaN(imageId)) {
        return res.status(400).json({ message: "Ungültige Bild-ID." });
    }

    try {
        const image = await getImageById(imageId); // Bilddaten aus der DB abrufen

        if (!image) {
            return res.status(404).json({ message: "Bild nicht gefunden." });
        }

        // Setzen Sie den 'Content-Type'-Header auf den MIME-Typ des Bildes,
        // damit der Browser das Bild korrekt interpretieren kann.
        res.setHeader('Content-Type', image.mimeType);
        res.send(image.imageData);

    } catch (error) {
        console.error("Fehler beim Abrufen des Bildes:", error);
        const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler beim Bild-Abruf.";
        res.status(500).json({ message: "Fehler beim Abrufen des Bildes.", error: errorMessage });
    }
});

export default router;