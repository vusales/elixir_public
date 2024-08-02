import helper from "../helpers/helper"; 

export default class DiscountedProductsEntity {
    constructor(data){
        return data.reduce((items , item )=>{
            return [
                ...items , 
                {
                    cardImage: item.bimage,
                    description: item.description,
                    excerpt: item.excerpt,
                    href: item.href,
                    name:item.name,
                    options: item.options , 
                    price: item.price , 
                    product_id: item.product_id , 
                    discountPrice: item.special , 
                    detailsImage: item.bimage , 
                }
            ]
        }, []); 
    }
}