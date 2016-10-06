/**
 * Created by cat on 16-9-27.
 */
'use strict'
import React, {Component} from 'react';
import {
  View, Text, Image, ListView, StyleSheet, DrawerLayoutAndroid,
  RefreshControl, TouchableHighlight, AsyncStorage, BackAndroid, Alert
} from 'react-native'
import Const from './Const'
import LoginPage from './LoginPage'
import PostInvitePage from './PostInvitePage'
import PlayToolbar from './widget/PlayToolbar'
import HttpUtils from './utils/HttpUtils'

const DRAWER_WIDTH = 300;

export default  class HomePage extends Component {
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    var dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.skipItemCount = 0;//分页显示所需变量
    this.pageSize = 10;
    this.state = {
      dataSource: dataSource,
      isRefresh: false,
      isLoadMore: false
    }
  }

  componentDidMount() {
    this.setState({isRefresh: true});
    this._onRefresh();
  }

  render() {
    let {loginUser}=this.props.params;
    var navigationView = (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <Image resizeMode={Image.resizeMode.cover} source={require('./img/bg_drawer_header.png')} style={{width: DRAWER_WIDTH, height: 200}}>
          <Image source={require('./img/erha.jpg')} style={styles.drawerHeaderImgAvatar}/>
          <Text style={styles.drawerHeaderTxtUsername}>{loginUser.username}</Text>
        </Image>

        <View style={{flex: 6}}>
          {this._getDrawerMenuItem('首页')}
          {this._getDrawerMenuItem('个人')}
          {this._getDrawerMenuItem('邀约')}
          {this._getDrawerMenuItem('朋友')}
          {this._getDrawerMenuItem('问问')}
        </View>
        <View style={{flex: 2, borderTopWidth: 0.5, borderColor: Const.Colors.DIVIDER}}>
          <TouchableHighlight style={{height: 60, width: DRAWER_WIDTH, justifyContent: 'center', paddingLeft: 25}} onPress={this._handleLogout.bind(this)}
                              underlayColor={Const.Colors.MAIN_COLOR}><Text style={{fontSize: 16, fontWeight: 'bold'}}>退出账号</Text></TouchableHighlight>
          <TouchableHighlight style={{height: 60, width: DRAWER_WIDTH, justifyContent: 'center', paddingLeft: 25}} onPress={this._handleExit.bind(this)}
                              underlayColor={Const.Colors.MAIN_COLOR}><Text style={{fontSize: 16, fontWeight: 'bold'}}>退出应用</Text></TouchableHighlight>
        </View>
      </View>
    );
    return (
      <DrawerLayoutAndroid
        drawerWidth={DRAWER_WIDTH}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => navigationView}>
        <View style={styles.container}>
          <PlayToolbar/>
          <View style={styles.headerWrap}>
            {this._getHeaderItem('电影', './img/ic_movie.png')}
            {this._getHeaderItem('运动', './img/ic_food.png')}
            {this._getHeaderItem('美食', './img/ic_sport.png')}
          </View>
          <ListView
            dataSource={this.state.dataSource}
            renderRow={this._renderItem.bind(this)}
            onEndReached={this._loadMore.bind(this)}
            onEndReachedThreshold={30}
            refreshControl={
              <RefreshControl
                colors={[Const.Colors.MAIN_COLOR]}
                refreshing={this.state.isRefresh}
                onRefresh={this._onRefresh.bind(this)}
                title='Loading...'
                progressBackgroundColor='#F0F0F0'/>
            }/>
        </View>
      </DrawerLayoutAndroid>
    );
  }

  //选择类别的 item
  _getHeaderItem(text, iconPath) {
    let img;
    if (text == '电影') {
      img = (
        <Image style={{width: 20, height: 20}} source={require('./img/ic_movie.png')}/>
      );
    } else if (text == '运动') {
      img = (
        <Image style={{width: 20, height: 20}} source={require('./img/ic_sport.png')}/>
      );
    } else if (text == '美食') {
      img = (
        <Image style={{width: 20, height: 20}} source={require('./img/ic_food.png')}/>
      );
    }
    return (
      <View style={styles.headerItemWrap}>
        {img}
        <Text style={{fontSize: 18, marginLeft: 5}}>{text}</Text>
      </View>
    );
  }

  //drawer 的 item
  _getDrawerMenuItem(text) {
    let icon;
    switch (text) {
      case '首页':
        icon = require('./img/ic_drawer_menu_home.png');
        break;
      case '个人':
        icon = require('./img/ic_drawer_menu_personal_center.png');
        break;
      case '邀约':
        icon = require('./img/ic_drawer_menu_invite.png');
        break;
      case '朋友':
        icon = require('./img/ic_drawer_menu_friend.png');
        break;
      case '问问':
        icon = require('./img/ic_drawer_menu_faq.png');
        break;
      default:
        icon = require('./img/ic_drawer_menu_faq.png');
        break;
    }
    return (
      <TouchableHighlight style={{flex: 1}} onPress={this._onDrawerMenuClick.bind(this, text)} underlayColor={Const.Colors.MAIN_COLOR}>
        <View style={{flexDirection: 'row', paddingLeft: 25, flex: 1, alignItems: 'center'}}>
          <Image source={icon} style={{width: 30, height: 30}}/>
          <Text style={{color: 'black', marginLeft: 20, fontSize: 18}}>{text}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  //渲染 listview 的 item
  _renderItem(item) {
    return (
      <View style={styles.itemWrap}>
        <Text style={styles.itemTxtCategory}>来自 {item.category}</Text>
        <View style={{flexDirection: 'row', marginTop: 40}}>
          <View style={styles.itemUserInfoWrap}>
            <Image style={styles.itemImgAvatar} source={require('./img/erha.jpg')}/>
            <Text style={styles.itemTxtUsername}>{item.author.username}</Text>
          </View>
          <View style={styles.itemInviteWrap}>
            <Text numberOfLines={2}
                  style={styles.itemTxtTitle}>{item.title}</Text>
            <Text numberOfLines={3} style={styles.itemTxtContent}>{item.content}</Text>
          </View>
        </View>
      </View>
    );
  }

  _onDrawerMenuClick(item) {
    switch (item) {
      case '首页':
        alert('首页');
        break;
      case '个人':
        alert('个人');
        break;
      case '邀约':
        this.props.navigator.push({
          component: PostInvitePage,
          params: {
            refreshPage: ()=> {
              this.setState({isRefresh: true});
              this._onRefresh();
            }
          }
        });
        break;
      case '朋友':
        alert('朋友');
        break;
      case '问问':
        alert('问问');
        break;
    }
  }

  //退出账号
  _handleLogout() {
    AsyncStorage.removeItem(Const.KEY_SESSION_TOKEN);
    this.props.navigator.replace({
      component: LoginPage
    });
  }

  //退出应用
  _handleExit() {
    BackAndroid.exitApp();
  }

  _onRefresh() {
    this.skipItemCount = 0;
    HttpUtils.get(Const.BASE_URL + '1.1/classes/invitation', {
      include: 'author',
      limit: this.pageSize,
      order: '-createdAt',
      skip: this.skipItemCount
    })
      .then(jsonData=> {
        this.datas = jsonData.results;
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.datas),
          isRefresh: false,
        });
      })
      .catch(error=> {
        Alert.alert(error + '');
      });
  }

  _loadMore() {
    if (this.state.isLoadMore) {
      return;
    }
    this.skipItemCount += this.pageSize;
    this.setState({isLoadMore: true});
    HttpUtils.get(Const.BASE_URL + '1.1/classes/invitation', {
      include: 'author',
      limit: this.pageSize,
      order: '-createdAt',
      skip:this.skipItemCount
    })
      .then(jsonData=> {
        this.datas = [...this.datas, ...jsonData.results];
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.datas),
          isLoadMore: false
        });
      })
      .catch(error=> {
        Alert.alert(error + '');
      });
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Const.Colors.BACKGROUND_COLOR,
  },
  headerWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  headerItemWrap: {
    height: 50,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemWrap: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderColor: Const.Colors.DIVIDER,
  },
  itemTxtCategory: {
    position: 'absolute',
    top: 10,
    right: 10,
    height: 30,
    fontSize: 16
  },
  itemImgAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  itemUserInfoWrap: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center'
  },
  itemTxtUsername: {
    color: Const.Colors.MAIN_COLOR,
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold'
  },
  itemInviteWrap: {
    marginLeft: 15,
  },
  itemTxtTitle: {
    fontSize: 16,
    color: 'black',
    width: 250,
    fontWeight: 'bold'
  },
  itemTxtContent: {
    width: 250
  },

  /*-------------------------- drawer begin -----------------------------------------------------------*/
  drawerHeaderImgAvatar: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    position: 'absolute',
    bottom: 0,
    left: (DRAWER_WIDTH - 75) / 2,
  },
  drawerHeaderTxtUsername: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    left: 20,
    top: 50
  }
  /*-------------------------- drawer end -----------------------------------------------------------*/

});