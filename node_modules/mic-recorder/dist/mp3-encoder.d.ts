import { IConfig, IEncoder } from './types';
declare type Buffer = Int8Array;
declare class Encoder implements IEncoder {
    private config;
    private mp3Encoder;
    /**
     * Audio is processed by frames of 1152 samples per audio channel
     * http://lame.sourceforge.net/tech-FAQ.txt
     */
    private maxSamples;
    private samplesMono;
    private dataBuffer;
    constructor(config?: IConfig);
    /**
     * Clear active buffer
     */
    clearBuffer(): void;
    /**
     * Append new audio buffer to current active buffer
     * @param {Buffer} buffer
     */
    appendToBuffer(buffer: Buffer): void;
    /**
     * Float current data to 16 bits PCM
     * @param {Float32Array} input
     * @param {Int16Array} output
     */
    floatTo16BitPCM(input: Float32Array, output: Int16Array): void;
    /**
     * Convert buffer to proper format
     * @param {Float32Array} arrayBuffer
     */
    convertBuffer(arrayBuffer: Float32Array): Int16Array;
    /**
     * Encode and append current buffer to dataBuffer
     * @param {Float32Array} arrayBuffer
     */
    encode(arrayBuffer: Float32Array): void;
    /**
     * Return full dataBuffer
     */
    finish(): Promise<Int8Array[]>;
}
export default Encoder;
