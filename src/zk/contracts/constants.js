import { Poseidon, Field, MerkleMap } from "o1js";
const Tree = new MerkleMap();
;
const chectLocs = [
    { x: 2000, y: 3000, key: 1 },
    { x: 2000, y: 3500, key: 2 },
    { x: 2500, y: 3500, key: 3 },
    { x: 2000, y: 2500, key: 4 },
    { x: 2000, y: -2000, key: 5 },
    { x: 2000, y: 4000, key: 6 },
    { x: 1500, y: 3500, key: 7 },
    { x: 1000, y: 3500, key: 8 },
    { x: 500, y: 3500, key: 9 },
    { x: 1000, y: 3000, key: 10 },
    { x: -1000, y: 2000, key: 11 },
    { x: -1500, y: 2000, key: 12 },
    { x: -2000, y: 2100, key: 13 },
];
for (const chest of chectLocs) {
    Tree.set(Field.from(chest.key), Poseidon.hash([Field.from(chest.x), Field.from(chest.y)]));
}
const initialCommitment = Tree.getRoot();
export { chectLocs, initialCommitment, Tree };
//# sourceMappingURL=constants.js.map