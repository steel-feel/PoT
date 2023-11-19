import Phaser from "phaser";
import { sceneEvents } from "../events/EventCenter";

export default class GameUI extends Phaser.Scene {
  score: number;
  scoreText!: Phaser.GameObjects.Text;
  remainingSteps!: number;
  remainingStepsText!: Phaser.GameObjects.Text;

  private music: boolean;

  constructor() {
    super({ key: "game-ui" });
    this.score = 0;
    this.remainingSteps = 20;
    this.music = false;
  }

  create() {
    sceneEvents.on("hero-moved", this.handleHeroMove, this);
    sceneEvents.on("coin-collected", this.handleCoinCollection, this);
    sceneEvents.once("game-over", this.handleEndGame, this);

    // this.scoreText = "Coins"
    this.scoreText = this.add.text(20, 50, `Score: ${this.score}`, {
      fontSize: 40,
      color: "black",
    });

    this.remainingStepsText = this.add.text(
      20,
      80,
      `Steps Remaining: ${this.remainingSteps}`,
      {
        fontSize: 40,
        color: "black",
      }
    );

    const paddings = 5;
    const button = this.add
      .text(70, 150, "Music: ON", {
        // fontFamily: 'Roboto',
        backgroundColor: "grey",
        fontSize: "16px",
        padding: {
          left: paddings,
          right: paddings,
          top: paddings,
          bottom: paddings,
        },
        color: "white",
        align: "center",
      })
      .setOrigin(0.5);
    button.setInteractive({ useHandCursor: true });

    const music = this.sound.add("theme", {
      loop: true,
    });

    button.on("pointerdown", () => {
      this.music = !this.music;

      button.setText(`Music: ${this.music ? "OFF" : "ON"}`);
      if (this.music) {
        if (music.isPaused) music.resume();
        else music.play();
      } else {
        music.pause();
      }
    });
  }

  handleHeroMove(movedSteps: number) {
    this.remainingSteps = 20 - movedSteps < 0 ? 0 : 20 - movedSteps;
    this.remainingStepsText.setText(`Steps Remaining: ${this.remainingSteps}`);
  }

  handleCoinCollection(x: number, y: number) {
    console.debug(`COIN x: ${x} , y : ${y}`);
    this.score++;
    this.sound.playAudioSprite("sfx", "ping");
    this.scoreText.setText(`Score: ${this.score}`);
  }

  async handleEndGame(playerPath: number[]) {
    // this.sound.playAudioSprite("sfx", "death");
    this.sound.playAudioSprite("sfx", "numkey", {
      delay: 1,
      loop: true,
    });

    const proof_text = this.add.text(180, 200, `Generating Proof . .`, {
      fontSize: 100,
      color: "black",
    });

    //ToDo: @soham call service here,
    let result = await fetch(
      `http://localhost:1234/prove?solution=${playerPath.join("")}`
    ).finally(async () => {
      setTimeout(() => { this.sound.stopByKey("sfx"); proof_text.destroy() }, 5000)
    });




    //player path is your variable
    console.log({ playerPath, result });



  }
}
