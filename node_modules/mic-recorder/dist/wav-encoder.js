var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import WavEncoder from 'wav-encoder';
import resampler from './resampler';
import createBuffer from 'audio-buffer-from';
class Encoder {
    constructor(config) {
        this.config = {
            sampleRate: 44100
        };
        this.dataBuffer = [];
        if (config) {
            Object.assign(this.config, config);
        }
        this.clearBuffer();
    }
    encode(arrayBuffer) {
        this.dataBuffer.push(...arrayBuffer.map(e => e));
    }
    clearBuffer() {
        this.dataBuffer = [];
    }
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let data = Float32Array.from(this.dataBuffer);
                // 如果并非默认的41000，则需要进行resample
                if (this.config.sampleRate !== 44100) {
                    let inputBuffer = createBuffer(data, {
                        sampleRate: 44100,
                        channels: 1
                    });
                    let resampledBuffer = yield resampler(inputBuffer, this.config.sampleRate);
                    data = resampledBuffer.getChannelData(0);
                }
                let resBuffer = yield WavEncoder.encode({
                    sampleRate: this.config.sampleRate,
                    channelData: [data]
                });
                return [new Int8Array(resBuffer)];
            }
            catch (error) {
                throw error;
            }
        });
    }
}
export default Encoder;
//# sourceMappingURL=wav-encoder.js.map