window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-action="retrieveProfileDevices"]').addEventListener('request.response.body', (e) => {
        let resp = e.detail;

        console.log('resp ', resp);
        let container = document.querySelectorAll('.main-content')[1];
        let table = document.createElement('table');
        container.appendChild(table);
        let data = Object.keys(resp[0]);

        generateTableHead(table, data);
        generateTable(table, resp);
    })
});
