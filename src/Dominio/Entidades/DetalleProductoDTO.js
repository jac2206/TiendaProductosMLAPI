function MapperDetalleProducto(article, description){
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
    return item
}

export { MapperDetalleProducto };