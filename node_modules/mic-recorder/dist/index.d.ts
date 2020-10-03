interface ILog {
    msg: String;
    type?: 'success' | 'error';
}
interface IConfig {
    /**
     * 128 or 160 kbit/s – mid-range bitrate quality
     */
    bitRate?: number;
    /**
     * There is a known issue with some macOS machines, where the recording
     * will sometimes have a loud 'pop' or 'pop-click' sound. This flag
     * prevents getting audio from the microphone a few milliseconds after
     * the begining of the recording. It also helps to remove the mouse
     * "click" sound from the output mp3 file.
     */
    startRecordingAt?: number;
    sampleRate?: number;
    encoder?: 'mp3' | 'wav';
    sendLog?: (log: ILog) => void;
}
declare class MicRecorder {
    private config;
    private activeStream;
    private context;
    private microphone;
    private processor;
    private startTime;
    private timerToStart;
    private __encoder;
    private __Context?;
    private log;
    constructor(config?: IConfig);
    /**
     * Starts to listen for the microphone sound
     * @param {MediaStream} stream
     */
    addMicrophoneListener(stream: MediaStream): void;
    /**
     * Disconnect microphone, processor and remove activeStream
     */
    stop(): this;
    /**
     * Requests access to the microphone and start recording
     * @return Promise
     */
    start(): Promise<MediaStream>;
    /**
     * Return Mp3 Buffer and Blob with type mp3
     * @return {Promise<[Array<Int8Array>, Blob]>}
     */
    getAudio(): Promise<[Array<Int8Array>, Blob]>;
}
export default MicRecorder;
