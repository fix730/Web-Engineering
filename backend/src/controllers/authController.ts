import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import prisma from '../config/prisma';
import { User, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

// let currentUser: any = null;

export const createToken = (user: any): string => { // user ist hier das Objekt mit den User-Daten
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  // Hier wird der individuelle Token erstellt
  return jwt.sign(
    { id: user.iduser, email: user.email }, // <-- Payload: iduser und email sind individuell
    secret,
    {
      expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
    }
  );
};

export const registerUser: RequestHandler = async (req: any, res: any) => {
  const { name, firstName, email, password, birthday } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-Mail und Passwort sind erforderlich.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUserImage = await prisma.image.create({
      data: {
        image_data: null,
      },
      select: {
        idimage: true,
      }
    });
    const newUser = await prisma.user.create({
      data: {
        name: name || null,
        firstName: firstName || null,
        birthday: birthday ? new Date(birthday) : null,
        image_idimage: newUserImage.idimage,
        passwort: hashPassword,
        email: email
      },
      // Wähle aus, welche Felder des neuen Benutzers zurückgegeben werden sollen
      select: {
        iduser: true,
        name: true,
        firstName: true,
        email: true,
        birthday: true,
        image_idimage: true,
        passwort: false,
      }
    });
    const token = createToken(newUser);
    res
      .status(201)
      .cookie("token", token, { httpOnly: true })
      .json({ user: newUser });

  } catch (error) {
    // Fehlerbehandlung
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002 ist der Fehlercode für einen Unique-Constraint-Fehler
      // Das bedeutet, dass die E-Mail wahrscheinlich schon existiert
      if (error.code === 'P2002') {
        return res.status(409).json({ message: 'Die angegebene E-Mail-Adresse ist bereits registriert.' });
      }
    }
    console.error('Fehler bei der Benutzerregistrierung:', error);
    res.status(500).json({ message: 'Registrierung fehlgeschlagen. Interner Serverfehler.' });
  }
};

export const authenticateUser: RequestHandler = async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-Mail und Passwort sind erforderlich.' });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: email }
    });
    if (!user) {
      return res.status(401).json({ message: 'Ungültige Anmeldeinformationen (E-Mail nicht gefunden).' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwort || '');
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Ungültige Anmeldeinformationen (Passwort inkorrekt).' });
    }
    const token = createToken(user);
    return res
      .status(200)
      .cookie("token", token, { httpOnly: true })
      .json({ user: user });
  } catch (error) {
    console.error('Login-Fehler:', error);
    res.status(500).json({ message: 'Login fehlgeschlagen. Interner Serverfehler.' });
  }
};

export const logoutUser: RequestHandler = (req, res) => {
  //Token Client Seite Löschen
  res.clearCookie("token"); //weist den Browser des Benutzers an, das spezifische Cookie mit dem Namen "token" zu löschen
  res.status(200).json({ message: "User logged out" });
};