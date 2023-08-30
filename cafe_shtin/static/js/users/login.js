$(document).ready(function () {
    $('.user_login').click(function (event) {
        let $this = this
        event.preventDefault();
        this.blur(); // Manually remove focus from clicked link.
        $.get(this.href, function (html) {
            $(html).appendTo('body').modal();
            $('#next_page').attr('value', $($this).attr('next_page'))
            $(".phone-user:last").mask("+7 (999) 999-99-99");
        });
    });


    $(document).on("submit", "form", function (event) {
        let $form = $(this);
        $.ajax({
            type: 'POST',
            url: $form.attr('action'),
            dataType: 'json',
            data: $form.serialize(),
            success: function (data) {
                if (data['errors']) {
                    for (let error in data['errors']) {
                        console.log(data['errors'][error])
                        alert(data['errors'][error])
                    }
                } else if ($form.attr('id') === "form_login") {
                    event.preventDefault();
                    $.get(`${this.url}confirm/`, function (html) {
                        $(html).appendTo('body').modal();
                        $('#next_page_confirm').attr('value', $('#next_page_login').attr('value'))
                        $('#number_user_confirm').attr('value', data['user'])
                    })
                } else if ($form.attr('id') === "form_confirm") {

                    if (data['next_page'].includes("basket")) {
                        sessionStorage.setItem('is_open_order', "True")
                        location.reload()
                    } else if (data['next_page'].includes("account")) {
                        location.replace(data['next_page'])
                    }
                }
            }
        })
        return false
    })
})
