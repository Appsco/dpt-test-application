window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-action="retrieveTemporaryDataToken"]').addEventListener('request.response.body', (e) => {
        let response = [];
        response.push(e.detail);
        displayTableData(response);
    })
});

