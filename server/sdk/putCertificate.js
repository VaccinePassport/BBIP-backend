'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'connection.json');

async function main() {
    try {
        const walletPath = path.join(process.cwd(), '..', 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log('run putCertificate.js');
        console.log(`Wallet path: ${walletPath}`);

        const userExists = await wallet.exists('admin');
        if (!userExists) {
            console.log(
                'An identity for the user "admin" does not exist in the wallet'
            );
            console.log('Run the registUser.js application before retrying');
            return;
        }
        const gateway = new Gateway();
        await gateway.connect(ccpPath, {
            wallet,
            identity: 'admin',
            discovery: { enabled: true, asLocalhost: true },
        });

        const network = await gateway.getNetwork('channeluser1');

        const contract = network.getContract('bbip-cc');

        var email = process.argv[2];
        var date = process.argv[3];
        var type = process.argv[4];
        var number = process.argv[5];
        var location = process.argv[6];

        // 이메일, 날짜, 백신종류, 백신차수
        const result = await contract.submitTransaction(
            'putCertificate',
            email,
            date,
            type,
            number,
            location,
        );
        console.log('Transaction has been submitted, result is:', result);

        await gateway.disconnect();
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
