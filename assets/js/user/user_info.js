$(function () {
    var form = layui.form
    var layer = layui.layer

    // 定义昵称校验规则
    form.verify({
        // 可以是函数也可以是数组
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度为1~6之间'
            }
        }
    })

    // 初始化用户信息
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(res);
                form.val('formUserInfo', res.data)
            }
        });
    }


    // 重置表单数据
    // 给button绑定时要绑定点击事件  
    // 如果是给表单绑则需要绑定reset事件
    $('#btnReset').on('click', function (e) {
        // 阻止表单默认重置行为
        e.preventDefault()
        initUserInfo();
    })

    // 修改资料
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // layer.msg(res.message)
                // 更新成功后直接渲染父页面信息，不需要重新渲染iframe的表单
                // window.parent获取的是iframe的父页面对应的window
                // 调用父页面（index）的更新用户信息和头像的方法
                window.parent.getUserInfo()
            }
        });
    })







})