import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

    const authHeader = req.headers["authorization"];

    console.log("Auth Header: ", authHeader);

    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Auth Token missing" });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET);
    if (!data) {
        return res.status(401).json({ message: "Invalid Token" });
    }
    req.user = data;
    next();

}