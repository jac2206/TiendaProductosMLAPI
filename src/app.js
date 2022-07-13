import express from "express";
import morgan from "morgan";
import compression from "compression";
import errorhandler from "errorhandler";
// import {ObtenerCategorias, ObtenerProductos} from "./Infraestructura/ProductosService.js";
import productosController from "./Controllers/ProductosController.js";


const author = {
    name: "Julian",
    lastname: "Arango Correa"
};

const app = express();

app.use(morgan("common"));
app.use(compression());
app.use('/', productosController);
app.use('/items', productosController);
app.use('/items/:id', productosController);

// app.get('/',(req, res) => {
//     res.send("Api tienda ML para productos")
// })

// app.get("/items", catchUnhandledErrors((req, res) => {
//     let promise;
//     if (req.query.q && req.query.q.trim()) {
//         promise = fetch(`${process.env.API_ML_BUSCADOR_PRODUCTOS}?q=${req.query.q}`).then(response => response.json());
//     } else {
//         promise = Promise.resolve();
//     }
//     return promise
//         .then(data => {
//             let categories = [];
//             let items = [];
//             if (data) {
//                 categories = ObtenerCategorias(data)
//                 items = ObtenerProductos(data.results || []);
//             }
//             res.send({
//                 author,
//                 categories,
//                 items
//             });
//         });
// }));

// app.get("/items/:id", catchUnhandledErrors((req, res) => {
//     return fetch(`${process.env.API_ML_PRODUCTOS_INFO}/items/${req.params.id}`)
//         .then(async response => {
//             if (response.status !== 200) {
//                 return response.text()
//                     .then(body => {
//                         res.status(response.status).send(body);
//                     });
//             } else {
//                 return response.json()
//                     .then(article => {
//                         return Promise.all([
//                             fetch(`${process.env.API_ML_PRODUCTOS_INFO}/items/${article.id}`).then(response => response.json()),
//                             fetch(`${process.env.API_ML_PRODUCTOS_INFO}/items/${article.id}/description`).then(response => response.json())
//                         ])
//                         .then(([ category, description ]) => ([ article, category, description ]));
//                     })
//                     .then(([ article, category, description ]) => {
//                         let categories = (category.path_from_root || [])
//                             .map(path => path.name);
//                         let item = {
//                             id: article.id,
//                             title: article.title,
//                             price: {
//                                 currency: article.currency_id,
//                                 amount: article.available_quantity,
//                                 decimals: article.price
//                             },
//                             picture: article.pictures && article.pictures.length > 0 ? article.pictures[0].url : article.thumbnail,
//                             condition: article.condition,
//                             free_shipping: (article.shipping && article.shipping.free_shipping === true),
//                             sold_quantity: article.sold_quantity,
//                             description: description.plain_text
//                         };
//                         res.send({
//                             author,
//                             categories,
//                             item
//                         });
//                     });
//             }
//         });
// }));

if (process.env.NODE_ENV === "production") {
    app.use((err, req, res, next) => {
        console.error(err);
        res.status(500).send("Upps! Algo salió mal...");
    });
} else {
    app.use(errorhandler());
}

// function catchUnhandledErrors(fn) {
//     return async (req, res, next) => {
//         try {
//             await fn(req, res, next);
//         } catch (err) {
//             await next(err);
//         }
//     };
// }

// function ObtenerCategorias(data){
//     return (data.filters || []).filter(category => category.id === "category")
//             .map(category => category.values
//             .map(value =>  value.path_from_root
//             .map(path => path.name)
//             )
//             .find(() => true))
//             .find(() => true); 
// }

function PruebaMap(result){
    return (result).map(result => result.seller)
    .map(seller => seller.id).slice(0,4)
}

// function ObtenerProductos(result){
//     let items = [];
//     result.slice(0,4)
//         .map(item => {
//             items.push({
//             id: item.id,
//             title: item.title,
//             price:{
//                 currency: item.currency_id,
//                 amount: item.available_quantity,
//                  decimals: item.price
//                 },
//             picture: item.thumbnail,
//             condition: item.condition,
//             free_shipping: (item.shipping && item.shipping.free_shipping === true),
//             location:{
//                     state: item.address.state_name,
//                     city: item.address.city_name
//                 }
//             })
//         });
//     return items
// }

export default app;
