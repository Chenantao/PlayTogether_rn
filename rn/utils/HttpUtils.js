/**
 * Created by cat on 16-9-26.
 * 网络请求工具类
 */
'use strict'
import Const from '../Const';
import {AsyncStorage} from 'react-native'

var sessionToken = '';
export default class HttpUtils {

  /**
   *
   * @param ms 超时时间
   */
  static timeOut(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('请求超时'))
      }, ms)
    });
  }

  /**
   * get 请求
   * @param url
   * @param params 请求参数
   * @returns promise 对象
   */
  static async get(url, params) {
    if (params) {
      if (url.indexOf('?') == -1) {
        url += '?';
      }
      for (let index in params) {
        if (url.indexOf('?') == url.length - 1) {
          url += ( index + '=' + encodeURIComponent(params[index]));
        } else {
          url += ('&' + index + '=' + encodeURIComponent(params[index]));
        }
      }
    }
    console.log('url:' + url);
    let fetchPromise = ()=> {
      return Promise.race([
        this.getSessionToken()
          .then(token=> {
            return fetch(url, {
              method: 'GET',
              headers: this.getHeader(token)
            },)
          })
          .then((response) => {
            return response.json();
          })
          .then((jsonData)=> {
            //lean cloud 只要 code 存在，则查询错误
            if (jsonData.code && jsonData.error) {
              throw new Error(jsonData.error);
            }
            return jsonData;
          })
        , this.timeOut(Const.REQUEST_TIME_OUT)]);

    };
    //Promise.race，返回第一个执行完毕的 promise 的结果
    return await fetchPromise();
  }

  static async post(url, params) {
    let fetchPromise = ()=> {
      return Promise.race([
        this.getSessionToken()
          .then((token)=> {
            return fetch(url, {
              method: 'POST',
              headers: this.getHeader(token),
              body: JSON.stringify(params)
            },)
          })
          .then((response) => {
            return response.json();
          })
          .then((jsonData)=> {
            //lean cloud 只要 code 存在，则查询错误
            if (jsonData.code && jsonData.error) {
              throw new Error(jsonData.error);
            }
            return jsonData;
          })
        , this.timeOut(Const.REQUEST_TIME_OUT)]);

    };
    //Promise.race，返回第一个执行完毕的 promise 的结果
    return await fetchPromise();
  }


  static getHeader(token) {
    console.log('session:' + token);
    return {
      // 'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-LC-Id': Const.APP_ID,
      'X-LC-Key': Const.APP_KEY,
      'X-LC-Session': token
    };
  }

  static getSessionToken() {
    if (sessionToken) {
      return new Promise((resolve, reject) => {
        resolve(sessionToken);
      });
    }
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(Const.KEY_SESSION_TOKEN, (error, result)=> {
        resolve(error ? '' : result);
      });
    });

  }


}
