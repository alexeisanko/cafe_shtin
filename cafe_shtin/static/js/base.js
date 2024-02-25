/* Project specific Javascript goes here. */

async function SendRequest(api_method, params, next_function, csrf=null, type_method = 'GET',  ) {
    let url = new URL(api_method, document.location.origin);
    let body = null
    let headers = {}
    if (type_method === 'GET' && params) {
        for (let [key, value] of Object.entries(params)) {
            url.searchParams.set(key, value);
        }
    } else if (type_method === 'POST') {
        body = JSON.stringify(params)
        headers['Content-Type'] = 'application/json'
        headers['X-CSRFToken'] = csrf
    }
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
