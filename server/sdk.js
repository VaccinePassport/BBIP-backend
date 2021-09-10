'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
var path = require('path');

const ccpPath = path.resolve(__dirname, 'connection.json');

async function send(type, func, args) {
    try {
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log('run sdk.js');
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

        if (type) {
            await contract.submitTransaction(func, ...args);
            console.log('Transaction has been submitted');
            await gateway.disconnect();
            return 'success';
        } else {
            const result = await contract.evaluateTransaction(func, ...args);
            console.log(
                `Transaction has been evaluated, result is: ${result.toString()}`
            );
            return result;
        }
    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        return error;
    }
}

module.exports = {
    send: send,
};