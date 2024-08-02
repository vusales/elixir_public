import React,  {useState , useEffect  } from "react";
import { Text ,  StyleSheet  ,  Pressable, Settings   } from "react-native"; 
import helper from "../helpers/helper";
import colors from "../values/colors";
import CheckBox from 'expo-checkbox';
import { cloneDeep } from "lodash";


const FilterCheckboxComponnet = ({item, index , choosenPuffs , setChoosenPuffs , setChoosenPuffsWithIdFunc }) => {
    const [quality, setQuality] = useState("");
    const [checked , setChecked ] =  useState(false) ; 

    useEffect(()=>{
        setCheckboxChecked();
    },[]);

    const setCheckboxChecked = () => {
        if(choosenPuffs.includes(item)){
            setChecked(true);
        }
    }

    const Qualityset = (value) => {
        let choosen =  cloneDeep(choosenPuffs); 
        choosen = [...choosenPuffs , value ];
        let newChosen = new Set(choosen); 
        if(checked){
            newChosen.delete(value);
            setChecked(false);
        }else {
            newChosen.add(value);
            setChecked(true);
        }
        setChoosenPuffs([...newChosen]); 


        // if there is 
        setChoosenPuffsWithIdFunc() ; 
    }

    return (
        <Pressable 
        key={index}
        onPress={()=> Qualityset(item)}
        style={styles.checboxContainer}
        >
            <CheckBox
            value={checked}
            onValueChange={()=> Qualityset(item)}
            style={styles.checkbox}
            />
            <Text style={styles.checboxText}>{item}</Text>
        </Pressable>
    )
}


const styles =  StyleSheet.create({
    
    checkbox: {
        width:helper.px(16) ,
        height:helper.px(16) ,
        borderRadius: helper.px(5), 
        borderWidth: helper.px(1), 
        borderColor: colors.border , 
        marginRight: helper.px(10), 
    },
    checboxText:{
        color: colors.text, 
        fontFamily:helper.fontFamily(),
        fontSize: helper.px(16), 
        fontWeight:"400", 
        lineHeight:helper.px(20), 
    },
    checboxContainer:{
        flexDirection:"row", 
        marginRight: helper.px(10) ,
        width:helper.px(75) ,
        paddingHorizontal: helper.px(8),   
        paddingVertical: helper.px(5),   
    },
});


export default FilterCheckboxComponnet ; 