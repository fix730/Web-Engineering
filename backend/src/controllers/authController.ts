import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

let currentUser: any = null;

export const createToken = (user: any): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "1h";

  if (!secret) {
    throw new Error("JWT_SECRET is not set");
  }

  return jwt.sign(
    { id: user.id, email: user.email },
    secret,
    {
      expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
    }
  );
};

export const registerUser: RequestHandler = (req, res) => {
    const { name, firstName, email, password, birthday } = req.body;

    currentUser = {
        id: "123",
        name,
        firstName,
        email,
        password,
        birthday,
    };

    const token = createToken(currentUser);
    res
        .status(201)
        .cookie("token", token, { httpOnly: true })
        .json({ user: currentUser });
};

export const authenticateUser: RequestHandler = (req:any, res:any) => {
    const { email, password } = req.body;

    if (currentUser && currentUser.email === email && password === currentUser.password) {
        const token = createToken(currentUser);
        return res
            .status(200)
            .cookie("token", token, { httpOnly: true })
            .json({ user: currentUser });
    }

    return res.status(401).json({ message: "Invalid credentials" });
};

export const logoutUser: RequestHandler = (req, res) => {
    res.clearCookie("token");
    //currentUser = null;
    res.status(200).json({ message: "User logged out" });
};