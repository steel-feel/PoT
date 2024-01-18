import { MerkleMap } from "o1js";
declare const Tree: MerkleMap;
declare const chectLocs: {
    x: number;
    y: number;
    key: number;
}[];
declare const initialCommitment: import("o1js/dist/node/lib/field").Field;
export { chectLocs, initialCommitment, Tree };
