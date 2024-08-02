import React,  {useEffect, useState ,  } from "react";
import {View , Text ,  StyleSheet  , TouchableOpacity , ScrollView , ImageBackground ,  FlatList   } from "react-native"; 
import Modal from "react-native-modal";
import helper from "../helpers/helper";
import colors from "../values/colors";


const WarningModal = ({
    visibility ,
    setVisibility , 
    description  ,  
    pressFunction , 
    buttonText , 
}) => {
    
return (
    <Modal
    style={{
        margin: 0, 
        bottom: 0 , 
        justifyContent: "center" ,  
        alignItems: "center" ,
    }}
    animationIn={"slideInUp"}
    isVisible={visibility}
    onBackdropPress={()=>setVisibility(false)}
    onBackButtonPress={()=>setVisibility(false)}
    onSwipeComplete={()=>setVisibility(false)}
    deviceWidth={helper.screenWidth}
    swipeDirection={['down']}
    panResponderThreshold={50}
    >
        <View style={styles.layoutModal}>
            <View  style={styles.lineContainer}>
                <View style={styles.line}></View>
            </View>

            <Text style={styles.title}>{description()}</Text>
            <TouchableOpacity
            onPress={()=>pressFunction()}
            style={styles.button}
            >
                <Text style={styles.buttonText}>{buttonText}</Text>
            </TouchableOpacity>
        </View>
    </Modal>
)};


const styles = StyleSheet.create({
    layoutModal: {
        backgroundColor: colors.main , 
        padding: helper.px(16),
        borderRadius: helper.px(10),
        alignItems: "center" ,
        width: helper.px(300),
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
        fontSize: helper.px(24), 
        fontWeight: "700", 
        fontFamily:helper.fontFamily(),
        lineHeight:helper.px(30),
        color: colors.text,
        marginBottom: helper.px(20) ,
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
        textAlign:"center",
    }, 
}); 
export default WarningModal;
