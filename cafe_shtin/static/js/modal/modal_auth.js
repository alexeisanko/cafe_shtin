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
        let url = "/users/check_user/"
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
                        $('.extra_field').css('display', 'flex')
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

    $(document).on("submit", "#form_confirm_login", function  (event) {
        let $form = $(this);
        let data = $form.serialize() + '&method=confirm_phone'
        let url = "/users/confirm_login/"
        $.ajax({
            type: 'POST',
            url: url,
            dataType: 'json',
            data: data,
            success: function (data) {
                if (data['status'] === 'passed') {
                    console.log(data)
                    if (sessionStorage.getItem('is_open_order') === 'True') {
                        location.reload()
                    } else {
                        location.replace("http://127.0.0.1:8000/users/profile/")
                    }
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
        let url = "/users/confirm_login/"
        let data_post = $form.serialize() + '&method=get_code'
        $.ajax({
            type: 'POST',
            url: url,
            dataType: 'json',
            data: data_post,
            success: function (data) {
                console.log(data)
                $form.attr('id', 'form_confirm_login')
                $('.form__title:first').text('Введите код SMS или последние 4 цифры звонка')

                $('#reverse_timer').css('display', 'flex')
                startTimer(90, document.querySelector('#reverse_timer'), $form)
                $('.code-user').attr('type', 'text')
                $('.uniq-id').val(data.uniq_id)
            }
        })
    }

    function startTimer(duration, display, $form) {
        let timer = duration, minutes, seconds;
        setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            display.textContent = "Повторить звонок через " + minutes + ":" + seconds;

            if (--timer < 0) {
                display.textContent = "Повторить звонок";
                $('#reverse_timer').addClass('repeat_call')

            }

        }, 1000);

        $(document).on("click", ".repeat_call", function (event) {
            $(this).removeClass('repeat_call')
            GetConfirmCode($form)
        })
    }

})





