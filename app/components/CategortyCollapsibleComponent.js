import React,  {useEffect, useMemo, useState ,  } from "react";
import {View , Text ,  StyleSheet  , TouchableOpacity , ScrollView , ImageBackground , Pressable   } from "react-native"; 
import helper from "../helpers/helper";
import colors from "../values/colors";
import Collapsible from 'react-native-collapsible'; 
import AntDesign from "react-native-vector-icons/AntDesign"; 


const CategortyCollapsibleComponent = ({
    setSubCategory , 
    subCategories , 
    subCategory ,
}) => {

    let subCatName =  helper.translate("subcat"); 

    const [ isCollapsed , setCollapsed  ] = useState(false); 
    const [ buttonColor , setButtonColor  ] = useState(false); 

    useEffect(()=>{
        if(subCategory){
            setButtonColor(subCategory);
        }
    },[]);

    const collapsButtonPress = () => {
        setCollapsed(!isCollapsed) ;
    }

    const chooseSubCategory = (id) => {
        setSubCategory(id); 
        setButtonColor(id)
    }
     
return (
    <>
        <TouchableOpacity 
        onPress={()=>collapsButtonPress()}
        style={styles.collapBtn}
        >
            <Text style={styles.subTitle} >{subCatName}</Text>
            <AntDesign name={isCollapsed? "down" : "up" } size={16} color={colors.text} />
        </TouchableOpacity>
        <Collapsible 
        collapsed={isCollapsed}
        style={styles.collapsibleContainer}
        >
            {
                subCategories.map((item , index)=>(
                    <TouchableOpacity
                    key={index}
                    onPress={()=>chooseSubCategory(item?.category_id)}
                    style={styles.subsBtn}
                    >
                        <Text style={buttonColor === item?.category_id ? {...styles.checboxText , fontWeight: "700" } : styles.checboxText } >
                            {item?.name}
                        </Text>
                    </TouchableOpacity>
                ))
            }
        </Collapsible>
    </>
)
};

const styles = StyleSheet.create({
    subTitle: {
        fontFamily:helper.fontFamily("Bold"),
        fontSize: helper.px(18), 
        fontWeight: "600", 
        lineHeight:helper.px(22),
        color: colors.text,
        marginBottom: helper.px(16) ,
    }, 
    checboxText:{
        color: colors.text, 
        fontFamily:helper.fontFamily(),
        fontSize: helper.px(16), 
        fontWeight:"400", 
        lineHeight:helper.px(20), 
    },
    collapsibleContainer: {
        paddingHorizontal:  helper.px(16) ,
        // paddingBottom: helper.px(16) ,
    }, 
    collapBtn: {
        justifyContent: "space-between" , 
        alignItems:"baseline" ,
        flexDirection: "row",
    }, 
    subsBtn: {
        paddingBottom:  helper.px(10),
    },
    
});

export default CategortyCollapsibleComponent;
