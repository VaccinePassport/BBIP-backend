'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const {
    appAdmin,
    appAdminSecret,
    orgMSPID,
    userName,
} = require('../config/config');

const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

console.log(ccp.certificateAuthorities['ca.user1.bbip.com']);

async function main() {
    try {
        const caInfo = ccp.certificateAuthorities['ca.user1.bbip.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(
            caInfo.url,
            { trustedRoots: caTLSCACerts, verify: false },
            caInfo.caName
        );

        console.log('phase1');

        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        const adminExists = await wallet.exists(appAdmin);
        if (adminExists) {
            console.log(
                'An identity for the admin user "admin" already exists in the wallet'
            );
            return;
        }

        const enrollment = await ca.enroll({
            enrollmentID: appAdmin,
            enrollmentSecret: appAdminSecret,
        });
        const identity = X509WalletMixin.createIdentity(
            orgMSPID,
            enrollment.certificate,
            enrollment.key.toBytes()
        );
        await wallet.import(appAdmin, identity);
        console.log(
            'Successfully enrolled admin user "admin" and imported it into the wallet'
        );
    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}

main();
