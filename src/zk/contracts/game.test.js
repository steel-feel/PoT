import { AccountUpdate, Field, Mina, PrivateKey } from 'o1js';
import { Game } from './game';
import { Tree } from "./constants";
describe('checkpoint 1', () => {
    let zkAppAddress, zkAppPrivateKey, zkAppInstance, Local;
    beforeAll(async () => {
        const useProof = false;
        Local = Mina.LocalBlockchain({ proofsEnabled: useProof });
        Mina.setActiveInstance(Local);
        const { privateKey: deployerKey, publicKey: deployerAccount } = Local.testAccounts[0];
        // Create a public/private key pair. The public key is your address and where you deploy the zkApp to
        zkAppPrivateKey = PrivateKey.random();
        zkAppAddress = zkAppPrivateKey.toPublicKey();
        // create an instance of Message - and deploy it to zkAppAddress
        zkAppInstance = new Game(zkAppAddress);
        const deployTxn = await Mina.transaction(deployerAccount, () => {
            AccountUpdate.fundNewAccount(deployerAccount);
            zkAppInstance.deploy();
        });
        await deployTxn.prove();
        await deployTxn.sign([deployerKey, zkAppPrivateKey]).send();
    });
    it('user should be able prove aasure discovery', async () => {
        const { privateKey: gamerPrivKey, publicKey: gamerAccount } = Local.testAccounts[0];
        let keyWitness = Tree.getWitness(Field.from(1));
        const txn1 = await Mina.transaction(gamerAccount, async () => {
            await zkAppInstance.foundTreasure(Field.from(14), Field.from(15), keyWitness);
        });
        await txn1.prove();
        return expect(await txn1.sign([gamerPrivKey]).send()).resolves;
    });
});
//# sourceMappingURL=game.test.js.map