/**
 * Created by cat on 16-9-25.
 */
'use strict'
import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableNativeFeedback} from 'react-native'
import Const from '../Const'

export default class Button extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        return (
            <TouchableNativeFeedback
                onPress={this.props.onClick}
                background={TouchableNativeFeedback.SelectableBackground()}>
                <View style={this.props.styles}>
                    <Text style={{margin: 30}}>{this.props.text}</Text>
                </View>
            </TouchableNativeFeedback>);
    }
}
