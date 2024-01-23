import Phaser from "phaser";
import { sceneEvents } from "../events/EventCenter";
import { Game } from '../zk/contracts'
import { Tree, chectLocs } from "../zk/constants";
import { Field, Mina, PublicKey, Reducer, fetchAccount } from "o1js";
import type WebWorkerClient from '../zk/WebWorkerClient'


export default class GameUI extends Phaser.Scene {
  score: number;
  scoreText!: Phaser.GameObjects.Text;
  // saveButton!: Phaser.GameObjects.Text;
  displayAccount!: string;
  zkappWorkerClient!: WebWorkerClient;

  constructor() {
    super({ key: "game-ui" });
    this.score = 0;
  }

  async init() {
    //@ts-ignore
    const accounts = await window.mina.requestAccounts();

    this.displayAccount = `${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;

    await this.zkappWorkerClient.setGamer(accounts[0])

    //set network
    await this.zkappWorkerClient.setActiveInstance()

    //load contract public key
    await this.zkappWorkerClient.initZkappInstance();

    this.add.text(20, 30, this.displayAccount, {
      fontStyle: "bold",
      backgroundColor: "white",
      fontSize: 20,
      color: "green",
    });

    //debug button
    const debugButton = this.add.text(20, 200, 'Debug')
      .setPadding(10)
      .setStyle({ backgroundColor: '#111' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', this.onDebug, this)
      .on('pointerover', () => debugButton.setStyle({ fill: '#f39c12' }))
      .on('pointerout', () => debugButton.setStyle({ fill: '#FFF' }))
  }

  async onDebug() {
    // const zkAppInstance = this.getZkApp();
    //@ts-ignore
    const Network = Mina.Network({
      mina: 'http://localhost:8080/graphql',
      archive: "http://localhost:8282/"    // Use https://proxy.berkeley.minaexplorer.com/graphql or https://api.minascan.io/node/berkeley/v1/graphql
    });
    // const Network = Mina.Network({
    //   mina: 'https://api.minascan.io/node/berkeley/v1/graphql', 
    //   archive: "https://api.minascan.io/archive/berkeley/v1/graphql/"    // Use https://proxy.berkeley.minaexplorer.com/graphql or https://api.minascan.io/node/berkeley/v1/graphql
    // });
    Mina.setActiveInstance(Network);
    const { zkAppInstance } = this.getZkApp();
    // const events = await Network.fetchEvents(zkAppAddress)

    const events = await zkAppInstance.reducer.fetchActions({
      fromActionState: Reducer.initialActionState
    })

    //@ts-ignore
    let user = events[0][0].user


  }

  getZkApp() {
    const contractPK = import.meta.env.VITE_CONRTACT_PK
    const zkAppAddress = PublicKey.fromBase58(contractPK)
    // const zkAppAddress = PublicKey.fromBase58('B62qrm5WMHBFPVjuhxQ1J8VYgLs14t1Wru6Jxwvm8x7sNWB7drG2NVr')
    const zkAppInstance = new Game(zkAppAddress);

    return { zkAppAddress, zkAppInstance };
  }

  async create() {
    // await Game.compile()

    sceneEvents.once("coin-collected", this.createSaveButton, this);
    sceneEvents.on("coin-collected", this.handleCoinCollection, this);
    // this.scoreText = "Coins"
    this.scoreText = this.add.text(20, 50, `Score: ${this.score}`, {
      fontSize: 40,
      color: "black",
    });


  }

  createSaveButton() {
    const saveButton = this.add.text(20, 100, 'Save')
      .setPadding(10)
      .setStyle({ backgroundColor: '#111' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', this.onSave, this)
      .on('pointerover', () => saveButton.setStyle({ fill: '#f39c12' }))
      .on('pointerout', () => saveButton.setStyle({ fill: '#FFF' }))
  }

  onSave() {
    //ToDo. clean and modularise
    const gameScene = this.scene.get("game")
    //@ts-ignore
    const playerChests = gameScene?.playerZk.myChests;
    const playerChestSet = new Set()
    for (const pc of playerChests) {
      playerChestSet.add(pc.x.toString().concat(pc.y.toString()))
    }

    const txnChests = chectLocs.filter((x) => playerChestSet.has(x.x.toString().concat(x.y.toString())));

    this.sendMinaTxn(txnChests)
      .catch(x => console.log(x));
  }

  async sendMinaTxn(txnChests: any[]) {

    try {

      console.log("create txn");
      await this.zkappWorkerClient.foundTreasureTransanction(txnChests)
      console.log("Prove txn");
      await this.zkappWorkerClient.proveTransaction();

      const tx = await this.zkappWorkerClient.getTransactionJSON()

      //@ts-ignore
      const a = await fetchAccount({ publicKey: (await window.mina.getAccounts())[0] }, import.meta.env.VITE_GRAPHQL_URL)
      console.log(`fetch account value ${JSON.stringify(a)}`);

      //@ts-ignore
      const { hash } = await window.mina.sendTransaction({
        transaction: tx,
        feePayer: {
          fee: '',
          memo: 'game',
        },
      });

      console.log(hash);
    } catch (err: any) {
      // You may want to show the error message in your UI to the user if the transaction fails.
      console.log(err);
    }


  }


  handleCoinCollection() {
    console.count("handle coin")
    this.score++;
    this.sound.playAudioSprite("sfx", "ping");
    this.scoreText.setText(`Score: ${this.score}`);
  }


}
