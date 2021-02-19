$(function () {

    // 1.点击注册账号，隐藏登陆区域  显示注册区域
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show()
    })
    // 2.点击登录按钮，隐藏注册区域，显示登录区域
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide()
    })

    // 3.自定义验证规则
    var form = layui.form
    form.verify({
        // 密码规则
        pwd: [
            // 验证表达式
            /^[\S]{6,12}$/,
            // 错误提示信息
            '密码必须为6-12位，且不能输入空格'
        ],
        // 校验两次密码是否输入一致
        repwd: function (value) {
            // 获取注册表单中的密码
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码输入不一致'
            }
        }
    })

    // 4.注册
    var layer = layui.layer
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/reguser",
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()

            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                // 跳转到登陆
                $('#link_login').click()
                // 重置form表单
                $('#form_reg')[0].reset()

            }
        });
    })

    // 5.登陆
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                console.log(res.token);
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        });
    })
})
