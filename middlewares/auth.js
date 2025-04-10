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
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }


}