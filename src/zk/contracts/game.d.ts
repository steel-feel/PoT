import { SmartContract, Field, State, PublicKey, MerkleMapWitness } from 'o1js';
declare const UserTreasure_base: (new (value: {
    user: PublicKey;
    x: import("o1js/dist/node/lib/field.js").Field;
    y: import("o1js/dist/node/lib/field.js").Field;
}) => {
    user: PublicKey;
    x: import("o1js/dist/node/lib/field.js").Field;
    y: import("o1js/dist/node/lib/field.js").Field;
}) & {
    _isStruct: true;
} & import("o1js/dist/node/snarky.js").ProvablePure<{
    user: PublicKey;
    x: import("o1js/dist/node/lib/field.js").Field;
    y: import("o1js/dist/node/lib/field.js").Field;
}> & {
    toInput: (x: {
        user: PublicKey;
        x: import("o1js/dist/node/lib/field.js").Field;
        y: import("o1js/dist/node/lib/field.js").Field;
    }) => {
        fields?: import("o1js/dist/node/lib/field.js").Field[] | undefined;
        packed?: [import("o1js/dist/node/lib/field.js").Field, number][] | undefined;
    };
    toJSON: (x: {
        user: PublicKey;
        x: import("o1js/dist/node/lib/field.js").Field;
        y: import("o1js/dist/node/lib/field.js").Field;
    }) => {
        user: string;
        x: string;
        y: string;
    };
    fromJSON: (x: {
        user: string;
        x: string;
        y: string;
    }) => {
        user: PublicKey;
        x: import("o1js/dist/node/lib/field.js").Field;
        y: import("o1js/dist/node/lib/field.js").Field;
    };
    empty: () => {
        user: PublicKey;
        x: import("o1js/dist/node/lib/field.js").Field;
        y: import("o1js/dist/node/lib/field.js").Field;
    };
};
declare class UserTreasure extends UserTreasure_base {
}
export declare class Game extends SmartContract {
    commitment: State<import("o1js/dist/node/lib/field.js").Field>;
    reducer: {
        dispatch(action: UserTreasure): void;
        reduce<State_1>(actions: UserTreasure[][], stateType: import("o1js/dist/node/lib/provable.js").Provable<State_1>, reduce: (state: State_1, action: UserTreasure) => State_1, initial: {
            state: State_1;
            actionState: import("o1js/dist/node/lib/field.js").Field;
        }, options?: {
            maxTransactionsWithActions?: number | undefined;
            skipActionStatePrecondition?: boolean | undefined;
        } | undefined): {
            state: State_1;
            actionState: import("o1js/dist/node/lib/field.js").Field;
        };
        forEach(actions: UserTreasure[][], reduce: (action: UserTreasure) => void, fromActionState: import("o1js/dist/node/lib/field.js").Field, options?: {
            maxTransactionsWithActions?: number | undefined;
            skipActionStatePrecondition?: boolean | undefined;
        } | undefined): import("o1js/dist/node/lib/field.js").Field;
        getActions({ fromActionState, endActionState, }?: {
            fromActionState?: import("o1js/dist/node/lib/field.js").Field | undefined;
            endActionState?: import("o1js/dist/node/lib/field.js").Field | undefined;
        } | undefined): UserTreasure[][];
        fetchActions({ fromActionState, endActionState, }: {
            fromActionState?: import("o1js/dist/node/lib/field.js").Field | undefined;
            endActionState?: import("o1js/dist/node/lib/field.js").Field | undefined;
        }): Promise<UserTreasure[][]>;
    };
    init(): void;
    foundTreasure(x: Field, y: Field, path: MerkleMapWitness): void;
}
export {};
