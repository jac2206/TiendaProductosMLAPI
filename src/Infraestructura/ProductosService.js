import {MapperListaProductos} from "../Dominio/Entidades/ListaProductosDTO.js";
import {MapperDetalleProducto} from "../Dominio/Entidades/DetalleProductoDTO.js";


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
    return MapperListaProductos(result.slice(0,4));   
}

function ObtenerDetalleProducto(category, article, description){
    let categories = (category.path_from_root || []).map(path => path.name);
    let item = MapperDetalleProducto(article, description)
    return {categories, item}
}

export { ObtenerCategorias, ObtenerProductos, ObtenerDetalleProducto };


