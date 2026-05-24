import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);

const mongoInstance = async () => {
    try {
        if (!MONGO_URL) {
            throw new Error("Falta la variable MONGO_URL en la nube de Railway");
        }
        await mongoose.connect(MONGO_URL);
        console.log("Conexión exitosa a MongoDB Atlas");
    } catch (error) {
        console.error("Error crítico de conexión a la base de datos:");
        console.error(error);
        process.exit(1);
    }
};


if (process.env.NODE_ENV !== 'test') {
    mongoInstance();
    app.listen(PORT, () => {
        console.log(`Servidor escuchando exitosamente en el puerto ${PORT}`);
    });
}

export default app;