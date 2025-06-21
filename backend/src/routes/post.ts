import express from "express";
import { protect } from "../middleware/protect";
import { addComment, addLikePost, addLocation, deleteLikePost, getAllLocation, getLikesByPostId, getLikesByUserIdPost, getPostComment, newPost, showAllPosts, showFilterPosts } from "../utils/dbQuery";
import { upload } from "./user";
import { timeStamp } from "console";
import { text } from "stream/consumers";

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
        });

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

router.post("/comment", protect, async (req: any, res: any) => {
    const user = req.user;

    if (!user || !user.iduser) {
        return res.status(401).json({ message: "Benutzer nicht authentifiziert" });
    }
    //console.log(user.iduser);
    const { postId, text } = req.body;

    if (!postId || !text) {
        return res.status(404).json({ message: "Fehlende Übergabeparameter im Body" });
    }
    const numUserId = Number(user.iduser);
    const numPostId = Number(postId);

    try {
        const comment = await addComment(numPostId, numUserId, text);

        res.status(200).json({
            message: "neuer Kommentar erfolgreich in DB gespeichert",
            idComment: comment.idcomment
        });
    } catch (error) {
        console.error("Fehler beim Erstelen des Kommentars:", error);
        return res.status(500).json({ message: "Interner Serverfehler Erstelen des Kommentars." });
    }
});

router.get("/comment", protect, async (req: any, res: any) => {
    const { postId } = req.query;
    if (!postId) {
        return res.status(404).json({ message: "Fehlende Übergabeparameter bei den Paramertern (postId fehlt)" });
    }

    const numPostId = Number(postId);
    try {
        const comments = await getPostComment(numPostId);
        res.status(200).json({
            comments: comments
        });
    } catch (error) {
        console.error("Fehler beim Abrufen der Kommentare:", error);
        return res.status(500).json({ message: "Interner Serverfehler beim Abrufen der Kommentare." });
    }

});



router.get("/like/count", protect, async (req: any, res: any) => {
    const { postId } = req.query;
    if (!postId) {
        return res.status(404).json({ message: "Fehlende Übergabeparameter bei den Paramertern (postId fehlt)" });
    }

    const numPostId = Number(postId);
    try {
        const likes = await getLikesByPostId(numPostId);
        res.status(200).json({
            likes: likes
        });
    } catch (error) {
        console.error("Fehler beim Abrufen der Likes:", error);
        return res.status(500).json({ message: "Interner Serverfehler beim Abrufen der Likes." });
    }
});

router.get("/like/byUser", protect, async (req: any, res: any) => {
    const user = req.user;
    if (!user || !user.iduser) {
        return res.status(401).json({ message: "Benutzer nicht authentifiziert" });
    }
    const { postId } = req.query;
    if (!postId) {
        return res.status(404).json({ message: "Fehlende Übergabeparameter bei den Paramertern (postId fehlt)" });
    }
    const numPostId = Number(postId);
    try {
        const isLiked = await getLikesByUserIdPost( Number(user.iduser), numPostId);
        res.status(200).json({
            isLiked: isLiked
        }); 
    } catch (error) {
        console.error("Fehler beim Abrufen der Likes:", error);
        return res.status(500).json({ message: "Interner Serverfehler beim Abrufen der Likes." });
    }
}
);

router.delete("/like", protect, async (req: any, res: any) => {
    const user = req.user;
    if (!user || !user.iduser) {
        return res.status(401).json({ message: "Benutzer nicht authentifiziert" });
    }
    const { postId } = req.query;
    if (!postId) {
        return res.status(404).json({ message: "Fehlende Übergabeparameter im Body" });
    }
    const numPostId = Number(postId);
    try {
        await deleteLikePost(numPostId, Number(user.iduser));
        res.status(200).json({
            message: "Like erfolgreich in DB gelöscht",
            postId: numPostId
        });
    } catch (error) {
        console.error("Fehler beim Löschen des Likes:", error);
        return res.status(500).json({ message: "Interner Serverfehler beim Löschen des Likes." });
    }
}
);

router.post("/like", protect, async (req: any, res: any) => {
    
    const user = req.user;
    if (!user || !user.iduser) {
        return res.status(401).json({ message: "Benutzer nicht authentifiziert" });
    }
    const { postId } = req.body;
    if (!postId) {
        return res.status(404).json({ message: "Fehlende Übergabeparameter im Body" });
    }
    console.log("PostId:", postId);
    const numPostId = Number(postId);
    console.log("PostIdNum:", numPostId);
    
    try {
        addLikePost(numPostId, Number(user.iduser));
        res.status(200).json({
            message: "Like erfolgreich in DB gespeichert",
            postId: numPostId
        });
    } catch (error) {
        console.error("Fehler beim Speichern des Likes:", error);
        return res.status(500).json({ message: "Interner Serverfehler beim Speichern des Likes." });
    }
}
);

export default router;