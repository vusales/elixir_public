import helper from "../helpers/helper"; 

export default class BrandsEntity {
    constructor(data){
        return data.reduce((items , item )=>{
            return [
                ...items , 
                {
                    "href": item.href , 
                    "blackImage":  item.image,
                    "id": item.manufacturer_id ,
                    "name": item.name ,
                    "whiteImage" : item.second_image , 
                }
            ]
        }, []); 
    }
}