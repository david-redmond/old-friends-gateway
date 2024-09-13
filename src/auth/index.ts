import { JwtPayload, verify } from "jsonwebtoken";
import {Request, Response, NextFunction} from "express"

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied. No token provided.');
    verify(token, process.env.SECRET_KEY, (err: Error, user: JwtPayload) => {
        if (err) {
            return res.status(403).send('Invalid token.');
        }
        req.user = user;
        next();
    });
};

export default authenticateToken;