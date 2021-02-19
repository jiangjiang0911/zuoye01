$(function () {
    var form = layui.form
    // 定义密码规则
    form.verify({
        // 所有密码
        pwd: [
            /^[\S]{6,12}$/,
            '密码只能为6-12位，且不包含空格'
        ],
        // 新密码规则
        samePwd: function (value) {
            if (value == $('[name=oldPwd').val()) {
                return '新旧密码不能重复'
            }
        },
        // 确认密码的规则
        rePwd: function (value) {
            if (value !== $('[name=newPwd').val()) {
                return '两次密码不一致'
            }
        }
    })

    // 添加表单提交事件，发起请求修改密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        // 发起ajax请求
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg(res.message)
                $('.layui-form')[0].reset()
            }
        });
    })











})