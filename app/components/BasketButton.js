import React , {useState ,  useeffect ,  useMemo, useEffect } from 'react';
import {View, StyleSheet, Text ,  TouchableOpacity} from 'react-native';
import helper from '../helpers/helper';
import colors from '../values/colors';
import BasketModal from "../modals/BasketModal"; 
import { useIsFocused } from '@react-navigation/native';

function BusketButton({stores ,  products , setProducts }) {
    const [ modalVisibility ,  setModalVisibility ] =  useState(false);   

    const SeeBasket = (type) => {
        setModalVisibility(!modalVisibility);
    }

    const getTotalProductPrice = () => {
        let total= 0 ; 
        products?.map((prdct)=>{
            let price ; 
            if(prdct?.discountPrice){
                price = prdct?.discountPrice; 
            }else {
                price = prdct?.price; 
            }
            total += price *  prdct?.quantity; 
        });
        return total ;
    }

    const goCartText = helper.translate("gocart"); 

    return (
        <>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                style={styles.busketButton}
                onPress={()=>SeeBasket()}
                >
                    <Text style={styles.text}>{goCartText}</Text>
                    <Text style={styles.text}>{getTotalProductPrice()}₼</Text>
                </TouchableOpacity>
            </View>
            <BasketModal 
            visibility={modalVisibility}
            setVisibility={(value)=>setModalVisibility(value)}
            basketProducts={products}
            setBasketProducts={(vle)=>setProducts(vle)}
            totalPrice={()=>getTotalProductPrice()}
            />
        </>  
    ) 
}

const styles = StyleSheet.create({
    buttonContainer:{
        height:helper.px(76),
        padding: helper.px(16),
        borderTopWidth: helper.px(1), 
        borderTopColor: colors.border,
        justifyContent: "center", 
        alignItems: "center", 
        backgroundColor: colors.main ,
        // width:helper.screenWidth,
    }, 
    busketButton :{ 
        backgroundColor: colors.text, 
        paddingHorizontal: helper.px(24),
        borderRadius: helper.px(50), 
        height: helper.px(44),
        justifyContent: "space-between", 
        alignItems: "center",
        flexDirection: "row",
        width: "100%",
        height:helper.px(44),
    }, 
    text: {
        fontFamily: helper.fontFamily("Bold"), 
        fontWeight: "600", 
        color:colors.main, 
        lineHeight: helper.px(24), 
        fontSize: helper.px(16), 
    },


});

export default helper.mobx(BusketButton);