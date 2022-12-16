window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-action="retrieveTemporaryDataToken"]').addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        displayTableData(resp);
        document.querySelector('[data-action="retrieveTemporaryDataToken"]').querySelector('[data-dpt-cab-id]').value = resp.token;
    })
    document.querySelector('[data-action="exchangeDataForToken"]').addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        displayTableData(resp);
        document.querySelector('[data-action="retrieveTemporaryDataToken"]').querySelector('[data-send-mq]').value = resp.token;
    })
});

