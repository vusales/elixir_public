import React,  {useEffect, useMemo, useState ,  } from "react";
import {View , Text ,  StyleSheet  , TouchableOpacity , ScrollView , ImageBackground , Pressable   } from "react-native"; 
import Modal from "react-native-modal";
import helper from "../helpers/helper";
import colors from "../values/colors";
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { useNavigation } from '@react-navigation/native';
import FilterCheckboxComponnet from "../components/FilterCheckBoxComponent";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import i18next from "i18next";
import DropDownComponent from "../components/DropDownComponent";
import { cloneDeep } from 'lodash';

const PuffsBaseComponent = ({
    qualityValue, 
    title ,
    setChoosenPuffs , 
    choosenPuffs , 
    setChoosenPuffsWithIdFunc , 
}) =>{ 
    
    return (
   <>
        <Text style={styles.subTitle} >{title}</Text>
        <View style={styles.checboxesContainer}>
            {
                qualityValue?.map((item ,index)=>{
                    return(
                        <FilterCheckboxComponnet 
                        key={`filterDetailsCheckbox${index}`}
                        index={index}
                        item={item}
                        choosenPuffs={choosenPuffs}
                        setChoosenPuffs={(val)=>setChoosenPuffs(val)}
                        setChoosenPuffsWithIdFunc={setChoosenPuffsWithIdFunc}
                        />
                    );
                })
            }
        </View>
   </>
)};

const styles = StyleSheet.create({
    subTitle: {
        fontFamily:helper.fontFamily("Bold"),
        fontSize: helper.px(18), 
        fontWeight: "600", 
        lineHeight:helper.px(22),
        color: colors.text,
        marginBottom: helper.px(20) ,
    }, 
    checboxesContainer: {
        flexDirection:"row", 
        marginBottom:helper.px(20),
        flexWrap: 'wrap', 
        width:"90%",
    },
    
});

export default PuffsBaseComponent;
