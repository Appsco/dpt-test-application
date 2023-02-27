window.addEventListener('DOMContentLoaded', () => {
    window.b64toBlob = (b64Data, contentType='', sliceSize=512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    }
    document.querySelector('[data-action="retrieveProfileDevices"]').addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        let table = displayTableData(resp);
        let profile = '';
        table.querySelectorAll('tr').forEach((elem, index) => {
            if(index === 0) return;
            let button = document.createElement('td');
            profile = elem.querySelector('td:nth-child(2)').innerHTML;
            button.innerHTML = `<button>Download Configuration</button>`;
            elem.append(button);
            button.querySelector('button').addEventListener('click', () => {
                let deviceId = elem.querySelector('td:nth-child(2)').innerHTML;
                fetch('/dpt-url')
                    .then(response => response.json())
                    .then(response => {
                        let DPTURL = new URL(response.dptUrl);
                        let optionsHeader = {};
                        optionsHeader['X-DPT-AUTHORIZATION'] = '' + document.querySelector('header [name="xauth"]').value;
                        let executeFormActionUrl = new URL(`${DPTURL.href}`);
                        executeFormActionUrl.pathname = `/device/download-device-configuration/${deviceId}`;
                        let options = {
                            method: 'GET'.toUpperCase(),
                            headers: optionsHeader
                        };
                        fetch(executeFormActionUrl, options)
                            .then( res => res.json() )
                            .then( resp => {
                                const blob = window.b64toBlob(resp.file, 'application/yaml')
                                const name = resp.name;
                                let file = window.URL.createObjectURL(blob);
                                let a = document.createElement('a');
                                a.setAttribute('href', file);
                                a.setAttribute('target', '_blank');
                                a.setAttribute('download', name);
                                document.body.append(a);
                                a.click();
                                window.URL.revokeObjectURL(file);
                                a.remove();
                            });
                    });
            });
        })
    })

    document.querySelector('[data-action="requestUniqueIdentifier"]').addEventListener('request.response.body', (e) => {
        let resp = e.detail;
        document.querySelector('[data-action="requestUniqueIdentifier"]').querySelector('[data-dpt-cab-id]').value = resp.deviceUniqueIdentifier;
        displayTableData(resp);
    })
});