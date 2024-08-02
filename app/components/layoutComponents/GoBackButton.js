import React from "react";
import { 
    TouchableOpacity ,  
    View , 
    StyleSheet , 
}  from "react-native";
import helper from '../../helpers/helper';
import colors from '../../values/colors';
import Icon from 'react-native-vector-icons/AntDesign';
// import {navigation} from "../../RootNavigation";
import { useNavigation } from '@react-navigation/native';


const GoBackButton = ({bgColor }) =>{

    const navigation = useNavigation();


    const goBack = () => {
        navigation.goBack(null);
    }

    return (
        <TouchableOpacity 
        style={{...styles.back , backgroundColor: bgColor? bgColor : colors.main }}
        onPress={goBack}
        >
              <Icon name="arrowleft" size={helper.px(22)} color={colors.text} />
        </TouchableOpacity>
    )

}

const styles =  StyleSheet.create({
    back: {
        height: helper.px(40),
        width: helper.px(40),
        backgroundColor: colors.main,
        borderRadius:100,
        // marginLeft: helper.px(20),
        position: 'absolute',
        left: 0,
        top: helper.px(10),
        padding:10,
    },
})

export default GoBackButton ; 