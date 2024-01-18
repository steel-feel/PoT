import { SmartContract, Field, State, PublicKey, MerkleMapWitness } from 'o1js';
export declare class Game extends SmartContract {
    commitment: State<import("o1js/dist/node/lib/field").Field>;
    events: {
        "user-found-treasure": typeof PublicKey;
    };
    init(): void;
    foundTreasure(x: Field, y: Field, path: MerkleMapWitness): void;
}
