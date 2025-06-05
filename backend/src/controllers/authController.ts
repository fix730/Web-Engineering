import { RequestHandler } from "express";

let currentUser: any = null;

export const registerUser: RequestHandler = (req, res) => {
    const { name, firstName, email, password, birthday } = req.body;

    currentUser = {
        id: "123",
        name,
        firstName,
        email,
        birthday,
    };

    res.status(201).json(currentUser);
};

export const authenticateUser: RequestHandler = (req:any, res:any) => {
    const { email, password } = req.body;

    console.log(email + " " + password);

    if (currentUser && currentUser.email === email && password === "test123") {
        return res.status(200).json(currentUser);
    }

    return res.status(401).json({ message: "Invalid credentials" });
};

export const logoutUser: RequestHandler = (req, res) => {
    currentUser = null;
    res.status(200).json({ message: "User logged out" });
};
