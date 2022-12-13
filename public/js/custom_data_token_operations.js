window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-action="retrieveTemporaryDataToken"]').addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        displayTableData(resp);
    })
});

