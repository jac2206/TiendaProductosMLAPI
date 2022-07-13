import express from "express";
import morgan from "morgan";
import compression from "compression";
import errorhandler from "errorhandler";
import productosController from "./Controllers/ProductosController.js";
import cors from "cors"

const app = express();

app.set('port', process.env.PORT || 3000)

app.use(cors());
app.use(morgan("common"));
app.use(compression());
app.use('/', productosController);
app.use('/api/items', productosController);
app.use('/api/items/:id', productosController);

if (process.env.NODE_ENV === "production") {
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).send("Upps! Algo salió mal...");
    });
} else {
    app.use(errorhandler());
}

export default app;
