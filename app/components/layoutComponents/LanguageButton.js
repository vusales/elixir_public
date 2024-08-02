import React, {useEffect, useState} from "react"; 
import { 
    View, 
    StyleSheet
 } from "react-native";
import { useTranslation } from 'react-i18next';
import DropDownPicker from 'react-native-dropdown-picker';
import { Language } from "../../values/constants";
import colors from "../../values/colors";
import helper from "../../helpers/helper";

const LanguageButton = (props) => {
    const {t , i18n} =useTranslation();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState(Language);

    useEffect(()=>{
        changeLang();
    }, [value]); 
    
    const changeLang = async()=>{
        try {
            await props.stores.LanguageStore.getCurrentLang(value);
            await props.stores.HomepageStore.getHomePageData(); 
            await props.stores.FilterDetailsStore.getFilterChoices(); 
            await props.stores.FilterDetailsStore.getFilteredProducts(); 
        }catch(err){
            console.log(err);
        }
        i18n.changeLanguage(value);
    }

    return (
        <View>
            <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            listMode={"SCROLLVIEW"}
            style={styles.dropDown}
            placeholder={"AZ"}
            dropDownMaxHeight={200}
            placeholderStyle={{
                color: colors.text,
            }}
            dropDownContainerStyle={{
                // container
                borderWidth: 1,
                borderColor: colors.border,
                minHeight: helper.px(110),
                width:helper.px(75), 
            }}
            listItemLabelStyle={{
                // all items for choose 
                color: colors.text,
            }}
            />
        </View>
    )

}

const styles =  StyleSheet.create({
    button : {
        padding:20, 
        backgroundColor: "purple",
    }, 
    text: {
        color:"#fff",
        fontSize: 18 , 
    }, 
    dropDown : {
        width:helper.px(75), 
        height: helper.px(10), 
        backgroundColor:"#fff",
        paddingHorizontal:helper.px(10) ,
        // borderWidth: helper.px(0.5),
        // borderColor: colors.border,
        justifyContent: "flex-end",
        marginBottom: helper.px(40),
    }
});

export default helper.mobx(LanguageButton) ;

