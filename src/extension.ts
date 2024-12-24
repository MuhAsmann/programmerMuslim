import * as vscode from "vscode";
import axios from "axios";
import { Time } from "./time";
import { LocationInterface, ResponseInterface, WaktuSholat } from "./inteface";
import moment from "moment";


const getAllLocation = async () => {
  try {
    const listLocation: LocationInterface[] = [];
    const response = await axios.get<ResponseInterface>("https://api.myquran.com/v2/sholat/kota/semua");
    const data = response.data.data;

    listLocation.push(...data);

    return listLocation;
  } catch (error) {
    console.error(error);
  }
};

const getJadwalSholat = async (locationId: LocationInterface) => {
  try {
    const time = new Time().getHours();

    const response = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/${locationId.id}/${time.tanggal}`);

    const data = response.data.data.jadwal;

    return data;

  } catch (error) {
    console.error(error);
  }
};

export async function activate(context: vscode.ExtensionContext) {
  // Membuat item di status bar
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );

  statusBarItem.text = "Fetching data...";
  statusBarItem.show();

  let locationId: LocationInterface;

  const listLocation = await getAllLocation();
  let waktu: WaktuSholat;
  const now = new Time().getHours().waktu;
  let reminderBeforeValue : number;
  if (listLocation) {
    const quickPickItems = listLocation.map(location => ({ label: location.lokasi, id: location.id }));

    const selectedLocation = await vscode.window.showQuickPick(quickPickItems, {
      placeHolder: "Pilih lokasi",
    });

    if (selectedLocation) {
      locationId = { id: selectedLocation.id, lokasi: selectedLocation.label };
      waktu = await getJadwalSholat(locationId);
    }

    const reminderBefore = await vscode.window.showInputBox(
      {
        placeHolder: 'Masukkan waktu reminder sebelum waktu sholat (menit)',
        prompt: 'Contoh: 5',
        validateInput: (value) => {
          if (isNaN(Number(value))) {
            return 'Harus berupa angka';
          }
          return null;
        }
      }
    );

    reminderBeforeValue = Number(reminderBefore).valueOf() * 60000;
  }

  const isHadistSuggetion = await vscode.window.showQuickPick(
    ['Ya', 'Tidak'],
    {
      placeHolder: 'Apakah ingin mendapatkan hadist?',
    }
  );

  let timeReminder;

  if (!isHadistSuggetion) {
    timeReminder = await vscode.window.showInputBox(
      {
        placeHolder: 'Masukkan waktu popup hadist (menit)',
        prompt: 'Contoh: 5',
        validateInput: (value) => {
          if (isNaN(Number(value))) {
            return 'Harus berupa angka';
          }
          return null;
        }
      }
    );
  }

  const timeReminderValue = Number(timeReminder).valueOf() * 60000;
  // Fungsi untuk hit API
  const fetchData = async () => {
    try {
      const response = await axios.get("https://api.myquran.com/v2/hadits/bm/acak"); // Ganti URL API di sini
      const data = response.data.data;

      // Update status bar
      statusBarItem.text = `API Data: ${data.id}`; // Sesuaikan dengan data yang diterima
      statusBarItem.tooltip = "Klik untuk info detail";

      // Event ketika status bar di-klik
      statusBarItem.command = "extension.showPopup";

      vscode.window.showInformationMessage(
        data.id,
        { modal: true },
        { title: "Syukron" }
      );

    } catch (error) {
      statusBarItem.text = "Failed to fetch data";
      console.error(error);
    }
  };


  const fetchDataWaktuSholat = async () => {
    try {

      if (now === waktu.imsak || now === moment(waktu.imsak).subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
        if (now === waktu.imsak) {
          vscode.window.showWarningMessage(
            `Waktu imsak sekarang: ${now}`,
            { modal: true },
            { title: "Okee" }
          );
        } else {
          vscode.window.showWarningMessage(
            `Waktu imsak akan segera tiba: ${now}`,
            { modal: true },
            { title: "Okee" }
          );
        }
      } else if (now === waktu.subuh || now === moment(waktu.subuh).subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
        if (now === waktu.subuh) {
          vscode.window.showWarningMessage(
            `Waktu subuh sekarang: ${now}`,
            { modal: true },
            { title: "Okee" }
          );
        } else {
          vscode.window.showWarningMessage(
            `Waktu subuh akan segera tiba: ${now}`,
            { modal: true },
            { title: "Okee" }
          );
        }
      } else if (now === waktu.terbit || now === moment(waktu.terbit).subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
        if (now === waktu.terbit) {
          vscode.window.showWarningMessage(
            `Waktu terbit sekarang: ${now}`,
            { modal: true },
            { title: "Okee" }
          );
        } else {
          vscode.window.showWarningMessage(
            `Waktu terbit akan segera tiba: ${now}`,
            { modal: true },
            { title: "Okee" }
          );
        }
      } else if (now === waktu.dhuha || now === moment(waktu.dhuha).subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
        if (now === waktu.dhuha) {
          vscode.window.showWarningMessage(
            `Waktu dhuha sekarang: ${now}`,
            { modal: true },
            { title: "Okee" }
          );
        } else {
          vscode.window.showWarningMessage(
            `Waktu dhuha akan segera tiba: ${now}`,
            { modal: true },
            { title: "Okee" }
          );
        }
      } else if (now === waktu.dzuhur || now === moment(waktu.dzuhur).subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
        if (now === waktu.dzuhur) {
          vscode.window.showWarningMessage(
            `Waktu dzuhur sekarang: ${now}`,
            { modal: true },
            { title: "Okee" }
          );
        } else {
          vscode.window.showWarningMessage(
            `Waktu dzuhur akan segera tiba: ${now}`,
            { modal: true },
            { title: "Okee" }
          );
        }
      } else if (now === waktu.ashar || now === moment(waktu.ashar).subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
        if (now === waktu.ashar) {
          vscode.window.showWarningMessage(
            `Waktu ashar sekarang: ${now}`,
            { modal: true },
            { title: "Okee" }
          );
        } else {
          vscode.window.showWarningMessage(
            `Waktu ashar akan segera tiba: ${now}`,
            { modal: true },
            { title: "Okee" }
          );
        }
      } else if (now === waktu.maghrib || now === moment(waktu.maghrib).subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
        if (now === waktu.maghrib) {
          vscode.window.showWarningMessage(
            `Waktu maghrib sekarang: ${now}`,
            { modal: true },
            { title: "Okee" }
          );
        } else {
          vscode.window.showWarningMessage(
            `Waktu maghrib akan segera tiba: ${now}`,
            { modal: true },
            { title: "Okee" }
          );
        }
      } else if (now === waktu.isya || now === moment(waktu.isya).subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
        if (now === waktu.isya) {
          vscode.window.showWarningMessage(
            `Waktu isya sekarang: ${now}`,
            { modal: true },
            { title: "Okee" }
          );
        } else {
          vscode.window.showWarningMessage(
            `Waktu isya akan segera tiba: ${now}`,
            { modal: true },
            { title: "Okee" }
          );
        }
      }

    } catch (error) {
      statusBarItem.text = "Failed to fetch data";
      console.error(error);
    }
  };

  // Register perintah popup
  const disposable = vscode.commands.registerCommand(
    "extension.showPopup",
    () => {
      vscode.window.showInformationMessage(
        "Ini adalah info detail dari data yang di-fetch",
      );
    }
  );

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
    } catch (error) {
      console.error('Error initializing:', error);
    }
  }

  initialize();
}

export function deactivate() { }