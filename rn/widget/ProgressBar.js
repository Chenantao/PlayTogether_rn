/**
 *
 * Created by cat on 16-9-27.
 */
import React, {Component} from 'react';
import {View, ActivityIndicator} from 'react-native'
import Const from '../Const'
export default class ProgressBar extends Component {

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
  }

  render() {

    return (
      <View style={{
        position: 'absolute',
        backgroundColor: '#C1C1C1',
        opacity: 0.8,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator
          size='large'
          color={Const.Colors.MAIN_COLOR}
        />
      </View>
    );
  }
}
