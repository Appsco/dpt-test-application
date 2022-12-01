window.addEventListener('DOMContentLoaded', () => {
    // Request status Events: [request_status.success, request_status.submitted, request_status.failed, request_status.pending]
    // Action call response event request.response.body

    document.querySelector('[data-action="retrieveTempToken"]').addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        document.querySelector('[data-action="retrieveTempToken"]').querySelector('[data-dpt-cab-id]').value = resp.token;
    })
});