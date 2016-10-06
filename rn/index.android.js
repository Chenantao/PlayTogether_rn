/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {AppRegistry, StyleSheet, BackAndroid, Navigator, StatusBar, View, Image, ToastAndroid} from 'react-native'
var Dimensions = require('Dimensions');
import LoginPage from './LoginPage'
import HomePage from './HomePage'
import PostInvitePage from './PostInvitePage'
import Const from './Const'
import HttpUtils from './utils/HttpUtils'

class PlayMain extends Component {

  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {firstPage: null};
    //bind 方法调用后会返回一个新的对象，为了添加以及删除 listener 的时候操作的是同一个对象，需要将其引用保存起来
    this.handleBack = this._handleBack.bind(this);
  }


  _handleBack() {
    const routes = this.navigator.getCurrentRoutes();
    let topRoute = routes[routes.length - 1];
    if (topRoute.onBackPress) {
      return topRoute.onBackPress();
    }
    if (this.navigator && routes.length > 1) {
      this.navigator.pop();
      return true;
    }
    if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
      //最近2秒内按过back键，可以退出应用。
      return false;
    }
    this.lastBackPressed = Date.now();
    ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
    return true;
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
    //防止启动页太快跳过去
    setTimeout(()=> {
      HttpUtils.get(Const.BASE_URL + '1.1/users/me')
        .then(jsonData=> {
          //已登录
          if (jsonData.objectId) {
            this.setState({firstPage: HomePage, loginUser: jsonData})
          } else {
            this.setState({firstPage: LoginPage})
          }
        })
        .catch(error=> {
          // alert('error:' + error);
          this.setState({firstPage: LoginPage})
        });
    }, 500);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
  }


  render() {
    var content;
    if (this.state.firstPage) {
      content = (
        <Navigator
          ref={component => this.navigator = component}
          initialRoute={{
            component: this.state.firstPage,
            //component: PostInvitePage,
            params: {
              loginUser: this.state.loginUser
            }
          }}
          renderScene={(route, navigator) => { // 用来渲染navigator栈顶的route里的component页面
            // route={component: xxx, name: xxx, ...}， navigator.......route 用来在对应界面获取其他键值
            return <route.component navigator={navigator} {...route} {...route.params}/>// {...route.passProps}即就是把passProps里的键值对全部以给属性赋值的方式展开 如：test={10}
          }}/>
      );
    } else {
      var {width, height} = Dimensions.get('window');
      content = (
        <Image resizeMode={Image.resizeMode.cover} style={{width: width, height: height}} source={require('./img/bg_splash.jpg')}/>
      );
    }
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor='transparent'
          translucent/>
        {content}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
});

AppRegistry.registerComponent('PlayMain', () => PlayMain);
