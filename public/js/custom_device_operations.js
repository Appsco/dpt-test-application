window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-action="retrieveProfileDevices"]').addEventListener('request.response.body', (e) => {
        let response = e.detail;
        displayTableData(response);
    })
    document.querySelector('[data-action="requestUniqueIdentifier"]').addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        let response = [];
        response.push(resp);
        displayTableData(response);
    })
});
