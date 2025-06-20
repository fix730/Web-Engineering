import express from "express";
import { protect } from "../middleware/protect";
import { addLocation, getAllLocation } from "../utils/dbQuery";

const router = express.Router();

router.get("/location",protect, async (req:any, res:any)=>{
   try {
        const locations = await getAllLocation();
        return res.status(200).json(locations);
    } catch (error) {
        console.error("Fehler beim Abrufen der Locations:", error);
        return res.status(500).json({ message: "Interner Serverfehler beim Abrufen der Locations." });
    }
});

router.post("/new",protect, async(req:any, res:any)=>{
    
});


export default router;