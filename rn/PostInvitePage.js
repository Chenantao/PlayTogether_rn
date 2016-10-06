/**
 * Created by ChenAt on 2016/9/29.
 * 发布邀请的页面
 */

import React, {Component} from 'react'
import {
  View, ViewPagerAndroid, ToastAndroid, Text, TextInput, TouchableHighlight, Image, ToolbarAndroid,
  Picker, DatePickerAndroid, StyleSheet, Alert, AsyncStorage
} from 'react-native'
import PlayToolbar from './widget/PlayToolbar'
import SnackBar from './widget/SnackBar'
import Dimensions from 'Dimensions'

var NativeTabLayout = require('./widget/NativeTabLayout');
import ProgressBar from './widget/ProgressBar'
import HttpUtils from './utils/HttpUtils'
import DateUtils from './utils/DateUtils'
import Const from './Const'

export default class PostInvitePage extends Component {


  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      tabSelectedPos: 0,//当前选中 tab 的 pos
      isLoading: false,
      genderRequire: '男',//性别要求
      constellationRequire: '白羊座',//星座要求
      category: '美食',//兴趣类型
    }
    //单独处理这个界面的 back 键
    const routes = this.props.navigator.getCurrentRoutes();
    const topRoute = routes[routes.length - 1];
    topRoute.onBackPress = ()=> {
      this.refs['snackBar']._showBar();
      this.setState({
        snackBarMessage: '确定要放弃编辑吗?',
        onSnackBarSureClick: ()=> {
          this.props.navigator.pop()
        }
      });
      return true;
    };

    var {width, height}=Dimensions.get('window');
    this.screenWidth = width;
    this.screenHeight = height;
  }

  render() {
    var progressBar = this.state.isRefresh ? <ProgressBar/> : null;

    return (
      <View style={{flex: 1, backgroundColor: Const.Colors.BACKGROUND_COLOR}}>
        <View style={{height: 60, backgroundColor: Const.Colors.MAIN_COLOR}}>
          <TouchableHighlight
            onPress={this._onPostClick.bind(this)}
            style={{position: 'absolute', right: 10, top: 30}}>
            <Image source={require('./img/ic_send.png')}/>
          </TouchableHighlight>
        </View>
        <NativeTabLayout
          ref='tabLayout'
          selectTab={this.state.tabSelectedPos}
          onTabSelected={this._onTabSelected.bind(this)}
          setTabs={['内容', '条件']}
          setIndicatorColor='#EE30A7'
          setTabTextColor={['#96ffffff', '#ffffff']}//数组第一个参数为未选中时 tab 文字的颜色，第二个为选中时候的颜色
          style={{width: this.screenWidth, height: 75, backgroundColor: Const.Colors.MAIN_COLOR}}/>
        <ViewPagerAndroid
          style={{flex: 1}}
          ref={viewPage=> {
            this.viewPager = viewPage
          }}
          onPageSelected={this._onPageSelected.bind(this)}
          initialPage={0}>
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <TextInput
                onChangeText={(title) => this.setState({title: title})}
                value={this.state.title}
                placeholder='请输入标题(15个字以内)'
                style={{flex: 1}}
                multiline={true}
              />
            </View>
            <View style={{flex: 9, flexDirection: 'row'}}>
              <TextInput
                onChangeText={(content) => this.setState({content: content})}
                value={this.state.content}
                multiline={true}
                placeholder='请输入内容'
                style={{color: 'black', flex: 8, textAlignVertical: 'top'}}/>
            </View>
          </View>
          <View>
            <View>
              {this._getConditionItem('性别要求', ['男', '女', '不限'])}
              {this._getConditionItem('星座要求', ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天枰座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'])}
              {this._getConditionItem('兴趣类型', ['美食', '电影', '运动'])}
              <TouchableHighlight onPress={this._onSelectExpireClick.bind(this)} underlayColor={Const.Colors.UNDERLAY_COLOR}>
                <View style={[styles.conditionWrap, {paddingLeft: 10, height: 50, justifyContent: 'center'}]}>
                  <Text style={{fontSize: 16, color: "black"}}>过期时间</Text>
                  <View style={{position: 'absolute', right: 10, top: 15, flex: 3, flexDirection: 'row', alignItems: 'center'}}>
                    <Text>{this.state.expireDate}</Text>
                    <Image style={{width: 20, height: 20, marginLeft: 3}} source={require('./img/ic_more.png')}/>
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </ViewPagerAndroid>
        <SnackBar ref='snackBar'
                  stayTime={3000}
                  message={this.state.snackBarMessage}
                  actionTextColor={Const.Colors.MAIN_COLOR}
                  onActionClick={this.state.onSnackBarSureClick}/>
        {progressBar}
      </View>
    );
  }

  //条件选择选项
  _getConditionItem(title, itemValues) {
    var key = '';
    switch (title) {
      case '性别要求':
        key = 'genderRequire';
        break;
      case '星座要求':
        key = 'constellationRequire'
        break;
      case '兴趣类型':
        key = 'category'
        break;
    }
    console.log('key:' + this.state[key]);
    return (
      <View style={[styles.conditionWrap, {flexDirection: 'row', alignItems: 'center'}]}>
        <Text style={{flex: 7, fontSize: 16, color: "black"}}>{title}</Text>
        <Picker
          style={{flex: 3}}
          selectedValue={this.state[key]}
          onValueChange={(item) => this.setState({[key]: item})}>
          {
            itemValues.map((value, index)=> {
              return (
                <Picker.Item label={value} value={value} key={index}/>
              );
            })
          }
        </Picker>
      </View>
    );
  }

  _onTabSelected(position) {
    if (this.viewPager) {
      this.setState({tabSelectedPos: parseInt(position)});
      this.viewPager.setPage(parseInt(position));
    }
  }

  _onPageSelected(event) {
    let pos = event.nativeEvent.position;
    this.setState({tabSelectedPos: pos});
  }

  //选择过期时间的单击事件
  async _onSelectExpireClick() {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        // 要设置默认值为今天的话，使用`new Date()`即可。
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // 这里开始可以处理用户选好的年月日三个参数：year, month (0-11), day
        let selectDate = new Date(year, month, day);
        let today = new Date();
        if (selectDate.getDate() < today.getDate()) {
          Alert.alert('', '选择日期不能早于现在');
        } else {
          this.setState({expireDate: selectDate.format('yyyy-MM-dd')});
        }
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }

  //发布按钮点击事件
  _onPostClick() {
    this.setState({
      snackBarMessage: '约吗?',
      onSnackBarSureClick: this._onSurePostClick.bind(this)
    });
    var snackBar = this.refs['snackBar'];
    snackBar._showBar();
  }

  _onBackPress() {
    alert('backPress');
  }


  //确认发布
  async _onSurePostClick() {
    var snackBar = this.refs['snackBar'];
    snackBar._hideBar();
    var title = this.state.title;
    var content = this.state.content;
    var genderRequire = this.state['genderRequire'];
    var constellationRequire = this.state['constellationRequire'];
    var category = this.state['category'];
    var expireDate = this.state.expireDate ? new Date(this.state.expireDate).toISOString() : new Date().toISOString();
    if (title && content && genderRequire && constellationRequire && category && expireDate) {
      this.setState({isLoading: true});
      const currentUser = await HttpUtils.getCurrentUser()
      if (!currentUser) {
        // Alert.alert('', '系统异常，请退出并重新登陆');
        this.setState({isLoading: false});
        return;
      }
      // alert('objectId:' + currentUser);
      HttpUtils.post(Const.BASE_URL + '1.1/classes/invitation', {
        title: title,
        content: content,
        gender: genderRequire,
        constellation: constellationRequire,
        category: category,
        expire: {
          "__type": "Date",
          "iso": expireDate
        },
        author: {
          "__type": "Pointer",
          "className": "_User",
          "objectId": currentUser.objectId
        }
      })
        .then(jsonData=> {
          this.setState({isLoading: false});
          ToastAndroid.show('发布成功', ToastAndroid.LONG);
          this.props.navigator.pop();
          if(this.props.refreshPage) {
            this.props.refreshPage();
          }
        })
        .catch(error=> {
          this.setState({isLoading: false});
          console.log(error + '');
          // alert(error + '');
        })
    } else {
      Alert.alert('', '请完善各项条件');
    }

  }
}

const styles = StyleSheet.create({
  conditionWrap: {
    paddingLeft: 10,
    height: 50,
  }
});