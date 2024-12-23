import moment from "moment";
import { TimeInterface } from "./inteface";
export class Time {
    constructor() { }

    private waktu = new Date().getHours() + ":" + new Date().getMinutes();
    private date = moment(new Date()).format("YYYY-MM-DD");

    getHours(): TimeInterface {
        return {
            waktu: this.waktu.toLocaleString(),
            tanggal: this.date.toLocaleString()
        };
    }
}

export class Location {

    private location = "1219";

    constructor(
        location: string
    ) {
        this.location = location;
    }

    getLocation(): string {
        return this.location;
    }

    setLocation(location: string): void {
        this.location = location;
    }
}