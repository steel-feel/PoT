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

// PRODUCTION URLS Berkeley
// Archive https://archive.berkeley.minaexplorer.com/
// graphql https://proxy.berkeley.minaexplorer.com/graphql

const functions = {
    setActiveInstance: async (args: {}) => {
        if (!import.meta.env.VITE_GRAPHQL_URL  || !import.meta.env.VITE_ARCHIVE_URL )
        {
            console.log("URl NOT FOUND");
            throw new Error("Node API not set")
        }

        const Network = Mina.Network({
            mina: import.meta.env.VITE_GRAPHQL_URL ,
            archive: import.meta.env.VITE_ARCHIVE_URL
        });
        console.log('Network Instance Created');
        Mina.setActiveInstance(Network);
    },

    setGamer: async (args: { gamerPk: string }) => {
        await fetchAccount({ publicKey:args.gamerPk })
        state.gamer = PublicKey.fromBase58(args.gamerPk);
    },

    getGamer :async (args:{}) => {
        return state.gamer
    },

    loadContract: async (args: {}) => {
        const { Game } = await import('./contracts/game.js');
        state.Game = Game;
    },
    compileContract: async (args: {}) => {
        await state.Game!.compile();
    },

    //To be user with zk app Address
    fetchAccount: async (args: { publicKey58: string }) => {
        const publicKey = PublicKey.fromBase58(args.publicKey58);
        return await fetchAccount({ publicKey });
    },

    initZkappInstance: async (args: { }) => {
        // const publicKey = PublicKey.fromBase58(args.publicKey58);
        const publicKey = PublicKey.fromBase58(import.meta.env.VITE_CONRTACT_PK);
        await fetchAccount({ publicKey })
        state.zkapp = new state.Game!(publicKey);
    },

    /// Found treasure transaction
    /// TODO: define type in place of `any`
    foundTreasureTransanction: async (args: { chests: any[] }) => {
        const { Tree } = await import('./contracts/constants.js');
        /// if issue occur { sender: state.gamer || PublicKey.empty() }, as 1st arg
        const transaction = await Mina.transaction({ sender: state.gamer || PublicKey.empty() },() => {
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