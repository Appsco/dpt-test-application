window.addEventListener('DOMContentLoaded', () => {
    const fetchDpt = fetch('/dpt-url');
    const fetchMqDpt = fetch('/dpt-mq-url');
    let dptUrl;

    fetchDpt
        .then(response => response.json())
        .then(data => {
            dptUrl = data.dptUrl;
            return fetchMqDpt;
        })
        .then(response => response.json())
        .then(response => {
            let DPTURL = new URL(dptUrl);
            let DPTMQURL = new URL(response.dptMqUrl);
            appConfigured(DPTURL, DPTMQURL);
        })
});

function appConfigured(DPTURL, DPTMQURL) {
    document.querySelectorAll('[data-call-to-action]').forEach((elem) => {
        let responseContainer = document.querySelector('[data-response-log]');
        let parentNode = elem.closest('[data-action]');
        let form = parentNode.querySelector('form');
        let mqMessage = form.hasAttribute('data-send-mq');

        if(!mqMessage){
            parentNode.addEventListener('request_status.submitted', (e) => {
                setTimeout(() => {
                    checkRequestStatus(e.detail.url, e.detail.id, e.detail.parentNode);
                }, 300);
            })

            elem.addEventListener('click', () => {
                let formData = new FormData(form);
                let method = form.method ?? 'get';
                let appendParamToUrl = form.hasAttribute('data-append-param');
                let urlParam = '';
                if (appendParamToUrl) {
                    urlParam = formData.entries().next().value[1];
                }
                let action = new URL(form.action);
                let executeFormActionUrl = new URL(`${DPTURL.href}`);
                executeFormActionUrl.pathname = action.pathname + urlParam;
                let options = {
                    method: method.toUpperCase()
                };
                let authHeader = form.dataset.authHeader;
                options.headers = setOptionsHeader(authHeader);
                if (method.toLowerCase() === 'post') {
                    options.body = formData;
                }
                responseContainer.innerHTML = '\n\r\n\r\t\t#########################################\t\t#########################################\t\t#########################################\t\t\n\r' + responseContainer.innerHTML;
                responseContainer.innerHTML = '\n\r' + JSON.stringify({url: executeFormActionUrl}, null, 2) + responseContainer.innerHTML;
                fetch(executeFormActionUrl, options).then((r) => {
                    parentNode.querySelector('[data-dpt-cab-id]').value = r.headers.get('X-Dpt-Cab-Id');
                    let id = r.headers.get('X-Dpt-Cab-Id');
                    checkRequestStatus(DPTURL, id, parentNode);

                    r.json().then(resp => {
                        parentNode.dispatchEvent(new CustomEvent('request.response.body', {detail: resp}))
                        displayResponse(parentNode, resp);
                    })
                })
            })
        } else{
            var ws = new WebSocket(DPTMQURL);
            var client = Stomp.over(ws);
            var on_connect = function() {
                console.log('connected');
                elem.addEventListener('click', () => {
                    let headers = [];
                    headers['x-dpt-token'] = document.querySelector('header [name="xauth"]').value;
                    headers['x-dpt-token-space'] = parentNode.querySelector('[name="x-dpt-token-space"]').value;
                    let body = parentNode.querySelector('[name="data-token"]').value;
                    console.log('headers', headers);
                    console.log('body', body);

                    client.send('/queue/datatokenexchange', headers, JSON.stringify(body));
                })
            };
            var on_error =  function() {};
            client.connect('guest', 'guest', on_connect, on_error, '/');
        }
    });
}

function checkRequestStatus(DPTURL, id, parentNode) {
    if(null === id) return;
    let responseContainer = document.querySelector('[data-response-log]');

    let checkRequestStatusUrl = new URL(`${DPTURL.href}`);
    checkRequestStatusUrl.pathname = `/request-status/${id}`;
    responseContainer.innerHTML = JSON.stringify({ id: id, url: checkRequestStatusUrl, parentNode: parentNode}, null, 2) + responseContainer.innerHTML;
    fetch(checkRequestStatusUrl).then(r => {
        switch (r.status.toString()) {
            case '200':
                responseContainer.innerHTML = '\n\rSuccess' + responseContainer.innerHTML;
                parentNode.dispatchEvent(new CustomEvent('request_status.success', { detail: { id: id, url: DPTURL, parentNode: parentNode}}));
                break;
            case '202':
                responseContainer.innerHTML = '\n\rSubmitted' + responseContainer.innerHTML;
                parentNode.dispatchEvent(new CustomEvent('request_status.submitted', { detail: { id: id, url: DPTURL, parentNode: parentNode}}));
                break;
            case '404':
                responseContainer.innerHTML = '\n\rFailed' + responseContainer.innerHTML;
                parentNode.dispatchEvent(new CustomEvent('request_status.failed', { detail: { id: id, url: DPTURL, parentNode: parentNode}}));
                break;
            default:
                responseContainer.innerHTML = '\n\rPending' + responseContainer.innerHTML;
                parentNode.dispatchEvent(new CustomEvent('request_status.pending', { detail: { id: id, url: DPTURL, parentNode: parentNode}}));
        }
    })
}

function displayResponse(parentNode, resp) {
    let responseContainer = document.querySelector('[data-response-log]');
    responseContainer.innerHTML = JSON.stringify(resp, null, 2) + responseContainer.innerHTML;
}

function setOptionsHeader(authHeader, otherHeaders = []) {
    let optionsHeader= {};

    if (authHeader === 'basic') {
        optionsHeader['Authorization'] = 'Basic ' + document.querySelector('header [name="basic"]').value
    }
    if (authHeader === 'xauth') {
        optionsHeader['X-DPT-AUTHORIZATION'] = document.querySelector('header [name="xauth"]').value
    }

    if(otherHeaders.length > 0){
        otherHeaders.forEach((otherHeader, key) => {optionsHeader[key] = otherHeader})
    }

    return optionsHeader;
}

function displayTableData(responseFromBackend) {
    let response = [];

    if (Array.isArray(responseFromBackend) && responseFromBackend.length) {
        response = responseFromBackend;
    } else if (responseFromBackend.constructor === Object && Object.keys(responseFromBackend).length) {
        response.push(responseFromBackend);
    } else {
        return;
    }

    let container = document.querySelectorAll('.main-content')[1];
    container.querySelectorAll('*').forEach( n => n.remove() );

    let table = document.createElement('table');
    container.appendChild(table);
    let data = Object.keys(response[0]);

    generateTableHead(table, data);
    generateTable(table, response);
}

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}