// THIS IS A POC FOR GENERATING TOKEN
// DONT USE THIS IN PRODUCTION
const jose = require("jose");
const readline = require("readline");

async function main() {
    const read = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const generate = await new Promise((res) =>
        read.question("generate new private key?(y/n): ", res)
    );
    let privk;
    if (generate.trim().toLowerCase() == "y") {
        console.log("generating new ES256 key pair...");

        const kp = await jose.generateKeyPair("ES256");
        privk = kp.privateKey;
        console.log(
            `JWK private key(used for sigining):\n${JSON.stringify(
                await jose.exportJWK(kp.privateKey)
            )}`
        );
        console.log();
        console.log(
            `JWK d stripped public key(used for verification):\n${JSON.stringify(
                await jose.exportJWK(kp.publicKey)
            )}`
        );
    } else {
        const jwk = await new Promise((res) =>
            read.question("enter jwk secret key: ", res)
        );
        privk = await jose.importJWK(JSON.parse(jwk), "ES256");
    }

    const authorityR = await new Promise((res) =>
        read.question("enter the authority of the key(admin/nft): ", res)
    );
    const authority = authorityR.trim().toLowerCase();
    let authEnc = 0x0;
    if (authority != "admin" && authority != "nft") {
        console.log("invalid authority");
        process.exit(-1);
    }
    switch (authority) {
        case "admin":
            authEnc = ~(~0 << 28);
            break;
        case "nft":
            authEnc = 1;
            break;
        default:
            console.log("invalid authority");
            process.exit(-1);
    }
    const token = await new jose.SignJWT({ authority: authEnc })
        .setProtectedHeader({ alg: "ES256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(privk);

    console.log(
        `generated token of authority "${authority}" with expiry 30d:\n${token}`
    );
}

main().then(() => process.exit(0));