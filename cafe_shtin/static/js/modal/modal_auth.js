window.addEventListener("load", function () {
    const modal_auth = document.querySelector(".modal_authentication");
    const form_login = document.getElementById("form_login");
    const phone = document.getElementById('phone-user');
    const maskOptions = {
        mask: '+{7} (000) 000-00-00'
    };
    const mask = IMask(phone, maskOptions);

    modal_auth.addEventListener("click", function () {
        let key = this.dataset.key
        if (key === 'next_order') {
            sessionStorage.setItem('is_open_order', "True")
        } else {
            sessionStorage.setItem('is_open_order', "False")
        }
        MicroModal.show('modal_authentication');

    });

    form_login.addEventListener("submit", function (event) {
        event.preventDefault();
        SubmitForm()
    })

    $(document).on("click", ".repeat_call", function (event) {
        $(this).removeClass('repeat_call')
        GetCode($form)
    })

    function SubmitForm() {
        let api_method = new URL(form_login.action).pathname
        let data = {}
        let csrf = null
        for (let element of form_login.elements) {
            if (element.name) {
                if (element.name === 'csrfmiddlewaretoken') {
                    csrf = element.value
                } else {
                    data[element.name] = element.value
                }
            }
        }
        // let data = new FormData(form_login);
        let next_function = null
        let type_method = "GET"
        switch (api_method) {
            case '/users/check_user/':
                next_function = CheckUser
                break
            case '/users/get_code/':
                next_function = GetCode
                data['method']  = 'get_code'
                type_method = "POST"
                break
            case "/users/confirm_login/":
                next_function = ConfirmCode
                data['method']  = 'confirm_phone'
                type_method = "POST"
                break
        }
        if (next_function) {
            SendRequest(api_method, data, next_function, csrf, type_method)
        } else {
            alert("Что-то пошло не так")
        }
    }

    function CheckUser(data) {
        form_login.action = '/users/get_code/'
        if (data.is_user === false) {
            $('.birthday-user').attr('type', 'date')
            $('.name-user').attr('type', 'text')
            $('.form__title:first').text('Вы в первый раз?')
            $('.extra_field').css('display', 'flex')
        } else {
            $('.birthday-user').val(data.birthday)
            $('.name-user').val(data.username)
            SubmitForm()
        }
    }

    function GetCode(data) {
        form_login.action = '/users/confirm_login/'
        $('.form__title:first').text('Введите код SMS или последние 4 цифры звонка')
        $('#reverse_timer').css('display', 'flex')
        startTimer(90, document.getElementById('reverse_timer'))
        $('.code-user').attr('type', 'text')
        $('.uniq-id').val(data.uniq_id)
    }

    function ConfirmCode(data) {
        if (data['status'] === 'passed') {
            console.log(data)
            if (sessionStorage.getItem('is_open_order') === 'True') {
                location.reload()
            } else {
                location.replace("/users/profile/")
            }
        }
    }

    function startTimer(duration, display) {
        let timer = duration, minutes, seconds;
        setInterval(function () {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            display.textContent = "Повторить звонок через " + minutes + ":" + seconds;
            if (--timer < 0) {
                display.textContent = "Повторить звонок";
                document.getElementById('reverse_timer').classList.add('repeat_call')
            }
        }, 1000);
    }
})
