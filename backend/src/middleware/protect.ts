import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from '../config/prisma'; // Prisma Client importieren
import { User } from "@prisma/client"; // Prisma User Typ importieren

interface TokenPayload {
    id: number;
    email: string;
}


interface UserWithoutPassword {
    iduser: number;
    name: string | null;
    firstName: string | null;
    email: string | null;
    birthday: Date | null;
    image_idimage: number;
}

export interface AuthenticatedRequest extends Request {
    user?: UserWithoutPassword;
}

export const protect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ message: "Not authenticated: No token provided" });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error("JWT_SECRET is not set in environment variables.");
        }

        // 1. Token verifizieren und Payload extrahieren
        const decoded = jwt.verify(token, secret) as TokenPayload; // Typ-Assertion zum definierten Payload

        // 2. Benutzer anhand der ID aus der Datenbank abrufen
        // Dies stellt sicher, dass wir die aktuellsten Benutzerdaten haben
        // und dass der Benutzer noch existiert (z.B. nicht gelöscht wurde).
        const user = await prisma.user.findUnique({
            where: { iduser: decoded.id },
            select: {
                iduser: true,
                name: true,
                firstName: true,
                email: true,
                birthday: true,
                image_idimage: true,
                passwort:false
            }
        });

        if (!user) {
            res.status(401).json({ message: "Nicht Authentiert, User nicht gefunden" });
            return;
        }

        // 3. Den vollständigen Benutzer (ohne Passwort) dem Request-Objekt hinzufügen
        req.user = user;

        next(); // Weiter zur Route
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).json({ message: "Nicht Authentiert, User nicht gefunden" });
    }
};