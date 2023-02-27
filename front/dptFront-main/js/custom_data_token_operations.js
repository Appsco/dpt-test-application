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
    document.querySelector('[data-action="listDataTokens"]').addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        let table = displayTableData(resp);
        if(resp.length > 0){
            let profile = '';
            table.querySelectorAll('tr').forEach((elem, index) => {
                if(index === 0) return;
                let button = document.createElement('td');
                profile = elem.querySelector('td:nth-child(3)').innerHTML;
                button.innerHTML = `<button>Retrieve Data</button>`;
                elem.append(button);
                button.querySelector('button').addEventListener('click', () => {
                    let token = elem.querySelector('td:nth-child(5)').innerHTML;
                    window.dispatchEvent(new CustomEvent('request-data', {
                        detail: {
                            profile: profile,
                            token: token,
                        }
                    }));
                });
            })
        }
    })
});
