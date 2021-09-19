'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const { appAdmin, appAdminSecret, orgMSPID } = require('../config/config');


const ccpPath = path.resolve(__dirname, '..', 'connection.json');

async function main() {
    try {
        const walletPath = path.join(process.cwd(), '..', 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const userExists = await wallet.exists(appAdmin);
        if (!userExists) {
            console.log(
                'An identity for the user "admin" does not exist in the wallet'
            );
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccpPath, {
            wallet,
            identity: appAdmin,
            discovery: { enabled: true, asLocalhost: true },
        });

        const network = await gateway.getNetwork('channeluser1');

        const contract = network.getContract('bbip-cc');

        var vaccine_index = process.argv[2];

        const result = await contract.evaluateTransaction(
            'getCertificateByUserId',
            vaccine_index
        );
        console.log(
            `Transaction has been evaluated, result is: ${result.toString()}`
        );
    } catch (error) {
        console.error(`Failed to evaluate transaction: ${error}`);
        process.exit(1);
    }
}

main();
