import Phaser from 'phaser'
import { createHeroAnims } from '../anims/heroAnims'

export default class Game extends Phaser.Scene {

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private hero!: Phaser.Physics.Matter.Sprite

    constructor() {
        super('game')
    }

    preload() {

        this.cursors = this.input.keyboard!.createCursorKeys()

    }

    update(): void {
        if (!this.cursors || !this.hero) {
            return
        }

        const SPEED = 5

        switch (true) {

            case this.cursors.left?.isDown:
                this.hero.setVelocity(-SPEED, 0)
                this.hero.anims.play('walk-left', true);
                break;
            case this.cursors.right?.isDown:
                this.hero.setVelocity(SPEED, 0)
                this.hero.anims.play('walk-right', true);
                break;
            case this.cursors.up?.isDown:
                this.hero.setVelocity(0, -SPEED)
                this.hero.anims.play('walk-up', true);
                break;
            case this.cursors.down?.isDown:
                this.hero.setVelocity(0, SPEED)
                this.hero.anims.play('walk-down', true);
                break;

            default: {
                //ToDo: stop the character at next tile 
                this.hero.setVelocity(0)
                this.hero.stop()

            }

        }

    }

    create() {
        const map = this.make.tilemap({ key: "map" })

        const walls = map.addTilesetImage('walls', 'walls')
        const floors = map.addTilesetImage('floors', 'floors') ?? null

        const floorLayer = map.createLayer("floors", floors || "")
        const wallLayer = map.createLayer("walls", walls || "")

        wallLayer?.setCollisionByProperty({ collide: true })

        wallLayer?.setCullPadding(4, 4)
        floorLayer?.setCullPadding(4, 4)

        if (!wallLayer || !floorLayer)
            return

        this.matter.world.convertTilemapLayer(wallLayer, {})

        createHeroAnims(this.anims)
        this.hero = this.matter.add.sprite(2000, 2000, "hero")

        this.hero.setBody({
            height: this.hero.height * 0.7,
            width: this.hero.width * 0.7,
        })

        this.hero.setFixedRotation()
        this.hero.setDepth(4)

        this.cameras.main.startFollow(this.hero, true)
        this.cameras.main.setZoom(0.7, 0.7)

    }

}