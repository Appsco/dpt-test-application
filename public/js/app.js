window.addEventListener('DOMContentLoaded', () => {

    fetch('/dpt-url')
        .then(response => response.json())
        .then(response => {
            let DPTURL = new URL(response.dptUrl);
            appConfigured(DPTURL);
            dataRequestListener(DPTURL);
        });
});

function dataRequestListener(DPTURL) {
    window.addEventListener('request-data', (e) => {
        let token = e.detail.token;
        let profile = e.detail.profile;
        window.dispatchEvent(new CustomEvent('rabbit.setup-listener', {
            detail: {
                profile: profile
            }
        }));

        let formData = new FormData();
        formData.set('token', token);
        let executeFormActionUrl = new URL(`${DPTURL.href}data-token/request-data`);
        let options = {
            method: 'POST'
        };
        options.headers = setOptionsHeader('xauth');
        options.body = formData;
        let responseContainer = document.querySelector('[data-response-log]');
        responseContainer.innerHTML = '\n\r\n\r\t\t#########################################\t\t#########################################\t\t\n\r' + responseContainer.innerHTML;
        responseContainer.innerHTML = '\n\r' + JSON.stringify({url: executeFormActionUrl}, null, 2) + responseContainer.innerHTML;
        fetch(executeFormActionUrl, options);
    })
}
function appConfigured(DPTURL) {
    document.querySelectorAll('[data-call-to-action]').forEach((elem) => {
        let responseContainer = document.querySelector('[data-response-log]');
        let parentNode = elem.closest('[data-action]');
        let form = parentNode.querySelector('form');

        parentNode.addEventListener('request_status.submitted', (e) => {
            setTimeout(() => {
                checkRequestStatus(e.detail.url, e.detail.id, e.detail.parentNode);
            }, 300);
        })

        elem.addEventListener('click', () => {
            let formData = new FormData(form);
            let method = form.method ?? 'get';
            let appendParamToUrl = form.querySelector('[data-append-param]');
            let action = new URL(form.action + (appendParamToUrl !== null ? appendParamToUrl.value : ''));
            let executeFormActionUrl = new URL(`${DPTURL.href}`);
            executeFormActionUrl.pathname = action.pathname;
            let options = {
                method: method.toUpperCase()
            };
            let authHeader = form.dataset.authHeader;
            options.headers = setOptionsHeader(authHeader);
            if (method.toLowerCase() === 'post') {
                options.body = formData;
            }
            responseContainer.innerHTML = '\n\r\n\r\t\t#########################################\t\t#########################################\t\t\n\r' + responseContainer.innerHTML;
            responseContainer.innerHTML = '\n\r' + JSON.stringify({url: executeFormActionUrl}, null, 2) + responseContainer.innerHTML;
            fetch(executeFormActionUrl, options).then((r) => {
                if(r.status >= 300) {
                    r.json().then(r => {
                        responseContainer.innerHTML = '\n\r' + JSON.stringify(r, null, 2) + responseContainer.innerHTML;
                    })
                    parentNode.classList.add('blink-red');
                    setTimeout(() => {parentNode.classList.remove('blink-red');}, 300);
                    return;
                }
                parentNode.querySelector('[data-dpt-cab-id]').value = r.headers.get('X-Dpt-Cab-Id');
                let id = r.headers.get('X-Dpt-Cab-Id');
                checkRequestStatus(DPTURL, id, parentNode);

                r.json().then(resp => {
                    parentNode.dispatchEvent(new CustomEvent('request.response.body', {detail: resp}))
                    displayResponse(parentNode, resp);
                })
            })
        })
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

function setOptionsHeader(authHeader) {
    let optionsHeader = {};

    if (authHeader === 'basic') {
        optionsHeader['Authorization'] = 'Basic ' + document.querySelector('header [name="basic"]').value
    }
    if (authHeader === 'xauth') {
        optionsHeader['X-DPT-AUTHORIZATION'] = document.querySelector('header [name="xauth"]').value
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

    let container = document.querySelector('.main-content');
    container.querySelectorAll('*').forEach( n => n.remove() );

    let table = document.createElement('table');
    container.appendChild(table);
    let data = Object.keys(response[0]);

    generateTableHead(table, data);
    generateTable(table, response);
    return table;
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