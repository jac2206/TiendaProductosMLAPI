import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
    swaggerDefinition:{
        openapi : '3.0.0',
        info:{
            title: "Productis MELI API",
            version: '1.0.0',
            description: "API para obtener la informacion de los productos desde MELI",
            contact:{
                name: "Julian Arango Correa",
                url: "https://github.com/jac2206/TiendaProductoML#readme",
                email: "arango773gmail.com",
            }
        },
        servers:[
                {
                    url: "http://localhost:3000",
                    description: 'Entorno de desarrollo de apis'
                },
                {
                    url: "http://tiendaproductosmlapi.azurewebsites.net",
                    description: 'Entorno de producción de apis'                    
                }
        ],
    },
    // apis: ['../Controllers/ProductosController.js']   
    apis: [`${path.join(__dirname, '../Controllers/*.js')}`]   
};

export {swaggerOptions};
