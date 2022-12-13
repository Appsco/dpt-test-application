window.sodium = {
    onload: function (sodium) {
        if (localStorage.getItem("keypair")) {
            return;
        }
        let versionKey = new Uint8Array(4);
        versionKey[0] = 0x31;
        versionKey[1] = 0x40;
        versionKey[2] = 0x05;
        versionKey[3] = 0x00;
        let keypair = sodium.crypto_box_keypair();
        let withVersion = mergeTwoKeys(versionKey, keypair.publicKey);
        let genericHash = sodium.crypto_generichash(64, withVersion);
        let finalBinary = mergeTwoKeys(withVersion, genericHash);

        localStorage.setItem("keypair", JSON.stringify({
                signedPublicKey: sodium.to_hex(finalBinary),
                publicKey: sodium.to_hex(keypair.publicKey),
                privateKey: sodium.to_hex(keypair.privateKey),
                versionTag: sodium.to_hex(versionKey)
            }
        ));

    }
};

function mergeTwoKeys(one, two) {
    let finalBinary = new Uint8Array(one.length + two.length);
    let i = 0;
    one.forEach(data => {
        finalBinary[i++] = data;
    });

    two.forEach(data => {
        finalBinary[i++] = data;
    });

    return finalBinary;
}