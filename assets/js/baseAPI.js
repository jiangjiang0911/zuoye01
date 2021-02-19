// 开发环境
var baseUrl = 'http://api-breakingnews-web.itheima.net'

// 在发送get(),post(),ajax()之前会触发下面这个函数，会获取到发起请求的所有参数信息
$.ajaxPrefilter(function (options) {
    // console.log(options.url);
    // 1.添加路径前缀
    options.url = baseUrl + options.url
    // console.log(options.url);
    // 2.给有权限的接口配置头信息
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token')
        };
    }

    // 3.拦截未通过身份验证的响应
    options.complete = function (res) {
        // console.log(res);
        var obj = res.responseJSON
        if (obj.status !== 0 && obj.message === "身份认证失败！") {
            // console.log(111);
            // 清除本地token数据
            localStorage.removeItem('token')
            // 跳转到登录页
            location.href = '/login.html'
        }
    }
})