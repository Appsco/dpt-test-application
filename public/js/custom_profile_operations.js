window.addEventListener('DOMContentLoaded', () => {
    // Request status Events: [request_status.success, request_status.submitted, request_status.failed, request_status.pending]
    // Action call response event request.response.body

    document.querySelector('[data-action="retrieveTempToken"]')?.addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        document.querySelector('[data-action="retrieveTempToken"]').querySelector('[data-dpt-cab-id]').value = resp.token;
    })

    document.querySelector('[data-action="retrieveAuthToken"]')?.addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        document.querySelector('[data-action="retrieveAuthToken"]').querySelector('[data-dpt-cab-id]').value = resp.token;
        displayTableData(resp);
    })

    document.querySelector('[data-action="retrieveTempToken"]')?.addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        displayTableData(resp);
    })

    document.querySelector('[data-action="retrieveProfileScope"]')?.addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        displayTableData(resp);
    })

    rememberXAuthToken();
});

function rememberXAuthToken() {
    let authTokenInputElement = document.querySelector('[name="xauth"]');
    if (authTokenInputElement) {
        authTokenInputElement.addEventListener('change', (event) => {
            localStorage.setItem("xauth", event.target.value);
        });
    }
    let authToken = localStorage.getItem("xauth");
    if (authToken) {
        authTokenInputElement.value = localStorage.getItem("xauth");
    }
}