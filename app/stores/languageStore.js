import {  makeAutoObservable, runInAction } from 'mobx';


class LanguageStore {

    language = "az";
    

    constructor() {
        makeAutoObservable(this);
    }
    
    getCurrentLang = (lang) => {
        runInAction(()=>{
            this.language =  lang ; 
        });
    };
}

const languageStore = new LanguageStore();

export default languageStore;