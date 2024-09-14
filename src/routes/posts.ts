import { Router, Request, Response } from 'express';
import axios from "axios";
import logger from "../logger";
import authenticateToken from "../auth";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const posts = await axios.get(`${process.env.POSTS_SERVICE}/`);

        if (!!posts.data) {
            logger.debug(`/api/posts/, GET`);
            return res.status(200).send(posts.data);
        } else {
            logger.info(`/api/posts/, GET: Not Found`);
            return res.status(404).send("Not Found");
        }
    } catch (error) {
        logger.error({
            msg: `/api/posts/, GET: Internal Error`,
            error,
        });
        return res.status(500).send("Internal Error");
    }
});

router.post("/", authenticateToken, async (req: any, res) => {
    try {
        const payload: any = {
            title: req.body.title,
            description: req.body.description,
            images: [],
            comments: [],
            likes: 0,
            attributes: req.body.attributes,
            creator: req.user._id
        };

        const post = await axios.post(`${process.env.POSTS_SERVICE}/`, payload);
        logger.debug(`/api/posts/, POST`);
        return res.status(201).send(post.data);
    } catch (error) {
        console.error("Error POST /: creating post", error);
        return res.status(500).json({ message: "Error creating post", error });
    }
});

export default router;
