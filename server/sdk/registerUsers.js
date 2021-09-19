'use strict';

const {
    FileSystemWallet,
    Gateway,
    X509WalletMixin,
} = require('fabric-network');
const {
    appAdmin,
    appAdminSecret,
    orgMSPID,
    userName,
} = require('../config/config');

const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'connection.json');

async function main() {
    try {
        const walletPath = path.join(process.cwd(), '..', 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const userExists = await wallet.exists(userName);
        if (userExists) {
            console.log(
                `An identity for the user "${userName}" already exists in the wallet`
            );
            return;
        }

        const adminExists = await wallet.exists(appAdmin);
        if (!adminExists) {
            console.log(
                `An identity for the admin user "${appAdmin}" does not exist in the wallet`
            );
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        const gateway = new Gateway();
        await gateway.connect(ccpPath, {
            wallet,
            identity: appAdmin,
            discovery: { enabled: true, asLocalhost: true },
        });

        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        const secret = await ca.register(
            {
                affiliation: 'org1',
                enrollmentID: userName,
                role: 'client',
            },
            adminIdentity
        );
        const enrollment = await ca.enroll({
            enrollmentID: userName,
            enrollmentSecret: secret,
        });
        const userIdentity = X509WalletMixin.createIdentity(
            orgMSPID,
            enrollment.certificate,
            enrollment.key.toBytes()
        );
        await wallet.import(userName, userIdentity);
        console.log(
            `Successfully registered and enrolled admin user ${userName} and imported it into the wallet`
        );
    } catch (error) {
        console.error(`Failed to register user ${userName}: ${error}`);
        process.exit(1);
    }
}

main();
