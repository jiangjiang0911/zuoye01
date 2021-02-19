$(function () {
    getUserInfo()
    var layer = layui.layer
    $('#btnLogOut').on('click', function () {
        layer.confirm('是否确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 1.清除本地存储的token数据
            localStorage.removeItem('token')
            // 2.跳转到登录界面
            location.href = '/login.html'
            layer.close(index);
        });
    })
});

function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // headers: {
        //     Authorization: localStorage.getItem('token')
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }

            // 渲染用户信息和头像
            renderAvatar(res.data)
        }
    });
}

function renderAvatar(user) {
    // 渲染用户信息
    var name = user.nickname || user.username
    $('#welcome').html('欢迎您&nbsp;&nbsp;' + name)

    // 渲染头像信息
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        var text = name[0].toUpperCase()
        $('.layui-nav-img').hide()
        $('.text-avatar').html(text).show()
    }
}
