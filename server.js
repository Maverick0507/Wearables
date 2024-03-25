import express from 'express';
import dotenv from 'dotenv';
import connectDb from './config/db.js';
import morgan from 'morgan';
import authRoute from './routes/authRoute.js';
import categoryRoute from './routes/categoryRoutes.js';
import productRoute from './routes/productRoute.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Connect to the database
connectDb();

// ES module fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' }));

// Define staticPath before using it
const staticPath = path.join(__dirname, 'client','build');
app.use(cors(
  {
    origin:["https://clever-cyan-garb.cyclic.app/"],
    methods:["POST","PUT","GET","DELETE"],
    credentials:true
  }
));
app.use(express.static(staticPath));

// Routes
app.use('/api/v2/auth', authRoute);
app.use('/api/v2/category', categoryRoute);
app.use('/api/v2/product', productRoute);

// Wildcard route for SPA client-side routing
app.use('*', (req, res)=>{
  res.sendFile(path.join(__dirname,'client','build','index.html'));
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
