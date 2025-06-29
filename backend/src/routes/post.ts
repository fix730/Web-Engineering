import express from "express";
import { protect } from "../middleware/protect";
import { addComment, addLikePost, addLocation, deleteLikePost, deletePost, getAllLocation, getImageById, getLikesByPostId, getLikesByUserIdPost, getPostComment, newPost, showAllPosts, showFilterPosts, showLikedUser, showPost, showUserPosts, updatePost } from "../utils/dbQuery";
import { upload } from "./user";


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

    const { locationName, title, description, start_time, end_time } = req.body;

    if (!locationName || !title || !description || !start_time || !end_time) {
        return res.status(404).json({ message: "Fehlende Übergabeparameter im Body" });
    }

    if (!req.file) {
        return res.status(400).json({ message: "Keine Bilddatei für den Post ausgewählt oder Upload fehlgeschlagen." });
    }

    const imageData = req.file.buffer;       // Binärdaten des Bildes
    const imageMimeType = req.file.mimetype;  // MIME-Typ (z.B. 'image/jpeg')
    const imageName = req.file.originalname;  // Ursprünglicher Dateiname

    try {
        const dateStart_time = new Date(start_time);
        const dateEnde_time = new Date(end_time)

        const post = await newPost(user.iduser, locationName, title, description, imageData, imageMimeType, imageName, start_time, end_time);

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
        const isLiked = await getLikesByUserIdPost(Number(user.iduser), numPostId);
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
        return res.status(404).json({ message: "Fehlende Übergabeparameter" });
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

router.get("/one", protect, async (req: any, res: any) => {
    const { postId } = req.query;
    if (!postId) {
        return res.status(404).json({ message: "Fehlende Übergabeparameter bei den Paramertern (postId fehlt)" });
    }
    const numPostId = Number(postId);
    try {
        const post = await showPost(numPostId);
        res.status(200).json({
            post: post
        });
    } catch (error) {
        console.error("Fehler beim Abrufen des Posts:", error);
        return res.status(500).json({ message: "Interner Serverfehler beim Abrufen des Posts." });
    }
});

router.patch("/", protect, upload.single('imagePost'), async (req: any, res: any) => {
    const user = req.user;
    const data = req.body;

    if (!user || !user.iduser) {
        return res.status(401).json({ message: "Benutzer nicht authentifiziert" });
    }
    if (!data.postId) {
        return res.status(404).json({ message: "Fehlende Übergabeparameter bei den Paramertern (postId fehlt)" });
    }

    let change = false;
    let locationName;
    let title;
    let description;
    let imageData;
    let imageMimeType;
    let imageName;
    let start_time;
    let end_time;

    let newPost;
    try {
        const currentPost = await showPost(Number(data.postId));
        // console.log("currentPost.user_iduser:"+ Number(currentPost.user_iduser));
        //Überprüfen ob Benutzer berechtigt ist
        if (currentPost.user?.iduser != user.iduser) {
            return res.status(403).json({
                message: "Sie sind nicht der Eigentümer des Posts, daher nicht berechtigt.",
                // currentPostuser_iduser: currentPost.user_iduser,
                // useriduser: user.iduser,
                // post: currentPost
            })
        }
        if (!data.locationName) {
            locationName = currentPost.locationName;
        } else {
            change = true;
            locationName = data.locationName
        }
        if (!data.title) {
            title = currentPost.title;
        } else {
            change = true;
            title = data.title;
        }
        if (!data.description) {
            description = currentPost.description;
        } else {
            change = true;
            description = data.description;
        }
        if(!data.start_time){
            start_time = currentPost.start_time;
        }else{
            change=true;
            start_time = new Date(data.start_time);
        }
        if(!data.end_time){
            end_time = currentPost.end_time;
        }else{
            change=true;
            end_time = new Date(data.end_time);
        }

        // Sicherstellen start_time und end_time sosnt gibt es einen TS Fehler
        if (!(start_time instanceof Date) || isNaN(start_time.getTime())) {
            start_time = null;
        }
        if (!(end_time instanceof Date) || isNaN(end_time.getTime())) {
            end_time = null;
        }

        if (!req.file) {
            if(!change){
                return res.status(200).json({ message: "Keine Änderungen erkannt oder übermittelt." });
            }
            newPost = await updatePost(Number(data.postId), title, title, description, currentPost.idpost || 1, start_time, end_time);
        } else {
            imageData = req.file.buffer;
            imageMimeType = req.file.mimetype;
            imageName = req.file.originalname;
            newPost = await updatePost(Number(data.postId), title, title, description, currentPost.idpost || 1, start_time, end_time, imageData, imageMimeType, imageName);
        }

        res.status(200).json({
            message: "Post erfolgreich in DB aktualisiert.",
            post: newPost
        });
    } catch (error) {
        console.error("Fehler beim Updaten des Posts:", error);
        return res.status(500).json({ message: "Interner Serverfehler beim Updaten des Posts." });
    }


});

router.delete("/", protect, async (req: any, res: any) => {
    const { postId } = req.query;
    const user = req.user;
    if (!postId) {
        return res.status(404).json({ message: "Fehlende Übergabeparameter" });
    }
    if (!user || !user.iduser) {
        return res.status(401).json({ message: "Benutzer nicht authentifiziert" });
    }
    try {
        const currentPost = showPost(Number(postId));
        //Überprüfen ob Benutzer berechtigt ist
        if ((await currentPost).user?.iduser != user.iduser) {
            return res.status(403).json({
                message: "Sie sind nicht der Eigentümer des Posts, daher nicht berechtigt."
            })
        };
        deletePost(Number(postId));
        res.status(200).json({
            message: "Post erfolgreich in DB gelöscht"
        });
    } catch (error) {
        console.error("Fehler beim Löschen des Posts:", error);
        return res.status(500).json({ message: "Interner Serverfehler beim Löschen des Posts." });
    }

});

router.get("/like/users", protect, async (req: any, res: any) => {
    const { postId } = req.query;
    if (!postId) {
        return res.status(404).json({ message: "Fehlende Übergabeparameter bei den Paramertern (postId fehlt)" });
    }
    const numPostId = Number(postId);
    try {
        const users = await showLikedUser(numPostId);
        res.status(200).json({
            users: users
        });
    } catch (error) {
        console.error("Fehler beim Abrufen der Users:", error);
        return res.status(500).json({ message: "Interner Serverfehler beim Abrufen der Users." });
    }
}
);

router.get("/user", protect, async (req:any, res: any)=>{
    const user = req.user;
    if (!user || !user.iduser) {
        return res.status(401).json({ message: "Benutzer nicht authentifiziert" });
    }

    const iduser = Number(user.iduser);
    try {
        const posts = await showUserPosts(iduser);
        // console.log(posts);
        res.status(200).json({
            posts: posts
        });
    } catch (error) {
        console.error("Fehler beim Abrufen des Posts:", error);
        return res.status(500).json({ message: "Interner Serverfehler beim Abrufen des Posts." });
    }

});

export default router;