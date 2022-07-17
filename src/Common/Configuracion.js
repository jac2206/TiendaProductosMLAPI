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
    apis: [`${path.join(__dirname, '../Controllers/*.js')}`]
};

export {swaggerOptions};
