import { AccountUpdate, Field, Mina, PrivateKey, Reducer } from 'o1js';
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
    test('user should be able prove treasure discovery', async () => {
        const { privateKey: gamerPrivKey, publicKey: gamerAccount } = Local.testAccounts[0];
        let keyWitness = Tree.getWitness(Field.from(1));
        const txn1 = await Mina.transaction(gamerAccount, async () => {
            zkAppInstance.foundTreasure(Field.from(2000), Field.from(3000), keyWitness);
        });
        await txn1.prove();
        return expect(await txn1.sign([gamerPrivKey]).send()).resolves;
    });
    test('Previously found treasure should NOT be re-discovered', async () => {
        const { publicKey: gamerAccount } = Local.testAccounts[0];
        let keyWitness = Tree.getWitness(Field.from(1));
        return expect(Mina.transaction(gamerAccount, () => {
            zkAppInstance.foundTreasure(Field.from(2000), Field.from(3000), keyWitness);
        })).rejects.toThrow();
    });
    test('Should emit actions', async () => {
        const { publicKey: gamerAccount } = Local.testAccounts[0];
        const actions = await zkAppInstance.reducer.fetchActions({
            fromActionState: Reducer.initialActionState
        });
        expect(actions[0][0].user.toBase58()).toEqual(gamerAccount.toBase58());
    });
});
//# sourceMappingURL=game.test.js.map