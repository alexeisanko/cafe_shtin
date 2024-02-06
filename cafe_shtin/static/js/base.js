/* Project specific Javascript goes here. */

async function SendRequest(api_method, params, next_function, csrf, type_method = 'GET',  ) {
    let url = new URL(api_method, document.location.origin);
    let body = null
    let headers = {}
    switch (type_method) {
        case "GET":
            for (let [key, value] of Object.entries(params)) {
                url.searchParams.set(key, value);
            }
            break
        case "POST":
            body = JSON.stringify(params)
            headers['Content-Type'] = 'application/json'
            headers['X-CSRFToken'] = csrf
            break
    }
    console.log(url)
    console.log(body)
    let response = await fetch(
        url,
        {
            method: type_method,
            body: body,
            headers: headers,
            mode: 'same-origin'
        });
    if (response.ok) {
        let result = await response.json(); // читаем ответ в формате JSON
        console.log(result)
        next_function(result)
    } else {
        alert("Ошибка HTTP: " + response.status)
    }
}
