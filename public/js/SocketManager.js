export default class SocketManager {
    constructor() {
        this.socket = io();
    }

    emit(eventName, data) {
        this.socket.emit(eventName, data);
    }

    on(eventName, callback) {
        this.socket.on(eventName, callback);
    }
}