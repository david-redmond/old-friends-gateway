import * as express from 'express';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import * as cors from 'cors';
import * as path from 'path';
import * as bodyParser from "body-parser";
import { config } from 'dotenv';
import userRoutes from './routes/user';
import postsRoutes from './routes/posts';
import authenticateToken from "./auth";

config();

const app = express();
const PORT = process.env.PORT || 8000;

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: true })); // To handle URL-encoded form data
app.use(bodyParser.json()); // To handle JSON data

// Security Middleware
app.use(helmet()); // Sets various HTTP headers to help protect your app
app.use(cors({
    origin: 'https://localhost:3001',
    credentials: true // Allow credentials (cookies) to be included
    }));   // Enables CORS
app.use(express.json()); // Parses incoming JSON requests

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, '../build')));

// API routes
app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/posts', postsRoutes);

// Handle the home route
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Handle 404 errors
app.use((req: Request, res: Response) => {
    res.status(404).send('Not Found');
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
