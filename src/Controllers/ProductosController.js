import express from "express";
import morgan from "morgan";
import compression from "compression";
import errorhandler from "errorhandler";
import {ObtenerCategorias, ObtenerProductos} from "../Infraestructura/ProductosService.js";

const productosController = express.Router();
// app.use(morgan("common"));
// app.use(compression());

const author = {
    name: "Julian",
    lastname: "Arango Correa"
};

productosController.get('/',(req, res) => {
    res.send("Api tienda ML para productos")
})

productosController.get("/items", catchUnhandledErrors((req, res) => {
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

productosController.get("/items/:id", catchUnhandledErrors((req, res) => {
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
                        let categories = (category.path_from_root || [])
                            .map(path => path.name);
                        let item = {
                            id: article.id,
                            title: article.title,
                            price: {
                                currency: article.currency_id,
                                amount: article.available_quantity,
                                decimals: article.price
                            },
                            picture: article.pictures && article.pictures.length > 0 ? article.pictures[0].url : article.thumbnail,
                            condition: article.condition,
                            free_shipping: (article.shipping && article.shipping.free_shipping === true),
                            sold_quantity: article.sold_quantity,
                            description: description.plain_text
                        };
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
