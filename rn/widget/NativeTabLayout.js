/**
 * Created by ChenAt on 2016/9/29.
 */

// ImageView.js
'use strict';
import React, {PropTypes, Component} from 'react';
import {requireNativeComponent, View} from 'react-native';

var RCTTabLayout = requireNativeComponent('RCTTabLayout', NativeTabLayout, {
  nativeOnly: {onChange: true}
});
class NativeTabLayout extends React.Component {

  name: 'NativeTabLayout'
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
    this._onChange = this._onChange.bind(this);
  }

  _onChange(event) {
    if (!this.props.onTabSelected) {
      return;
    }
    this.props.onTabSelected(event.nativeEvent.position);
  }

  render() {
    return (<RCTTabLayout {...this.props} onChange={this._onChange}/>);
  }
}
NativeTabLayout.propTypes = {
  setTabs: PropTypes.array,
  setTabTextColor: PropTypes.array,
  setIndicatorColor: PropTypes.string,
  selectTab: PropTypes.number,
  onTabSelected: React.PropTypes.func,
  ...View.propTypes // 包含默认的View的属性
}

module.exports = NativeTabLayout;
