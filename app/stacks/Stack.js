import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import helper from '../helpers/helper';
import MainTab from './Tab';
import { 
    Login , 
    Registration, 
    ForgotPassword, 
    DataNotFound, 
} from '../pages';
import {
    ORDERHİSTORY,
    ORDER,
    MAP,
} from '../values/screensList';
import {
    OrderHistoryScreen,
    OrderScreen,
    MapScreen,
  } from "../screens/index";


const Stack = createNativeStackNavigator();

const Stacks = () => {
    return (
        <Stack.Navigator 
        screenOptions={helper.screenOptions}
        >
            <Stack.Screen name="Main" component={MainTab} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Registration" component={Registration} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="DataNotFound" component={DataNotFound} />
            <Stack.Screen name={ORDERHİSTORY} component={OrderHistoryScreen} />
            <Stack.Screen name={ORDER} component={OrderScreen} />
            <Stack.Screen name={MAP} component={MapScreen} />
        </Stack.Navigator>
    );
}
export default Stacks;