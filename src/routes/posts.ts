import { Router, Request, Response } from 'express';
import axios from "axios";
import logger from "../logger";

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

router.post("/", async (req: any, res) => {
    try {
        const { name, attributes, description, comments } = req.body;

        // Creating a FormData object to handle the file upload
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('attributes', attributes);
        formData.append('comments', comments);

        console.log(req.body);
        console.log(req.files);

        // const images = req.files.map((file: any) => ({
        //     type: file.mimetype,
        //     path: file.path,
        // }));

        // Appending images to formData
        // images.forEach((image: any) => formData.append('images', image));

        const post = await axios.post(`${process.env.POSTS_SERVICE}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Required header for file uploads
            },
        });
        logger.debug(`/api/posts/, POST`);
        return res.status(201).json(post);
    } catch (error) {
        console.error("Error POST /: creating post", error);
        return res.status(500).json({ message: "Error creating post", error });
    }
});

export default router;
