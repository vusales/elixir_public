import React , {
    useState ,  
    useRef, 
    useEffect, 
    useMemo , 
} from 'react';
import { 
    StyleSheet , 
    Text, 
    View , 
    TouchableOpacity , 
    TextInput , 
    ScrollView ,
} from 'react-native';
import helper from '../../helpers/helper';
import colors from '../../values/colors';
import AntDesign from "react-native-vector-icons/AntDesign";
import { camelCase } from 'lodash';


const AutoCompleteInput = ({
    stores ,
    confirmAddress , 
    goToUserText , 
    initialAddress ,
}) => {
    const [ inputValue , setInpuValue ] = useState("") ; 
    // const [ catchPredictionTextPress , setCatchPredictionTextPress ] = useState(false) ; 
    const predictedPlaces = useMemo(()=> stores.MapStore.predictions , [stores.MapStore.predictions]); 

    // reset first of all
    // useEffect(()=>{
    //     resetPredictions() ; 
    //     console.log("auto comp  render first ") ; 
    // }, []); 
    
    //sets inputValue to initialAddress 
    useEffect(()=>{
        resetPredictions() ; 
        setInpuValue(initialAddress) ; 
    }, [initialAddress]); 


    const getPredictions = async (value) => {
        try{
            let parametr =  {
                input : value , 
            }
            await stores.MapStore.sendParams(parametr); 
        }catch(err) {
            console.log("getPredictions error" ,  err) ; 
        }
    }

    const resetPredictions = async () => {
        try{
            await stores.MapStore.resetPredictions();
        }catch(error) {
            console.log("error" , error ) ; 
        }
    }

    const goAutoCompleteText = async (item)=>{
        try{
            // with setCatchPredictionTextPress i detet if use choose any of predictions if yes i disable onEndEditing function
            // setCatchPredictionTextPress(true) ; 
            //****************
            await  goToUserText(item.description) ; 
            resetPredictions() ;
            setInpuValue(item.description);
        }catch(err){
            console.log("error on choosing autoCompleted places" , err);
        }
    }

  
    return (
        <View style={styles.buttonContainer}>
            <View style={styles.inputContainer} >
                <View 
                style={{
                    height: helper.px(40),
                    width:"13%", 
                    alignItems: "center" , 
                    justifyContent :"center" , 
                    marginTop: helper.px(3),
                    paddingLeft: helper.px(10),

                }}> 
                    <AntDesign name="search1" size={22} color={colors.border}/> 
                </View>

                <TextInput
                value={inputValue}
                style={inputValue ? {...styles.input ,  width:  "74%",  } :styles.input}
                placeholder={helper.translate("search")}
                onChangeText={(value) => {   
                    setInpuValue(value) ; 
                    getPredictions(value); 
                }}
                onEndEditing={()=>{
                    // if(catchPredictionTextPress) {
                    //     return ; 
                    // }else {
                        // clearTimeout(setSearch) ; 
                        // let setSearch = setTimeout(() => {
                        //     goToUserText(inputValue);
                        //     resetPredictions();
                        // }, 1000);
                    // }
                }}
                />

                {
                    inputValue? 
                    <TouchableOpacity 
                    style={{
                        height: helper.px(40), 
                        width:"13%", 
                        alignItems: "center" , 
                        justifyContent :"center" , 
                        marginTop: helper.px(3),
                    }}
                    onPress={()=>setInpuValue("")}
                    > 
                        <AntDesign name="close" size={22} color={colors.border}/> 
                    </TouchableOpacity>
                    :null
                }
                
            </View>
            {
                predictedPlaces?.length ? 
                <ScrollView 
                style={styles.autocompView}
                contentContainerStyle={{ flexGrow: 1 }}
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                >
                    <View onStartShouldSetResponder={() => true}>
                    {
                        predictedPlaces.map((item, index)=>{
                            return(
                                <TouchableOpacity 
                                key={index+"autoComplete"}
                                style={
                                    index === predictedPlaces.length - 1 ? 
                                    {
                                        ...styles.predictedPlacesButton , 
                                        borderBottomWidth: 0 , 
                                        borderBottomColor: "none" ,
                                    }  
                                    :styles.predictedPlacesButton
                                }
                                onPress={()=>goAutoCompleteText(item)}
                                >
                                    <Text 
                                    style={styles.predictedPlacesdescriptionText}
                                    >{item.description}</Text>
                                </TouchableOpacity>
                            )
                        })  
                    }
                    </View>
                </ScrollView>
                :null
            }
            <TouchableOpacity
            style={styles.confirmOrderButton}
            onPress={()=>confirmAddress()}
            >
                <Text style={styles.confirmText}>{helper.translate("addAddress")}</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    buttonContainer: {
        paddingHorizontal: helper.px(16),
        backgroundColor: colors.main ,
        width: "100%" ,
        paddingBottom: helper.px(40),
        position: "relative" , 
        zIndex: 1000000, 
    },
    confirmOrderButton :{ 
        backgroundColor: colors.text, 
        paddingHorizontal: helper.px(24),
        borderRadius: helper.px(50), 
        height: helper.px(44),
        justifyContent: "center", 
        alignItems: "center",
        flexDirection: "row",
        width: "100%",
        height:helper.px(44),
        marginTop: helper.px(10),
    }, 
    confirmText: {
        fontFamily: helper.fontFamily("Bold"), 
        fontWeight: "600", 
        color:colors.main, 
        lineHeight: helper.px(20), 
        fontSize: helper.px(16), 
    },
    inputContainer:{
        flexDirection: "row",
        alignItems:"center",
        height:helper.px(56),
        borderWidth: helper.px(1),
        borderColor: colors.border,
        marginTop: helper.px(16),
        justifyContent:"space-between" ,
    },
    input: {
        width:  "85%", 
    }, 
    autocompView: {
        width:helper.screenWidth ,
        backgroundColor: colors.main ,
        // maxHeight:helper.screenHeight - helper.px(300), 
        paddingHorizontal: helper.px(16),
        paddingVertical: helper.px(24),
        paddingBottom: helper.px(10) ,
        position: "absolute" , 
        left:0 , 
        bottom: "132%",
        borderTopLeftRadius: helper.px(20) , 
        borderTopRightRadius: helper.px(20) ,
    } , 
    predictedPlacesButton : {
        padding:helper.px(16) , 
        marginBottom: helper.px(10) ,
        borderBottomColor: colors.border , 
        borderBottomWidth: helper.px(1),
    } , 
    predictedPlacesdescriptionText: {
        color: colors.text , 
        fontFamily: helper.fontFamily("") , 
        fontSize: helper.px(16) , 
        lineHeight: helper.px(20) , 
        fontWeight: "500",
    } , 

});

export default helper.mobx(AutoCompleteInput);
