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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
const time_1 = require("./time");
const moment_1 = __importDefault(require("moment"));
const getAllLocation = async () => {
    try {
        const listLocation = [];
        const response = await axios_1.default.get("https://api.myquran.com/v2/sholat/kota/semua");
        const data = response.data.data;
        listLocation.push(...data);
        return listLocation;
    }
    catch (error) {
        console.error(error);
    }
};
const getJadwalSholat = async (locationId) => {
    try {
        const time = new time_1.Time().getHours();
        const response = await axios_1.default.get(`https://api.myquran.com/v2/sholat/jadwal/${locationId.id}/${time.tanggal}`);
        const data = response.data.data.jadwal;
        return data;
    }
    catch (error) {
        console.error(error);
    }
};
async function activate(context) {
    // Membuat item di status bar
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.text = "Fetching data...";
    statusBarItem.show();
    let locationId;
    const listLocation = await getAllLocation();
    let waktu;
    const now = new time_1.Time().getHours().waktu;
    let reminderBeforeValue;
    if (listLocation) {
        const quickPickItems = listLocation.map(location => ({ label: location.lokasi, id: location.id }));
        const selectedLocation = await vscode.window.showQuickPick(quickPickItems, {
            placeHolder: "Pilih lokasi",
        });
        if (selectedLocation) {
            locationId = { id: selectedLocation.id, lokasi: selectedLocation.label };
            waktu = await getJadwalSholat(locationId);
        }
        const reminderBefore = await vscode.window.showInputBox({
            placeHolder: 'Masukkan waktu reminder sebelum waktu sholat (menit)',
            prompt: 'Contoh: 5',
            validateInput: (value) => {
                if (isNaN(Number(value))) {
                    return 'Harus berupa angka';
                }
                return null;
            }
        });
        reminderBeforeValue = Number(reminderBefore).valueOf() * 60000;
    }
    const isHadistSuggetion = await vscode.window.showQuickPick(['Ya', 'Tidak'], {
        placeHolder: 'Apakah ingin mendapatkan hadist?',
    });
    let timeReminder;
    if (!isHadistSuggetion) {
        timeReminder = await vscode.window.showInputBox({
            placeHolder: 'Masukkan waktu popup hadist (menit)',
            prompt: 'Contoh: 5',
            validateInput: (value) => {
                if (isNaN(Number(value))) {
                    return 'Harus berupa angka';
                }
                return null;
            }
        });
    }
    const timeReminderValue = Number(timeReminder).valueOf() * 60000;
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
            vscode.window.showInformationMessage(data.id, { modal: true }, { title: "Syukron" });
        }
        catch (error) {
            statusBarItem.text = "Failed to fetch data";
            console.error(error);
        }
    };
    const fetchDataWaktuSholat = async () => {
        try {
            if (now === waktu.imsak || now === (0, moment_1.default)(waktu.imsak).subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
                if (now === waktu.imsak) {
                    vscode.window.showWarningMessage(`Waktu imsak sekarang: ${now}`, { modal: true }, { title: "Okee" });
                }
                else {
                    vscode.window.showWarningMessage(`Waktu imsak akan segera tiba: ${now}`, { modal: true }, { title: "Okee" });
                }
            }
            else if (now === waktu.subuh || now === (0, moment_1.default)(waktu.subuh).subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
                if (now === waktu.subuh) {
                    vscode.window.showWarningMessage(`Waktu subuh sekarang: ${now}`, { modal: true }, { title: "Okee" });
                }
                else {
                    vscode.window.showWarningMessage(`Waktu subuh akan segera tiba: ${now}`, { modal: true }, { title: "Okee" });
                }
            }
            else if (now === waktu.terbit || now === (0, moment_1.default)(waktu.terbit).subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
                if (now === waktu.terbit) {
                    vscode.window.showWarningMessage(`Waktu terbit sekarang: ${now}`, { modal: true }, { title: "Okee" });
                }
                else {
                    vscode.window.showWarningMessage(`Waktu terbit akan segera tiba: ${now}`, { modal: true }, { title: "Okee" });
                }
            }
            else if (now === waktu.dhuha || now === (0, moment_1.default)(waktu.dhuha).subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
                if (now === waktu.dhuha) {
                    vscode.window.showWarningMessage(`Waktu dhuha sekarang: ${now}`, { modal: true }, { title: "Okee" });
                }
                else {
                    vscode.window.showWarningMessage(`Waktu dhuha akan segera tiba: ${now}`, { modal: true }, { title: "Okee" });
                }
            }
            else if (now === waktu.dzuhur || now === (0, moment_1.default)(waktu.dzuhur).subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
                if (now === waktu.dzuhur) {
                    vscode.window.showWarningMessage(`Waktu dzuhur sekarang: ${now}`, { modal: true }, { title: "Okee" });
                }
                else {
                    vscode.window.showWarningMessage(`Waktu dzuhur akan segera tiba: ${now}`, { modal: true }, { title: "Okee" });
                }
            }
            else if (now === waktu.ashar || now === (0, moment_1.default)(waktu.ashar).subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
                if (now === waktu.ashar) {
                    vscode.window.showWarningMessage(`Waktu ashar sekarang: ${now}`, { modal: true }, { title: "Okee" });
                }
                else {
                    vscode.window.showWarningMessage(`Waktu ashar akan segera tiba: ${now}`, { modal: true }, { title: "Okee" });
                }
            }
            else if (now === waktu.maghrib || now === (0, moment_1.default)(waktu.maghrib).subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
                if (now === waktu.maghrib) {
                    vscode.window.showWarningMessage(`Waktu maghrib sekarang: ${now}`, { modal: true }, { title: "Okee" });
                }
                else {
                    vscode.window.showWarningMessage(`Waktu maghrib akan segera tiba: ${now}`, { modal: true }, { title: "Okee" });
                }
            }
            else if (now === waktu.isya || now === (0, moment_1.default)(waktu.isya).subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
                if (now === waktu.isya) {
                    vscode.window.showWarningMessage(`Waktu isya sekarang: ${now}`, { modal: true }, { title: "Okee" });
                }
                else {
                    vscode.window.showWarningMessage(`Waktu isya akan segera tiba: ${now}`, { modal: true }, { title: "Okee" });
                }
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
    async function initialize() {
        try {
            await getAllLocation();
            if (isHadistSuggetion === 'Ya') {
                fetchData();
                setInterval(fetchData, timeReminderValue);
            }
            fetchDataWaktuSholat();
            setInterval(fetchDataWaktuSholat, 60000);
        }
        catch (error) {
            console.error('Error initializing:', error);
        }
    }
    initialize();
}
function deactivate() { }
//# sourceMappingURL=extension.js.map