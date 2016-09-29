/**
 * Created by cat on 16-9-25.
 * 注册页面
 */

'use strict'
import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, Alert, ToastAndroid} from 'react-native'
import Button from './widget/Button'
import ProgressBar from './widget/ProgressBar'
import HttpUtils from './utils/HttpUtils'
import Const from './Const'
import HomePage from './HomePage'
export default class RegisterPage extends Component {

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
  }

  render() {
    let content = (
      <View style={styles.registerBox}>
        <View style={styles.registerBox_title}>
          <Text style={styles.title}>快速注册</Text>
        </View>
        <View style={styles.inputWrap}>
          <TextInput
            underlineColorAndroid="transparent"
            placeholder="用户名"
            onChangeText={(username) => this.setState({username: username})}
            value={this.state.username}
            style={styles.textInput}/>
        </View>
        <View style={styles.inputWrap}>
          <TextInput
            onChangeText={(password) => this.setState({password: password})}
            value={this.state.password}
            underlineColorAndroid="transparent"
            placeholder="密码"
            secureTextEntry={true}
            style={styles.textInput}/>
        </View>
        <Button text="注册" styles={styles.btnRegister} onClick={this._handleRegister.bind(this)}/>
      </View>
    );
    let progress = this.state.isLoading ? (<ProgressBar/>) : null;

    return (
      <View style={styles.container}>
        {content}
        {progress}
      </View>
    )
  }

  _handleRegister() {
    let username = this.state.username;
    let password = this.state.password;
    if (username && password) {
      this.setState({isLoading: true});
      HttpUtils.post(Const.BASE_URL + '1.1/classes/_User', {
        username: username,
        password: password
      })
        .then(jsonData=> {
          if (jsonData && jsonData.objectId) {
            ToastAndroid.show('注册成功', ToastAndroid.SHORT);
            setTimeout(()=> {
              this.setState({isLoading: false});
              this.props.navigator.replace({
                component: HomePage
              })
            }, 1000);
          } else {
            this.setState({isLoading: false});
            Alert.alert('', '注册失败');
          }
        })
        .catch(error=> {
          this.setState({isLoading: false});
          Alert.alert('', '' + error);
        });
    } else {
      Alert.alert('', '用户名或密码不能为空');
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Const.Colors.BACKGROUND_COLOR
  },
  registerBox: {
    width: 300,
    height: 300,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  registerBox_title: {
    width: 300,
    height: 70,
    backgroundColor: Const.Colors.MAIN_COLOR,
    justifyContent: 'center',
    paddingLeft: 15
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold'
  },
  inputWrap: {
    width: 260,
    height: 40,
    borderWidth: 1,
    borderColor: '#ABABAB',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    padding: 4,
  },
  btnRegister: {
    width: 260,
    height: 40,
    marginTop: 30,
    backgroundColor: Const.Colors.MAIN_COLOR,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

