var gateway = `ws://${window.location.hostname}/ws`;
var websocket;

window.addEventListener('load', onload);

function onload(event) {
    initWebSocket();
    initSendDataButton();
}

function initWebSocket() {
    console.log('Trying to open a WebSocket connection…');
    websocket = new WebSocket(gateway);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
}

function onOpen(event) {
    console.log('Connection opened');
}

function onClose(event) {
    console.log('Connection closed');
    setTimeout(initWebSocket, 2000);
}

function onMessage(event) {
    console.log("Dari ESP32:", event.data);

    try {
        var obj = JSON.parse(event.data);

        if (obj.beratValue !== undefined)
            document.getElementById("beratValue").innerHTML = obj.beratValue;

        if (obj.tinggiValue !== undefined)
            document.getElementById("tinggiValue").innerHTML = obj.tinggiValue;

        if (obj.tekananValue !== undefined)
            document.getElementById("tekananValue").innerHTML = obj.tekananValue;

        if (obj.bmiValue !== undefined)
            document.getElementById("bmiValue").innerHTML = obj.bmiValue;

        if (obj.bmiKategori !== undefined)
            document.getElementById("bmiKategori").innerHTML = obj.bmiKategori;

    } catch (e) {
        console.log("Pesan bukan JSON");
    }
}

function initSendDataButton() {
    document.getElementById('sendDataBtn').addEventListener('click', function(e){
        e.preventDefault();
        sendData();
    });
}

function sendData() {
    let data = {
        nama: document.getElementById("name").value,
        umur: document.getElementById("age").value,
        kelamin: document.getElementById("jenis-kelamin").value,
        email: document.getElementById("email").value
    };

    if (data.nama === "" || data.umur === "" ||
        data.kelamin === "Pilih" || data.email === "") {

        alert("Semua data harus diisi!");
        return;
    }

    websocket.send(JSON.stringify(data));

    alert("Data terkirim:\n" + JSON.stringify(data, null, 2));
}