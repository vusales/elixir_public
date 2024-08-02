import React , {useState}  from 'react';
import {View , Text ,  StyleSheet  , TouchableOpacity , ScrollView , ImageBackground} from "react-native"; 
import helper from '../helpers/helper';
import colors from '../values/colors';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { NavigationHelpersContext } from '@react-navigation/native';

const SimilarProductCard = ({data , style}) => {

    return (
        <View style={{...styles.container , ...style }}>
            <ImageBackground 
            style={styles.image}
            resizeMode="contain"
            ></ImageBackground>
            <View style={styles.textCotainer}>
                <Text style={styles.title} >{data.title}</Text>
                <View style={styles.description}>
                    <Text style={styles.newPrice} >{data.price}₼</Text>
                    <Text style={styles.oldPrice} >{data.oldPrice}₼</Text>
                </View>
            </View>
            <TouchableOpacity 
            style={styles.addButton}
            >
                <MaterialIcons name="add" color={colors.main} size={26}  /> 
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: helper.px(336),
        paddingHorizontal:helper.px(16),
        paddingVertical:helper.px(16),
        backgroundColor: colors.lightButton,
        flexDirection:"row", 
        alignItems:"center", 
        justifyContent: "space-between",
    }, 
    image: {
        width: helper.px(64),
        height: helper.px(64),
        borderWidth: helper.px(1), 
        borderColor: colors.border,
        backgroundColor:colors.main,
    },
    textCotainer: {}, 
    title: {
        fontFamily: helper.fontFamily("Bold") , 
        fontSize:helper.px(16), 
        lineHeight: helper.px(20), 
        fontWeight: "600" , 
        color: colors.text,
    }, 
    description:{
        flexDirection: "row",
        marginTop: helper.px(4),
        alignItems:"center",
    }, 
    newPrice: {
        fontFamily: helper.fontFamily("Bold") , 
        fontSize:helper.px(16), 
        lineHeight: helper.px(20), 
        fontWeight: "600" , 
        color: colors.border,
        marginRight: helper.px(6), 
    }, 
    oldPrice: {
        fontFamily: helper.fontFamily() , 
        fontSize:helper.px(14), 
        lineHeight: helper.px(17), 
        fontWeight: "300" , 
        color: colors.border,
        textDecorationLine:"line-through",
    }, 
    addButton: {
        borderRadius: helper.px(100),
        backgroundColor: colors.text , 
        width: helper.px(40),
        height: helper.px(40),
        justifyContent:"center",
        alignItems:"center",
    }





});



export default SimilarProductCard;