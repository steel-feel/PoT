import { Field, Mina, PublicKey, fetchAccount } from 'o1js';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { Game } from './contracts/index.js';

const state = {
    Game: null as null | typeof Game,
    zkapp: null as null | Game,
    transaction: null as null | Transaction,
    gamer: null as null | PublicKey
};

// ---------------------------------------------------------------------------------------

const functions = {
    setActiveInstanceToBerkeley: async (args: {}) => {
        const Berkeley = Mina.Network(
            'https://proxy.berkeley.minaexplorer.com/graphql'
        );
        console.log('Berkeley Instance Created');
        Mina.setActiveInstance(Berkeley);
    },

    setActiveInstanceToLocal: async (args: {}) => {
        const Local = Mina.Network({
            mina: 'http://localhost:8080/graphql',
            archive: "http://localhost:8282/"    // Use https://proxy.berkeley.minaexplorer.com/graphql or https://api.minascan.io/node/berkeley/v1/graphql
        });
        console.log('Local Instance Created');
        Mina.setActiveInstance(Local);
    },

    setGamer: async (args: { user: string }) => {
        state.gamer = PublicKey.fromBase58(args.user);
    },

    loadContract: async (args: {}) => {
        const { Game } = await import('./contracts/game.js');
        console.log("contract loaded");

        state.Game = Game;
    },
    compileContract: async (args: {}) => {
        console.timeStamp("compiling . . . ");

        await state.Game!.compile();
        console.timeStamp("compilation done");
    },

    //To be user with zk app Address
    fetchAccount: async (args: { publicKey58: string }) => {
        const publicKey = PublicKey.fromBase58(args.publicKey58);
        return await fetchAccount({ publicKey });
    },
    initZkappInstance: async (args: { publicKey58: string }) => {
        const publicKey = PublicKey.fromBase58(args.publicKey58);
        state.zkapp = new state.Game!(publicKey);
    },

    /// Found treasure transaction
    /// TODO: define type in place of `any`
    foundTreasureTransanction: async (args: { chests: any[] }) => {
        const { Tree } = await import('./contracts/constants.js');
        /// if issue occur { sender: state.gamer || PublicKey.empty() }, as 1st arg
        const transaction = await Mina.transaction(() => {
            for (const i of args.chests) {
                let keyWitness = Tree.getWitness(Field.from(i.key))
                state.zkapp?.foundTreasure(Field.from(i.x), Field.from(i.y), keyWitness)
            }
        });
        state.transaction = transaction;

    },

    proveTransaction: async (args: {}) => {
        await state.transaction!.prove();
    },
    getTransactionJSON: async (args: {}) => {
        return state.transaction!.toJSON();
    },
};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
    id: number;
    fn: WorkerFunctions;
    args: any;
};

export type ZkappWorkerReponse = {
    id: number;
    data: any;
};

onmessage = async (event: MessageEvent<ZkappWorkerRequest>) => {
    const returnData = await functions[event.data.fn](event.data.args);

    const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData,
    };
    postMessage(message);
}

console.log('Web Worker Successfully Initialized.');