import jest from 'jest'
import productosController from "../Controllers/ProductosController.js";
import app from "../app"
import request from "supertest";

describe('GET controllers',() => {

    test('Prueba test status 200', async () => {
        const response = await request(app).get('/').send()
        expect(response.statusCode).toBe(200)
    })

    test('Test item search sin producto', async () => {
        const response = await request(app).get('/api/items').send()
        expect(response.body.author).toStrictEqual({
            name: 'Julian',
            lastname: 'Arango Correa', 
        })
        expect(response.body.categories).toStrictEqual([]);
        expect(response.body.items).toStrictEqual([]);
    })
})