window.addEventListener('DOMContentLoaded', () => {
    fetch('/dpt-mq-url')
        .then(response => response.json())
        .then(data => {
            configureMQ(data.dptMqUrl)
        });
});

function configureMQ(DPTMQURL) {
    let responseContainer = document.querySelector('[data-response-mq-log]');
    let ws = new WebSocket(DPTMQURL);
    let client = Stomp.over(ws);
    client.debug = (message) => {
        if(!message.includes("PING") && !message.includes("PONG")) {
            responseContainer.innerHTML = '\n\r\n\r\t\t#########################################\t\t#########################################\t\t\n\r' + responseContainer.innerHTML;
            responseContainer.innerHTML = `\n${message}\n` + responseContainer.innerHTML;
        }
    };
    let on_connect = function () {
        document.querySelectorAll('[data-mq-call-to-action]').forEach((elem) => {
            let parentNode = elem.closest('[data-action]');
            elem.addEventListener('click', () => {
                let headers = [];
                headers['x-dpt-token'] = document.querySelector('header [name="xauth"]').value;
                headers['x-dpt-token-space'] = parentNode.querySelector('[name="x-dpt-token-space"]').value;
                let body = parentNode.querySelector('[name="data-token"]').value;

                client.send('/queue/datatokenexchange', headers, JSON.stringify(body));
            })
        });

    };
    let on_error = function () {
    };
    client.connect('guest', 'guest', on_connect, on_error, '/');
}