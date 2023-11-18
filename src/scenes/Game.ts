import Phaser from 'phaser'
import { createHeroAnims } from '../anims/heroAnims'
import { sceneEvents } from '../events/EventCenter'

export default class Game extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private hero!: Phaser.Physics.Matter.Sprite
    private mainCamera!: Phaser.Cameras.Scene2D.Camera

    private gameEnded: boolean
    private lastLocation: { x: number, y: number }
    private playerPath!: any[]

    private map !: Phaser.Tilemaps.Tilemap
    private floorLayer!: Phaser.Tilemaps.TilemapLayer | null

    constructor() {
        super('game')
        this.lastLocation = { x: 0, y: 0 }
        this.playerPath = []
        this.gameEnded = false
    }

    preload() {

        this.cursors = this.input.keyboard!.createCursorKeys()

    }

    update(): void {
        if (!this.cursors || !this.hero || this.gameEnded) {
            return
        }

        if (this.playerPath.length > 19) {
            sceneEvents.emit('game-over', this.playerPath)
            this.hero.setVelocity(0)
            this.hero.stop()
            this.gameEnded = true
            return
        }

        const SPEED = 8
        let Direction;


        switch (true) {

            case this.cursors.left?.isDown:
                this.hero.setVelocity(-SPEED, 0)
                this.hero.anims.play('walk-left', true);
                Direction = 2
                break;
            case this.cursors.right?.isDown:
                this.hero.setVelocity(SPEED, 0)
                this.hero.anims.play('walk-right', true);
                Direction = 3
                break;
            case this.cursors.up?.isDown:
                this.hero.setVelocity(0, -SPEED)
                this.hero.anims.play('walk-up', true);
                Direction = 1
                break;
            case this.cursors.down?.isDown:
                this.hero.setVelocity(0, SPEED)
                this.hero.anims.play('walk-down', true);
                Direction = 4
                break;

            default: {
                //ToDo: stop the character at next tile 
                this.hero.setVelocity(0)
                this.hero.stop()

            }

        }

        const tile = this.floorLayer?.getIsoTileAtWorldXY(this.hero.x, this.hero.y)
        if (tile && (this.lastLocation.x != tile.x || this.lastLocation.y != tile.y)) {

            this.lastLocation = {
                x: tile.x,
                y: tile.y
            }

            console.log("x : ", this.lastLocation.x, "y ", this.lastLocation.y);

            this.playerPath.push(Direction)

        }

    }

    getDirection(oldLoc: { x: number, y: number }, newLoc: { x: number, y: number }): number {
        /*
        1 - UP
        2 - LEFT
        3-RIGHT
        4 Down
        */

        let direction = 0

        if (oldLoc.x > newLoc.x) {

        } else {

        }


        if (oldLoc.y > newLoc.y) {

        } else {

        }

        return direction;
    }

    getRootBody(body: any) {
        if (body.parent === body) { return body; }
        while (body.parent !== body) {
            body = body.parent;
        }
        return body;
    }

    create() {
        this.scene.run('game-ui')
        const map = this.make.tilemap({ key: "map" })

        this.map = map

        const walls = map.addTilesetImage('walls', 'walls')
        const floors = map.addTilesetImage('floors', 'floors') ?? null

        this.floorLayer = map.createLayer("floors", floors || "")
        const wallLayer = map.createLayer("walls", walls || "")

        wallLayer?.setCollisionByProperty({ collide: true })

        wallLayer?.setCullPadding(4, 4)
        this.floorLayer?.setCullPadding(4, 4)

        if (!wallLayer || !this.floorLayer)
            return

        this.matter.world.convertTilemapLayer(wallLayer, {})

        createHeroAnims(this.anims)

        this.hero = this.matter.add.sprite(2000, 2000, "hero")

        this.hero.setBody({
            height: this.hero.height * 0.3,
            width: this.hero.width * 0.3,
        })

        this.hero.setFixedRotation()
        this.hero.setDepth(4)

        this.mainCamera = this.cameras.main.startFollow(this.hero, true)
        this.cameras.main.setZoom(0.7, 0.7)


        //Add treasure chests
        const chest = this.matter.add.image(2000, 3000, 'chest', undefined, { restitution: 1, label: 'chest' });
        // chest.setBody({
        //     height: chest.height * 0.8,
        //     width: chest.width * 0.8,
        // })
        chest.setFixedRotation()
        chest.setStatic(true)

        this.matter.world.on('collisionstart', this.handleCollision, this)

    }

    handleCollision(event: any) {
        for (let i = 0; i < event.pairs.length; i++) {
            // The tile bodies in this example are a mixture of compound bodies and simple rectangle
            // bodies. The "label" property was set on the parent body, so we will first make sure
            // that we have the top level body instead of a part of a larger compound body.
            const bodyA = this.getRootBody(event.pairs[i].bodyA);
            const bodyB = this.getRootBody(event.pairs[i].bodyB);

            if (bodyA.label === 'chest' || bodyB.label === 'chest') {
                const ballBody = bodyA.label === 'chest' ? bodyA : bodyB;
                const ball = ballBody.gameObject;

                // A body may collide with multiple other bodies in a step, so we'll use a flag to
                // only tween & destroy the ball once.
                if (ball.isBeingDestroyed) {
                    continue;
                }
                ball.isBeingDestroyed = true;

                this.matter.world.remove(ballBody);

                this.tweens.add({
                    targets: ball,
                    flipY: true,
                    x: 0,
                    y: 50,
                    alpha: { value: 0, duration: 1000, ease: 'Power1' },
                    onComplete: ((ball: any) => { ball.destroy(); }).bind(this, ball)
                });


                sceneEvents.emit('coin-collected', ball.x, ball.y)
                this.playerTileIndexing(ball.x, ball.y)
            }
        }

    }


    screenToTileCoordinates(x: number, y: number) {
        // Convert screen coordinates to world coordinates
        let worldX = x - this.scale.width / 2 + this.mainCamera.scrollX;
        let worldY = y - this.mainCamera.scrollY;

        const tileHeight = 128, tileWidth = 256;

        // Convert world coordinates to tile coordinates
        let tileX = Math.floor((worldY / tileHeight) + (worldX / tileWidth)) - this.map.widthInPixels / (2 * tileWidth);
        let tileY = Math.floor((worldY / tileHeight) - (worldX / tileWidth)) + this.map.heightInPixels / (2 * tileHeight);

        return { x: tileX, y: tileY };
    }

    isoToTilePos(isoX: number, isoY: number) {
        const tileWidthHalf = 256 / 2;
        const tileHeightHalf = 128 / 2;

        const tileX = Math.floor(isoX / tileWidthHalf + isoY / tileHeightHalf) - 1;
        const tileY = Math.floor(-isoX / tileWidthHalf + isoY / tileHeightHalf);

        return { x: tileX, y: tileY };
    }

    playerTileIndexing(x: number, y: number) {
        const playerTilePos = this.isoToTilePos(x, y);

        const tile = this.floorLayer?.getIsoTileAtWorldXY(x, y)
        // Get the tile at player's position from layer data
        // const tile = this.floorLayer?.getTileAt(playerTilePos.x, playerTilePos.y);

        console.debug({ tile, playerTilePos })

    }
}