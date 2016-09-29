/**
 * Created by cat on 16-9-24.
 */
'use strict'
import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, TextInput, Alert, AsyncStorage, ToastAndroid} from 'react-native'
import Button from './widget/Button'
import ProgressBar from './widget/ProgressBar'
import Const from './Const'
import RegisterPage from './RegisterPage'
import HttpUtils from './utils/HttpUtils'
import HomePage from  './HomePage'
export default class LoginPage extends Component {



  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {};
    // alert(navigator);
  }

  render() {
    let progress = this.state.isLoading ? (<ProgressBar/>) : null;

    return (
      <View style={styles.container}>
        <Image
          source={require('./img/bg_login.png')}
          style={styles.bgLogin}/>
        <View style={styles.matchParent}>
          <View style={styles.loginBox}>
            <Image
              source={require('./img/bg_login_input.png')}
              style={styles.bgLogin}/>
            <View style={styles.matchParent}>
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
              <Button styles={styles.btnLogin} text="登录" onClick={this._handleLogin.bind(this)}/>
              <Text style={styles.btnRegister} onPress={this._handleRegister.bind(this)}>
                还没有帐号？
              </Text>
            </View>
          </View>
        </View>
        {progress}
      </View>
    );
  }

  _handleLogin() {
    let username = this.state.username;
    let password = this.state.password;
    if (username && password) {
      this.setState({isLoading: true});
      HttpUtils.post(Const.BASE_URL + '1.1/login', {
        username: username,
        password: password
      })
        .then(jsonData=> {
          if (jsonData && jsonData.objectId) {
            ToastAndroid.show('登录成功', ToastAndroid.SHORT);
            AsyncStorage.setItem(Const.KEY_SESSION_TOKEN, jsonData.sessionToken);
            setTimeout(()=> {
              this.setState({isLoading: false});
              this.props.navigator.replace({
                component: HomePage,
                params: {
                  user: jsonData,
                }

              })
            }, 1000);
          } else {
            this.setState({isLoading: false});
            Alert.alert('', '帐号或者密码不匹配');
          }
        })
        .catch(error=> {
          this.setState({isLoading: false});
          Alert.alert('', '' + error);
        });
    } else {
      // HttpUtils.post(Const.BASE_URL + '1.1/classes/_User', {
      //     username: '嘻嘻',
      //     password: '123456'
      // });
      Alert.alert('', '用户名或密码不能为空');
    }
  }

  _handleRegister() {
    this.props.navigator.push({
      component: RegisterPage
    });
    // let {navigator} = this.props;
    // if (navigator) {
    //     navigator.push({
    //         component: RegisterPage
    //     });
    // } else {
    //     Alert.alert('', '系统异常');
    // }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgLogin: {
    flex: 1
  },
  matchParent: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginBox: {
    width: 300,
    height: 350,
    // backgroundColor: 'blue',
    opacity: 0.9
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    padding: 4,
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
  btnLogin: {
    width: 260,
    height: 40,
    marginTop: 30,
    backgroundColor: Const.Colors.MAIN_COLOR,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnRegister: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 15
  }
});

