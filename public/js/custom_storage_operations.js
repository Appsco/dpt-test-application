window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-action="listStorageDevices"]')?.addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        displayTableData(resp);
    })
});
