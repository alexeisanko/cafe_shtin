$(document).ready(function () {
    $('.modal_authentication').click(function () {
        let key = this.dataset.key
        if (key === 'next_order') {
            sessionStorage.setItem('is_open_order', "True")
        } else {
            sessionStorage.setItem('is_open_order', "False")
        }
        MicroModal.show('modal_authentication');
        $(".phone-user").mask("+7 (999) 999-99-99");


    })

    $(document).on("submit", "#form_login", function (event) {
        let $form = $(this);
        let url = "http://127.0.0.1:8000/users/check_user/"
        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            data: $form.serialize(),
            success: function (data) {
                switch (data.is_user) {
                    case false:
                        $('.birthday-user').attr('type', 'date')
                        $('.name-user').attr('type', 'text')
                        $('.form__title:first').text('Вы в первый раз?')
                        $('.extra_field').css('display', 'ruby')
                        $form.attr('id', 'form_get_code')
                        break
                    case true:
                        $('.birthday-user').val(data.birthday)
                        $('.name-user').val(data.username)
                        GetConfirmCode($form)
                        break
                }
                $('.phone-user').attr('readonly', 'readonly')
            }
        })
        return false
    })

    $(document).on("submit", "#form_confirm_login", function (event) {
        let $form = $(this);
        let data = $form.serialize() + '&method=confirm_phone'
        let url = "http://127.0.0.1:8000/users/confirm_login/"
        $.ajax({
            type: 'POST',
            url: url,
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log(data)
                if (sessionStorage.getItem('is_open_order') === 'True') {
                    location.reload()
                } else {
                    location.replace("http://127.0.0.1:8000/users/profile/")
                }

            }
        })
        return false
    })

    $(document).on("submit", "#form_get_code", function (event) {
        let $form = $(this);
        GetConfirmCode($form)
        return false
    })

    function GetConfirmCode($form) {
        let url = "http://127.0.0.1:8000/users/confirm_login/"
        let data = $form.serialize() + '&method=get_code'
        $.ajax({
            type: 'POST',
            url: url,
            dataType: 'json',
            data: data,
            success: function (data) {
                console.log(data)
                $form.attr('id', 'form_confirm_login')
                $('.form__title:first').text('Введите код из смс')
                $('.code-user').attr('type', 'text')
                $('.uniq-id').val(data.uniq_id)
            }
        })
    }
})


