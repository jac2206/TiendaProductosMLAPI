import express from "express";
import {ObtenerCategorias, ObtenerProductos, ObtenerDetalleProducto} from "../Infraestructura/ProductosService.js";

const productosController = express.Router();

const author = {
    name: "Julian",
    lastname: "Arango Correa"
};

productosController.get('/',(req, res) => {
    res.send("Api tienda ML para productos")
})

productosController.get("/api/items", catchUnhandledErrors((req, res) => {
    let promise;
    if (req.query.q && req.query.q.trim()) {
        promise = fetch(`${process.env.API_ML_BUSCADOR_PRODUCTOS}?q=${req.query.q}`).then(response => response.json());
    } else {
        promise = Promise.resolve();
    }
    return promise
        .then(data => {
            let categories = [];
            let items = [];
            if (data) {
                categories = ObtenerCategorias(data)
                items = ObtenerProductos(data.results || []);
            }
            res.send({
                author,
                categories,
                items
            });
        });
}));

productosController.get("/api/items/:id", catchUnhandledErrors((req, res) => {
    return fetch(`${process.env.API_ML_PRODUCTOS_INFO}/items/${req.params.id}`)
        .then(async response => {
            if (response.status !== 200) {
                return response.text()
                    .then(body => {
                        res.status(response.status).send(body);
                    });
            } else {
                return response.json()
                    .then(article => {
                        return Promise.all([
                            fetch(`${process.env.API_ML_PRODUCTOS_INFO}/items/${article.id}`).then(response => response.json()),
                            fetch(`${process.env.API_ML_PRODUCTOS_INFO}/items/${article.id}/description`).then(response => response.json())
                        ])
                        .then(([ category, description ]) => ([ article, category, description ]));
                    })
                    .then(([ article, category, description ]) => {
                        let detalleProducto = ObtenerDetalleProducto(category, article, description);   
                        let categories = detalleProducto.categories; 
                        let item = detalleProducto.item                 
                        res.send({
                            author,
                            categories,
                            item
                        });
                    });
            }
        });
}));

function catchUnhandledErrors(fn) {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (err) {
            await next(err);
        }
    };
}

export default productosController;
