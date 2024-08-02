import React,  {useEffect, useState , useMemo } from "react";
import {View , Text ,  StyleSheet  , TouchableOpacity , BackHandler  } from "react-native"; 
import Modal from "react-native-modal";
import helper from "../helpers/helper";
import colors from "../values/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AgeConfirmationModal=({  
    visibility , 
    setVisibility ,
}) => {

    const confirm = async () => {
        setVisibility(false); 
        try {
            await AsyncStorage.setItem("@age_Confirmation" , JSON.stringify(true)); 
        }catch(error) {
            console.log("error" , error); 
        }
    }

    return (
        <Modal
            style={styles.modal}
            animationIn={"slideInUp"}
            isVisible={visibility}
            deviceWidth={helper.screenWidth}
            swipeDirection={['down']}
            panResponderThreshold={50}
        >
            <View style={styles.layoutModal}>
                <View  style={styles.lineContainer}>
                    <View style={styles.line}></View>
                </View>

                <Text style={styles.infoText}>Yalnız <Text style={{...styles.infoText , color: colors.error }}>18 yaşı tamam olmuş</Text> şəxslər bu tətbiqdən istifadə edə bilər!</Text>
                <Text style={styles.title}>Sizin 18 yaşınız tamam olub?</Text>
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                    style={styles.button}
                    onPress={()=>confirm()}
                    >
                        <Text style={styles.buttonText}>Bəli</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={()=>BackHandler.exitApp()}
                    style={styles.button}
                    >
                        <Text style={styles.buttonText}>Xeyr</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}


const styles = StyleSheet.create({
    modal:{
        margin: 0, 
        bottom: 0 , 
        justifyContent: "center" ,  
        alignItems: "center" ,
    }, 
    layoutModal: {
        backgroundColor: colors.main , 
        padding: helper.px(16),
        borderRadius: helper.px(10),
        alignItems: "center" ,
        width: helper.px(300),
        paddingBottom: helper.px(24),
    },
    lineContainer: {
        width: "100%", 
        justifyContent:"center" ,
        alignItems: "center" , 
        marginBottom: helper.px(20) ,
    },
    line:{
        width: helper.px(134), 
        height: helper.px(5),
        backgroundColor: colors.border, 
    },
    title: {
        fontSize: helper.px(20), 
        fontWeight: "700", 
        fontFamily:helper.fontFamily(),
        lineHeight:helper.px(26),
        color: colors.text,
        marginBottom: helper.px(20) ,
        textAlign:"center" , 
    },
    buttonsContainer:{
        display: "flex",
        flexDirection: "row",  
        width:"90%", 
        justifyContent: "space-around", 
    }, 
    button:{
        backgroundColor: colors.text,
        paddingVertical: helper.px(10), 
        paddingHorizontal: helper.px(16), 
        width: "45%" , 
        borderRadius: helper.px(8), 
        justifyContent:"center", 
        alignItems: "center" ,  
    }, 
    buttonText: {
        color: colors.main, 
        fontWeight: "700" , 
        fontSize: helper.px(16), 
        lineHeight: helper.px(22), 
        fontFamily: helper.fontFamily(""), 
    }, 
    infoText: {
        color: colors.subTitle, 
        fontWeight: "400" , 
        fontSize: helper.px(16), 
        lineHeight: helper.px(22), 
        fontFamily: helper.fontFamily(""), 
        marginBottom: helper.px(16),
        textAlign: "center",
    }, 

}); 

export default AgeConfirmationModal ; 
