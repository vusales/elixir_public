import React, { useReducer , useState , useEffect} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import colors from '../values/colors';
import helper from '../helpers/helper';
import DataNotFoundComponent from '../components/DataNotFoundComponent';
import { useNavigation } from "@react-navigation/native";

const DataNotFound = (props) => { 
  const navigation = useNavigation(); 

  return (
    <>
    <SafeAreaView
    style={{
      flex: 0,
      backgroundColor: colors.main,
    }}
    />
    <StatusBar
        translucent={false}
        backgroundColor={colors.black}
    />
    <SafeAreaView
    style={styles.layout}
    >
        <DataNotFoundComponent
         title="Data Not Found"
         description="No data"
         type="noData"
         buttonText="Go Back" 
         buttonFunction={()=>{
          navigation.goBack();
        }}
        />    
    </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  layout:{
    backgroundColor: colors.main,
    height: helper.screenHeight,
    flex: 1,
    backgroundColor: colors.main,
    justifyContent: "center" , 
    alignItems: "center",
  }, 
});

export default helper.mobx(DataNotFound);
