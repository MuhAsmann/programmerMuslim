"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = exports.Time = void 0;
const moment_1 = __importDefault(require("moment"));
class Time {
    constructor() { }
    waktu = new Date().getHours() + ":" + new Date().getMinutes();
    date = (0, moment_1.default)(new Date()).format("YYYY-MM-DD");
    getHours() {
        return {
            waktu: this.waktu.toLocaleString(),
            tanggal: this.date.toLocaleString()
        };
    }
}
exports.Time = Time;
class Location {
    location = "1219";
    constructor(location) {
        this.location = location;
    }
    getLocation() {
        return this.location;
    }
    setLocation(location) {
        this.location = location;
    }
}
exports.Location = Location;
//# sourceMappingURL=time.js.map