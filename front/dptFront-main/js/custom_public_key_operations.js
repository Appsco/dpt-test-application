window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('[data-action="requestPublicKey"]').addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        displayTableData(resp);
    })
    let keypair = localStorage.getItem('keypair');
    if (keypair !== null) {
        let parsedKeyPair = JSON.parse(keypair);
        document.querySelector('[data-action="registerPublicKey"] [name="public_key"]').value = parsedKeyPair.signedPublicKey.toUpperCase();
    }
});