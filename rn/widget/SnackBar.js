/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict'
import React, {Component, PropTypes} from 'react'
import {
  Animated,
  StyleSheet,
  Text,
  View,
  TouchableHighlight
} from 'react-native'

export default class SnackBar extends Component {
  constructor(props) {
    super(props)
    this.state = ({
      showValue: new Animated.Value(0)
    })
  }

  static propTypes = {
    stayTime: PropTypes.number,
    bodyColor: PropTypes.string,
    height: PropTypes.number,
    message: PropTypes.string,
    textColor: PropTypes.string,
    actionText: PropTypes.string,
    actionTextColor: PropTypes.string,
    onActionClick: PropTypes.func
  };

  static defaultProps = {
    stayTime: 1500,
    bodyColor: '#1E1E1E',
    height: 40,
    message: 'Something Error',
    textColor: '#ffffff',
    actionText: '确定',
    actionTextColor: '#ffffff'
  };

  componentDidMount() {
    this._hideBar()
  }

  _showBar() {
    if (this.state.showValue > 0) {
      return;
    }
    Animated.timing(this.state.showValue, {
      toValue: 1,
      duration: 350
    }).start(() => {
      setTimeout(() => this._hideBar(), this.props.stayTime)
    })
  }

  _hideBar() {
    Animated.timing(this.state.showValue, {
      toValue: 0,
      duration: 350
    }).start()
  }

  render() {
    return (
      (<Animated.View style={[styles.containers, {opacity: this.state.showValue, height: this.props.height, backgroundColor: this.props.bodyColor}]}>
        <Text style={{color: this.props.textColor, position: 'absolute', left: 10, height: 20, top: 10}}>{this.props.message}</Text>
        <TouchableHighlight
          onPress={this.props.onActionClick}
          style={{position: 'absolute', right: 10, height: 15, top: 12.5, justifyContent: 'center'}}>
          <Text style={{color: this.props.actionTextColor}}>{this.props.actionText}</Text>
        </TouchableHighlight>
      </Animated.View>)
    )
  }
}

let styles = StyleSheet.create({
  containers: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  }
})
