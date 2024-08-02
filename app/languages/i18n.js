import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import azerbaijani from "./azerbaijani.json";
import english from "./english.json";
import russian from "./russian.json";



i18next.use(initReactI18next).init({
    "compatibilityJSON": 'v3',
    "lng":"az",
    "resources": {
        en: english,
        ru: russian ,
        az: azerbaijani,
    },
    "react" : {
        useSuspense: false , 
    }
});

export default i18next; 