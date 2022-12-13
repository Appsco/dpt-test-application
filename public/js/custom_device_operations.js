window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-action="retrieveProfileDevices"]').addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        displayTableData(resp);
    })
    document.querySelector('[data-action="requestUniqueIdentifier"]').addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        displayTableData(resp);
    })
});
