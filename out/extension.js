"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = exports.Time = void 0;
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
const TreeDataProvider_1 = require("./TreeDataProvider");
const moment_1 = __importDefault(require("moment"));
class Time {
    constructor() { }
    waktu = new Date();
    getHours() {
        this.waktu = new Date();
        return this.waktu.getHours();
    }
}
exports.Time = Time;
class Location {
    constructor() { }
    location = "1219";
    getLocation() {
        return this.location;
    }
    setLocation(location) {
        this.location = location;
    }
}
exports.Location = Location;
function activate(context) {
    // Membuat item di status bar
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.text = "Fetching data...";
    statusBarItem.show();
    // Membuat TreeDataProvider
    const treeDataProvider = new TreeDataProvider_1.MyTreeDataProvider();
    const time = new Time();
    vscode.window.registerTreeDataProvider("myTreeView", treeDataProvider);
    // Fungsi untuk hit API
    const fetchData = async () => {
        try {
            const response = await axios_1.default.get("https://api.myquran.com/v2/hadits/bm/acak"); // Ganti URL API di sini
            const data = response.data.data;
            // Update status bar
            statusBarItem.text = `API Data: ${data.id}`; // Sesuaikan dengan data yang diterima
            statusBarItem.tooltip = "Klik untuk info detail";
            // Event ketika status bar di-klik
            statusBarItem.command = "extension.showPopup";
            vscode.window.showInformationMessage(data.id, { modal: true }, { title: "Okee" });
            // Update TreeView
            const items = [new TreeDataProvider_1.MyTreeItem(data.id, vscode.TreeItemCollapsibleState.None)];
            treeDataProvider.refresh(items);
        }
        catch (error) {
            statusBarItem.text = "Failed to fetch data";
            console.error(error);
        }
    };
    const fetchDataWaktuSholat = async () => {
        try {
            const date = (0, moment_1.default)(new Date()).format("YYYY-MM-DD");
            const now = new Date().getHours() + ":" + new Date().getMinutes();
            const response = await axios_1.default.get(`https://api.myquran.com/v2/sholat/jadwal/1219/${date}`);
            const data = response.data.data.jadwal;
            const waktu = data;
            if (now === waktu.imsak) {
                vscode.window.showInformationMessage("Waktu imsak", { modal: true }, { title: "Okee" });
            }
            else if (now === waktu.subuh) {
                vscode.window.showInformationMessage("Waktu subuh", { modal: true }, { title: "Okee" });
            }
            else if (now === waktu.terbit) {
                vscode.window.showInformationMessage("Waktu terbit", { modal: true }, { title: "Okee" });
            }
            else if (now === waktu.dhuha) {
                vscode.window.showInformationMessage("Waktu dhuha", { modal: true }, { title: "Okee" });
            }
            else if (now === waktu.dzuhur) {
                vscode.window.showInformationMessage("Waktu dzuhur", { modal: true }, { title: "Okee" });
            }
            else if (now === waktu.ashar) {
                vscode.window.showInformationMessage("Waktu ashar", { modal: true }, { title: "Okee" });
            }
            else if (now === waktu.maghrib) {
                vscode.window.showInformationMessage("Waktu maghrib", { modal: true }, { title: "Okee" });
            }
            else if (now === waktu.isya) {
                vscode.window.showInformationMessage("Waktu isya", { modal: true }, { title: "Okee" });
            }
        }
        catch (error) {
            statusBarItem.text = "Failed to fetch data";
            console.error(error);
        }
    };
    // Register perintah popup
    const disposable = vscode.commands.registerCommand("extension.showPopup", () => {
        vscode.window.showInformationMessage("Ini adalah info detail dari data yang di-fetch");
    });
    context.subscriptions.push(disposable, statusBarItem);
    fetchData();
    fetchDataWaktuSholat();
    setInterval(fetchData, 360000);
    setInterval(fetchDataWaktuSholat, 60000);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map