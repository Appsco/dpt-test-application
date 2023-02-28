window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-action="retrieveAuthorizationCode"]')?.addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        document.querySelector('[data-action="retrieveAuthorizationCode"]').querySelector('[data-dpt-cab-id]').value = resp.authorization_code;
        displayTableData(resp);
    })

    document.querySelector('[data-action="obtainAccessToken"]')?.addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        document.querySelector('[data-action="obtainAccessToken"]').querySelector('[data-dpt-cab-id]').value = resp.token;
        displayTableData(resp);
    })

    document.querySelector('[data-action="retrieveOAuthCredentials"]')?.addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        displayTableData(resp);
    })

    document.querySelector('[data-action="listAuthApplications"]')?.addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        displayTableData(resp);
    })

    rememberAuthToken();
    registerPackButton();
});

function rememberAuthToken() {
    let authTokenInputElement = document.querySelector('[name="basic"]');

    if (authTokenInputElement) {
        authTokenInputElement.addEventListener('change', (event) => {
            localStorage.setItem("basic", event.target.value);
        });
    }

    let authToken = localStorage.getItem("basic");
    if (authToken) {
        authTokenInputElement.value = localStorage.getItem("basic");
    }
}

function registerPackButton() {
    let packButton = document.querySelector('.pack-button');

    packButton?.addEventListener('click', () => {
        let clientId = document.querySelector('[name="client_id"]').value;
        let clientSecret = document.querySelector('[name="client_secret"]').value;
        let basicAuth = document.querySelector('[name="basic_auth"]');

        basicAuth.value = btoa(clientId + ':' + clientSecret);
    })
}