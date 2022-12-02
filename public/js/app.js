window.addEventListener('DOMContentLoaded', () => {
    fetchDPTUrl((url) => {
        DPTURL = new URL(url);
        appConfigured(DPTURL);
    })

    rememberAuthToken();
});

function fetchDPTUrl(callback) {
    fetch('/dpt-url', {}).then(r => r.json()).then(r => {
        callback(r.dptUrl);
    });
}

function appConfigured(DPTURL) {
    document.querySelectorAll('[data-call-to-action]').forEach((elem) => {
        let responseContainer = document.querySelector('[data-response-log]');
        let parentNode = elem.closest('[data-action]');
        parentNode.addEventListener('request_status.submitted', (e) => {
            setTimeout(() => {
                checkRequestStatus(e.detail.url, e.detail.id, e.detail.parentNode);
            }, 300);
        })
        elem.addEventListener('click', () => {
            let form = parentNode.querySelector('form');
            let formData = new FormData(form);
            let method = form.method ?? 'get';
            let action = new URL(form.action);
            let executeFormActionUrl = new URL(`${DPTURL.href}`);
            executeFormActionUrl.pathname = action.pathname;
            let options = {
                method: method.toUpperCase()
            };
            let authHeader = document.querySelector('header [name="authorization"]');
            if(authHeader.value !== '') {
                options.headers = {
                    'X-DPT-AUTHORIZATION': authHeader.value
                }
            }
            if(method.toLowerCase() === 'post') {
                options.body = formData;
            }
            responseContainer.innerHTML = '\n\r\n\r\t\t#########################################\t\t#########################################\t\t#########################################\t\t\n\r' + responseContainer.innerHTML;
            responseContainer.innerHTML = '\n\r' + JSON.stringify({ url: executeFormActionUrl}, null, 2) + responseContainer.innerHTML;
            fetch(executeFormActionUrl, options).then((r) => {
                parentNode.querySelector('[data-dpt-cab-id]').value = r.headers.get('X-Dpt-Cab-Id');
                let id = r.headers.get('X-Dpt-Cab-Id');
                checkRequestStatus(DPTURL, id, parentNode);
                r.json().then(resp => {
                    parentNode.dispatchEvent(new CustomEvent('request.response.body', { detail: resp}))
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

function rememberAuthToken() {
    let authTokenInputElement = document.querySelector('[name="authorization"]');

    if (authTokenInputElement) {
        authTokenInputElement.addEventListener('change', (event) => {
            localStorage.setItem("authToken", event.target.value);
        });
    }

    let authToken = localStorage.getItem("authToken");
    if (authToken) {
        authTokenInputElement.value = localStorage.getItem("authToken");
    }
}