import { fetchAccount, PublicKey } from 'o1js';

import type {
  ZkappWorkerRequest,
  ZkappWorkerReponse,
  WorkerFunctions,
} from './zkWebWorker';

export default class WebWorkerClient {
  // ---------------------------------------------------------------------------------------

  setActiveInstance() {
    return this._call('setActiveInstance', {});
  }

 async loadContract() {
    return this._call('loadContract', {});
  }

  setGamer(gamerPk:string) {
    return this._call('setGamer', {gamerPk});
  }

  compileContract() {
    return this._call('compileContract', {});
  }

  fetchAccount({
    publicKey,
  }: {
    publicKey: PublicKey;
  }): ReturnType<typeof fetchAccount> {
    const result = this._call('fetchAccount', {
      publicKey58: publicKey.toBase58(),
    });
    return result as ReturnType<typeof fetchAccount>;
  }

  initZkappInstance() {
    return this._call('initZkappInstance', { });
  }

  foundTreasureTransanction(chests: any[]) {
    return this._call('foundTreasureTransanction', {chests});
  }

  proveTransaction() {
    return this._call('proveTransaction', {});
  }

  getGamer(): Promise<any> {
    return this._call('getGamer', {});
  }

  async getTransactionJSON() {
    const result = await this._call('getTransactionJSON', {});
    return result;
  }

  // ---------------------------------------------------------------------------------------

  worker: Worker;

  promises: {
    [id: number]: { resolve: (res: any) => void; reject: (err: any) => void };
  };

  nextId: number;

  constructor() {
    this.worker = new Worker(new URL('./zkWebWorker.ts', import.meta.url), {
      type: 'module',
    });
    this.promises = {};
    this.nextId = 0;

    this.worker.onmessage = (event: MessageEvent<ZkappWorkerReponse>) => {
      this.promises[event.data.id].resolve(event.data.data);
      delete this.promises[event.data.id];
    };

  }

  _call(fn: WorkerFunctions, args: any) {
    return new Promise((resolve, reject) => {
      this.promises[this.nextId] = { resolve, reject };

      const message: ZkappWorkerRequest = {
        id: this.nextId,
        fn,
        args,
      };

      this.worker.postMessage(message);

      this.nextId++;
    });
  }
}