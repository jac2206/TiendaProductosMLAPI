import express from "express";
import {ObtenerCategorias, ObtenerProductos, ObtenerDetalleProducto} from "../Infraestructura/ProductosService.js";

const productosController = express.Router();

const author = {
    name: "Julian",
    lastname: "Arango Correa"
};

/**
 * @swagger
 * components:
 *  schemas:
 *      ListaProductos: 
 *          type: object
 *          properties:
 *              author:
 *                  type: object
 *                  properties:
 *                      name: 
 *                          type: string
 *                      lastname: 
 *                          type: string
 *              categories:
 *                  type: array
 *                  items:
 *                      type: string
 *              items: 
 *                  type: array
 *                  items: 
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: string
 *                          title: 
 *                              type: string
 *                          price: 
 *                              type: object
 *                              properties:
 *                                  currency:
 *                                      type: string
 *                                  amount:
 *                                      type: string
 *                                  decimals:
 *                                      type: number    
 *              picture:
 *                  type: string
 *              condition:
 *                  type: string
 *              free_shipping:       
 *                  type: boolean
 *              location: 
 *                  type: object
 *                  properties:
 *                      state: 
 *                          type: string
 *                      city: 
 *                          type: string  
 *              sold_quantity: 
 *                  type: number 
 *              description: 
 *                  type: string         
 *          example: {"author":{"name":"Julian","lastname":"Arango Correa"},"categories":["Celulares y Teléfonos","Celulares y Smartphones"],"items":[{"id":"MLA1130313467","title":"Apple iPhone 11 (64 Gb) - Negro","price":{"currency":"ARS","amount":1,"decimals":224000},"picture":"http://http2.mlstatic.com/D_656548-MLA46114829749_052021-I.jpg","condition":"new","free_shipping":true,"location":{"state":"Buenos Aires","city":"Ramos Mejía"}},{"id":"MLA931449399","title":"Apple iPhone 11 (128 Gb) - Negro","price":{"currency":"ARS","amount":3,"decimals":247128},"picture":"http://http2.mlstatic.com/D_865864-MLA46114990464_052021-I.jpg","condition":"new","free_shipping":true,"location":{"state":"Capital Federal","city":"Palermo"}},{"id":"MLA913659191","title":"Apple iPhone SE (2da Generación) 128 Gb - Blanco","price":{"currency":"ARS","amount":1,"decimals":174999},"picture":"http://http2.mlstatic.com/D_963630-MLA46552310340_062021-I.jpg","condition":"new","free_shipping":true,"location":{"state":"Buenos Aires","city":"Villa Lynch"}},{"id":"MLA1109010100","title":"Apple iPhone 13 Pro (256 Gb) - Oro","price":{"currency":"ARS","amount":4,"decimals":475237},"picture":"http://http2.mlstatic.com/D_799292-MLA47779331165_102021-I.jpg","condition":"new","free_shipping":true,"location":{"state":"Capital Federal","city":"Palermo"}}]}
 *      DetalleProductos:
 *          type: object
 *          properties:
 *              author:
 *                  type: object
 *                  properties:
 *                      name: 
 *                          type: string
 *                      lastname: 
 *                          type: string
 *              categories:
 *                  type: array
 *                  items:
 *                      type: string
 *              item:   
 *                  type: object
 *                  properties:
 *                      id: 
 *                          type: string
 *                      title: 
 *                          type: string
 *                      price:  
 *                          type: object        
 *                          properties:
 *                              currency:
 *                                  type: string
 *                              amount:
 *                                  type: number
 *                              decimals:
 *                                  type: number
 *                      picture:
 *                          type: string
 *                      condition:
 *                          type: string
 *                      free_shipping:
 *                          type: boolean
 *                      location:
 *                          type: object    
 *                          properties:
 *                              state:
 *                                  type: string
 *                              city:
 *                                  type: string
 *                      sold_quantity:
 *                          type: number
 *                      description: 
 *                          type: string  
 *          example: {"author":{"name":"Julian","lastname":"Arango Correa"},"categories":[],"item":{"id":"MLA899597750","title":"Sony Playstation 3 Super Slim 250gb Standard  Color Charcoal Black","price":{"currency":"ARS","amount":1,"decimals":57000},"picture":"http://http2.mlstatic.com/D_648159-MLA32731813733_112019-O.jpg","condition":"new","free_shipping":true,"sold_quantity":100,"description":"No solo vas a poder descargar los mejores videojuegos y navegar en la web sin límite, sino que, gracias a su interconectividad global, también vas a tener la posibilidad de competir en línea con tus amigos y con personas de todas partes del mundo disfrutando de aventuras inolvidables.\n\nCalidad de otro nivel\nVas a poder reproducir música, ver tus películas y series favoritas a través de las aplicaciones descargables. \n\nDiseño innovador\nNo solo esto, el control DualShock combina funciones revolucionarias y sin precedentes mientras conserva precisión, comodidad y exactitud en cada movimiento.\n\nAdaptada a tus necesidades\nGuardá tus apps, fotos, videos y mucho más en el disco duro, que cuenta con una capacidad de 250 GB.\nPor otro lado, tiene puerto USB y salida HDMI, que permiten conectar accesorios y cargar la batería de tu control mientras jugás."}}              
 */

productosController.get('/',(req, res) => {
    res.send("Api tienda ML para productos")
})

/**
 * @swagger
 * /api/items:
 *   get:
 *     description: Obtener lista cuatro productos
 *     parameters:
 *      - name: q
 *        description: Nombre del producto del buscador 
 *        in: query
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Success
 *         content: 
 *              application/json:
 *                  schema: 
 *                      $ref: '#/components/schemas/ListaProductos'
 */
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

/**
 * @swagger
 * /api/items/{id}:
 *   get:
 *     description: Obtener detalle producto seleccionado
 *     parameters:
 *      - name: id
 *        description: Id del producto que se quera ver el detalle
 *        in: path
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: Success
 *         content: 
 *              application/json:
 *                  schema: 
 *                      $ref: '#/components/schemas/DetalleProductos'
 */
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
