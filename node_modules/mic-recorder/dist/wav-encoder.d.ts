import { IConfig, IEncoder } from './types';
declare class Encoder implements IEncoder {
    private config;
    private dataBuffer;
    constructor(config?: IConfig);
    encode(arrayBuffer: Float32Array): void;
    clearBuffer(): void;
    finish(): Promise<Int8Array[]>;
}
export default Encoder;
