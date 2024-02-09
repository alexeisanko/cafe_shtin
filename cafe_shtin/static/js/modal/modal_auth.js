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
        let form_data = new FormData(form_login)
        let csrf = form_data.get('csrfmiddlewaretoken')
        let data_request = {}
        let next_function = null
        let type_method = "GET"
        switch (api_method) {
            case '/users/check_user/':
                next_function = CheckUser
                data_request = {
                    phone: form_data.get('phone')
                }
                break
            case '/users/get_code/':
                next_function = GetCode
                type_method = "POST"
                data_request = {
                    phone: form_data.get('phone')
                }
                break
            case "/users/confirm_login/":
                next_function = ConfirmCode
                type_method = "POST"
                data_request = {
                    phone: form_data.get('phone'),
                    username: form_data.get('username'),
                    birthday: form_data.get('birthday'),
                    uniq_id: form_data.get('uniq_id'),
                    code_user: form_data.get('code_user')
                }
                break
        }
        if (next_function) {
            SendRequest(api_method, data_request, next_function, csrf, type_method)
        } else {
            alert("Что-то пошло не так")
        }
    }

    function CheckUser(data) {
        form_login.action = '/users/get_code/'
        if (data.is_user === false) {
            document.querySelector(".birthday-user").setAttribute('type', 'date')
            document.querySelector(".name-user").setAttribute('type', 'text')
            $('.form__title:first').text('Вы в первый раз?')
            document.querySelector(".extra_field").style.display = 'flex'
        } else {
            document.querySelector(".birthday-user").value = data.birthday
            document.querySelector(".name-user").value = data.username
            SubmitForm()
        }
    }

    function GetCode(data) {
        form_login.action = '/users/confirm_login/'
        $('.form__title:first').text('Введите код SMS или последние 4 цифры звонка')
        document.getElementById("reverse_timer").style.display = 'flex'
        startTimer(90, document.getElementById('reverse_timer'))
        document.querySelector(".code-user").setAttribute('type', 'text')
        document.querySelector(".uniq-id").value = data.uniq_id

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
