window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-action="getPoolStatus"]')?.addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        displayTableData(resp);
    })
});
