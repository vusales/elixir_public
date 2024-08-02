import React from 'react';
import { StyleSheet, Text } from 'react-native';
import helper from '../helpers/helper';

export default ErrorField = props => {
    return <Text style={styles.errorText}>{props.text}</Text>
}

const styles = StyleSheet.create({
    errorText: {
        color: 'red',
        marginTop: helper.px(7),
        marginLeft: helper.px(3),
    }
})