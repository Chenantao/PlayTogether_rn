/**
 * Created by ChenAt on 2016/9/28.
 */
import React, {Component} from 'react';
import {StyleSheet, ToolbarAndroid} from 'react-native'
import Const from '../Const'
export default class PlayToolbar extends Component {

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
  }

  render() {
    return (<ToolbarAndroid
        titleColor='white'
        style={styles.toolbar}
        title="结伴而行"/>
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: Const.Colors.MAIN_COLOR,
    height: 70,
  },
});
