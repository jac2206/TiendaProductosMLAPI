function MapperListaProductos(result){
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

export { MapperListaProductos };
