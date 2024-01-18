var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { SmartContract, Poseidon, Field, State, state, PublicKey, method, MerkleMapWitness, } from 'o1js';
// we need the initiate tree root in order to tell the contract about our off-chain storage
import { initialCommitment } from "./constants";
export class Game extends SmartContract {
    constructor() {
        super(...arguments);
        // a commitment is a cryptographic primitive that allows us to commit to data, with the ability to "reveal" it later
        this.commitment = State();
        this.events = {
            "user-found-treasure": PublicKey
        };
    }
    init() {
        super.init();
        this.commitment.set(initialCommitment);
    }
    foundTreasure(x, y, path) {
        let commitment = this.commitment.get();
        this.commitment.requireEquals(commitment);
        const cordinateHash = Poseidon.hash([x, y]);
        // we check that the cordinates is within the committed Merkle Tree
        // path.calculateRoot(cordinateHash).assertEquals(commitment);
        const [rootBefore,] = path.computeRootAndKey(cordinateHash);
        this.commitment.requireEquals(rootBefore);
        this.emitEvent("user-found-treasure", this.sender);
    }
}
__decorate([
    state(Field),
    __metadata("design:type", Object)
], Game.prototype, "commitment", void 0);
__decorate([
    method,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Field, Field, MerkleMapWitness]),
    __metadata("design:returntype", void 0)
], Game.prototype, "foundTreasure", null);
//# sourceMappingURL=game.js.map