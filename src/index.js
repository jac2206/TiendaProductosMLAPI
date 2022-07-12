const express = require('express');
const app = express();

app.listen(3000, () =>{
    console.log("Servidor arriba") 
})

app.get('/',(req, res) => {
    res.send("Hello Word")
})

app.get('/json',(req, res) => {
    res.send(
        {
            Autor: "Julian",
            Apellido: "Arango"
        }
    )
})