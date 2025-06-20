import express from "express";
import { protect } from "../middleware/protect";
import { addLocation } from "../utils/dbQuery";

const router = express.Router();

router.post("/location",protect, (req:any, res:any)=>{
    const locationName = req.body;
    if(!locationName){
        return res.status(400).json({message: "locationName muss angegeben werden"});
    }
    //await addLocation(locationName);
});


export default router;