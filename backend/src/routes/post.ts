import express from "express";
import { protect } from "../middleware/protect";
import { addLocation, getAllLocation, newPost, showAllPosts, showFilterPosts } from "../utils/dbQuery";
import { upload } from "./user";
import { timeStamp } from "console";

const router = express.Router();

router.get("/location", protect, async (req: any, res: any) => {
    try {
        const locations = await getAllLocation();
        return res.status(200).json(locations);
    } catch (error) {
        console.error("Fehler beim Abrufen der Locations:", error);
        return res.status(500).json({ message: "Interner Serverfehler beim Abrufen der Locations." });
    }
});

router.post("/new", protect, upload.single('imagePost'), async (req: any, res: any) => {
    const user = req.user;

    if (!user || !user.iduser) {
        return res.status(401).json({ message: "Benutzer nicht authentifiziert" });
    }

    const { locationName, title, description } = req.body;

    if (!locationName || !title || !description) {
        return res.status(404).json({ message: "Fehlende Übergabeparameter im Body" });
    }

    if (!req.file) {
        return res.status(400).json({ message: "Keine Bilddatei für den Post ausgewählt oder Upload fehlgeschlagen." });
    }

    const imageData = req.file.buffer;       // Binärdaten des Bildes
    const imageMimeType = req.file.mimetype;  // MIME-Typ (z.B. 'image/jpeg')
    const imageName = req.file.originalname;  // Ursprünglicher Dateiname

    try {
        const post = await newPost(user.iduser, locationName, title, description, imageData, imageMimeType, imageName);

        res.status(200).json({
            message: "neuer Post erfolgreich in DB gespeichert",
            idPost: post.idpost
        })

    } catch (error) {
        console.error("Fehler beim Hochladen des Posts:", error);
        const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler beim Posts.";
        res.status(500).json({ message: "Fehler beim Hochladen des Posts.", error: errorMessage });

    }
});

router.get("/all", protect, async (req: any, res: any) => {
    try {
        const posts = await showAllPosts();

        res.status(200).json({
            posts: posts
        });
    } catch (error) {
        console.error("Fehler beim Abrufen der Posts:", error);
        return res.status(500).json({ message: "Interner Serverfehler beim Abrufen der Posts." });
    }
})

router.get("/search", protect, async (req: any, res: any) => {
    //console.log(req.body);
    const { locations, title } = req.query;
    console.log(req.query);
    let locationsInNumber: number[] = [];
    if (locations) {
        if (Array.isArray(locations)) {
            locationsInNumber = locations.map((location: string) => Number(location));
        } else if (typeof locations === 'string') {
            locationsInNumber = locations.split(',').map((location: string) => Number(location));
        }
    }
    console.log(locationsInNumber);
    try {
        const posts = await showFilterPosts(locationsInNumber, title);
        res.status(200).json({
            posts: posts
        });
    } catch (error) {
        console.error("Fehler beim Abrufen der Posts:", error);
        return res.status(500).json({ message: "Interner Serverfehler beim Abrufen der Posts." });
    }
});


export default router;