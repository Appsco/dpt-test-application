window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-action="listVerifiedAuthenticators"]')?.addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        displayTableData(resp);
    })
    document.querySelector('[data-action="retrieveStrategy"]')?.addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        displayTableData(resp);
    })
});
