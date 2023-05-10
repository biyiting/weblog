import Axios from 'axios';
const FETCH_TIMEOUT = 18000000;

Axios.interceptors.request.use(
  config => {
    let token = window.localStorage.getItem('sid');
    if (token) {
      config.headers.common['token'] = token;
    }
    if (process.env.NODE_ENV === 'development') {
      config.headers.common['jasypt'] = '4FjKbe76IfkTMpNItxuO/g=='; // 白名单token ,仅用于本地开发联调
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

const JSONFetch = Axios.create({
  timeout: FETCH_TIMEOUT,
});

JSONFetch.interceptors.response.use(
  function(response) {
    switch (+response.status) {
      case 200:
        return response.data;
      default:
        console.warn('[Fetch Status Error]\n', response);
        return Promise.reject(response.data);
    }
  },
  function(msg) {
    console.error('[Fetch Status Error]\n', msg);

    const { response } = msg || {};
    const { data, status } = response || {};
    let code = status;
    if (data) code = data.error_code || data.ErrorCode || data.err_code;
    if (code + '' === '401') {
      // 401 未授权-跳到账号登录页，可以不清理 cookie，重新登录后会将其覆盖
      if (process.env.NODE_ENV === 'production' && window.parent) {
        window.parent.location.replace('/page/authority/login/login.html');
      } else {
        // window.location.href = '/#/login';
      }
    }
    return Promise.reject({
      status: 500,
      msg,
    });
  }
);

JSONFetch.interceptors.request.use(
  function(config) {
    try {
      config.headers.token = window.localStorage.getItem('sid');
      if (process.env.NODE_ENV === 'development') {
        config.headers['jasypt'] = '4FjKbe76IfkTMpNItxuO/g=='; // 白名单token ,仅用于本地开发联调
      }
    } catch (error) {
      console.log(error);
    }
    return config;
  },
  function(error) {
    console.error('[Fetch Status Error]\n', error);
    return Promise.reject(error);
  }
);
export { JSONFetch };
