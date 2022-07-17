import express from "express";
import morgan from "morgan";
import compression from "compression";
import errorhandler from "errorhandler";
import productosController from "./Controllers/ProductosController.js";
import cors from "cors"
import swaggerJsDoc from "swagger-jsdoc"
import swaggerUI from 'swagger-ui-express'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express();

app.set('port', process.env.PORT || 3000)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
    swaggerDefinition:{
        openapi : '3.0.0',
        info:{
            title: "Productis MELI API",
            version: '1.0.0',
        },
        servers:[
                {
                    url: "http://localhost:3000"
                },
                {
                    url: "http://tiendaproductosmlapi.azurewebsites.net"
                }
        ],
    },
    apis: [`${path.join(__dirname, './Controllers/*.js')}`]
};

app.use(cors());
app.use(morgan("common"));
app.use(compression());
app.use('/', productosController);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerOptions)));
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
