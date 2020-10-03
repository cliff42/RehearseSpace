export interface IConfig {
    sampleRate?: number;
    bitRate?: number;
}
export interface IEncoder {
    encode(arrayBuffer: Float32Array): void;
    clearBuffer(): void;
    finish(): Promise<Int8Array[]>;
}
