// import resampler from 'audio-resampler'
// export default function (inputFile: File, targetSampleRate: number): Promise<Float32Array> {
//   return new Promise((resolve, reject) => {
//     resampler(inputFile, targetSampleRate, event => {
//       event.getAudioBuffer((buffer: AudioBuffer) => {
//         resolve(buffer.getChannelData(0))
//       })
//     })
//   });
// }
// directly received by the audioprocess event from the microphone in the browser
export default function resample(sourceAudioBuffer, targetSampleRate) {
    const offlineCtx = new OfflineAudioContext(sourceAudioBuffer.numberOfChannels, sourceAudioBuffer.duration * sourceAudioBuffer.numberOfChannels * targetSampleRate, targetSampleRate);
    var buffer = offlineCtx.createBuffer(sourceAudioBuffer.numberOfChannels, sourceAudioBuffer.length, sourceAudioBuffer.sampleRate);
    // Copy the source data into the offline AudioBuffer
    for (var channel = 0; channel < sourceAudioBuffer.numberOfChannels; channel++) {
        buffer.copyToChannel(sourceAudioBuffer.getChannelData(channel), channel);
    }
    // Play it from the beginning.
    var source = offlineCtx.createBufferSource();
    source.buffer = sourceAudioBuffer;
    source.connect(offlineCtx.destination);
    source.start(0);
    return new Promise((resolve, reject) => {
        offlineCtx.oncomplete = function (e) {
            // `resampled` contains an AudioBuffer resampled at 16000Hz.
            // use resampled.getChannelData(x) to get an Float32Array for channel x.
            var resampled = e.renderedBuffer;
            resolve(resampled);
            // var leftFloat32Array = resampled.getChannelData(0);
            // use this float32array to send the samples to the server or whatever
        };
        offlineCtx.startRendering();
    });
}
//# sourceMappingURL=resampler.js.map