import React , {useState ,  useEffect } from "react"; 
import {Text ,  StyleSheet  , TouchableOpacity , Image , ImageBackground } from "react-native";
import helper from '../helpers/helper';
import colors from '../values/colors';

export default CategoryButton = ({ choosen, firstChild , data, filter , lastChild }) => {
    return (
        <TouchableOpacity
        style={
            firstChild ?  
            (choosen? {...styles.filterButtons , ...styles.firstChild  , ...styles.choosen } : {...styles.filterButtons , ...styles.firstChild }) 
            : 
            (
                lastChild ? 
                (choosen? {...styles.filterButtons , ...styles.lastChild , ...styles.choosen } : {...styles.filterButtons , ...styles.lastChild })
                : 
                (choosen? {...styles.filterButtons , ...styles.choosen } : styles.filterButtons)
            ) 
        }
        onPress={(e)=>{
            filter(data?.id, data.name);
        }}
        >
            {/* <Text style={choosen? {...styles.filterText , ...styles.choosenText}:styles.filterText}>{data?.text}</Text>
            <Text style={choosen?{...styles.filtersubText , ...styles.choosenText}:styles.filtersubText}>{helper.translate("smokes")}</Text> */}

            {/* <Image source={choosen? data.logoWhite : data.logoBlack}  style={styles.imageBg}/> */}
            <ImageBackground 
            source={choosen? {uri: data.whiteImage} : {uri: data.blackImage} } 
            resizeMode="cover"
            style={styles.imageBg}
            imageStyle={styles.image}
            /> 
        </TouchableOpacity>
    )
}

const styles =  StyleSheet.create({
    filterButtons: {
        width: helper.px(154), 
        height:helper.px(74),
        padding: helper.px(16),
        alignItems:"center", 
        justifyContent: "center" ,
        borderWidth: helper.px(1), 
        borderColor: "#D1D1D6" ,
    }, 
    firstChild: {
        borderTopLeftRadius: helper.px(20), 
        borderBottomLeftRadius: helper.px(20), 
    }, 
    lastChild:{
        borderTopRightRadius: helper.px(20), 
        borderBottomRightRadius: helper.px(20), 
        marginRight: helper.px(16),
    },
    filterText:{
        fontWeight:"800", 
        fontSize: helper.px(20),
        fontFamily:helper.fontFamily(),
        lineHeight: helper.px(25), 
        textAlign: "center" , 
        color: colors.black , 
        marginBottom: helper.px(2),
    }, 
    filtersubText: {
        fontWeight: "400" ,
        fontFamily:helper.fontFamily(),
        fontSize: helper.px(14), 
        lineHeight: helper.px(17), 
        textAlign: "center" , 
        color: colors.black , 
    }, 
    choosen: {
        backgroundColor: colors.text , 
    }, 
    choosenText: {
        color: colors.main,
    },
    imageBg: {
        width: "100%",
        height:"100%",
        justifyContent:"center",
        alignItems: "center" , 
    }, 
    image : {
        // width:helper.px(116), 
    },
    
}); 
