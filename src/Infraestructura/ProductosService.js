function ObtenerCategorias(data){
    return (data.filters || []).filter(category => category.id === "category")
            .map(category => category.values
            .map(value =>  value.path_from_root
            .map(path => path.name)
            )
            .find(() => true))
            .find(() => true); 
}

function ObtenerProductos(result){
    let items = [];
    result.slice(0,4)
        .map(item => {
            items.push({
            id: item.id,
            title: item.title,
            price:{
                currency: item.currency_id,
                amount: item.available_quantity,
                 decimals: item.price
                },
            picture: item.thumbnail,
            condition: item.condition,
            free_shipping: (item.shipping && item.shipping.free_shipping === true),
            location:{
                    state: item.address.state_name,
                    city: item.address.city_name
                }
            })
        });
    return items
}

function ObtenerDetalleProducto(category, article, description){
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
    return {categories, item}
}

export { ObtenerCategorias, ObtenerProductos, ObtenerDetalleProducto };


