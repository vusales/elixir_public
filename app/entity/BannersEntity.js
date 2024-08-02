import helper from "../helpers/helper"; 

export default class BannersEntity {
    constructor(data){
        return data.reduce((items , item )=>{
            return [
                ...items , 
                {
                    image:item.image ,
                    link: item.link , 
                    title: item.title , 
                }
            ]
        }, []); 
    }
}