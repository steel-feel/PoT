interface zkPoint {
    x: number;
    y:number;
}

class zkData {
    myChests: zkPoint[];
    constructor(){
        this.myChests = []
    }

    addChest(loc: zkPoint) {
        this.myChests.push(loc)
    }

}

export {zkData}