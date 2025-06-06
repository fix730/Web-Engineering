import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
    user?: any;
}

export const protect = (req: AuthenticatedRequest,res: Response,next: NextFunction): void => {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET missing");

        const decoded = jwt.verify(token, secret);
        req.user = decoded;

        next(); //weiter zur Funktion
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
}