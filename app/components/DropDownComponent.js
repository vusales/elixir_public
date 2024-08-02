import React,  {useEffect, useMemo, useState ,  } from "react";
import {View , Text ,  StyleSheet  , TouchableOpacity , ScrollView , ImageBackground , Pressable   } from "react-native"; 
import Modal from "react-native-modal";
import helper from "../helpers/helper";
import colors from "../values/colors";
import DropDownPicker from 'react-native-dropdown-picker';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useNavigation } from '@react-navigation/native';
import FilterCheckboxComponnet from "../components/FilterCheckBoxComponent";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import i18next from "i18next";

const DropDownComponent = ({
    drItems , 
    drTitle  , 
    getDropDownValue , 
    drZindex ,
  
}) => {
    // placeHolder
    const choose = helper.translate("choose");
    const searchDropdownText = helper.translate("searchdropdowntext");
    // ***********

    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);


    useEffect(()=>{
        if(drItems.length){
            setItems(drItems); 
        }
    }, []); 


    useEffect(()=> {
        getDropDownValue(value);
    },[value]); 

    return  (
    <View  style={{
        marginTop: helper.px(30) ,
        position:"relative",
        ziIndex: 2000 ,
    }}>
        <Text style={styles.subTitle}>{drTitle}</Text>
        <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        listMode={"SCROLLVIEW"}
        searchable={true}
        searchPlaceholderTextColor={colors.border}
        searchContainerStyle={{
            borderBottomWidth: helper.px(0),
            borderWidth: 0, 
        }}
        searchTextInputStyle={{
            borderColor: colors.border ,
            color: colors.text , 
        }}
        closeOnBackPressed={true}
        dropDownDirection="TOP"
        style={styles.dropDown}
        placeholder={choose}
        searchPlaceholder={searchDropdownText}
        dropDownMaxHeight={200}
        zIndex={drZindex}
        placeholderStyle={{
            color: colors.text,
        }}
        dropDownContainerStyle={{
            // container
            borderWidth: 1,
            borderColor: colors.border,
            minHeight: 150,
        }}
        listItemLabelStyle={{
            // all items for choose 
            color: colors.text,
        }}
        />
    </View>
)};


const styles =  StyleSheet.create({
    subTitle: {
        fontFamily:helper.fontFamily("Bold"),
        fontSize: helper.px(18), 
        fontWeight: "600", 
        lineHeight:helper.px(22),
        color: colors.text,
        marginBottom: helper.px(20) ,
    },
    dropDown:{
        borderColor: colors.border, 
        borderRadius: helper.px(0),
        // marginBottom:helper.px(30),
    },
});

export default DropDownComponent;