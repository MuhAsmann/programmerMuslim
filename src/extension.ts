import * as vscode from "vscode";
import axios from "axios";
import { Time } from "./time";
import { LocationInterface, ResponseInterface, WaktuSholat } from "./inteface";
import moment from "moment";
import { Choice } from "./constans";


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

const getNextPrayerTime = (now: string, waktu: any) => {
  const prayerTimes = [
    { name: 'subuh', time: waktu.subuh },
    { name: 'terbit', time: waktu.terbit },
    { name: 'dhuha', time: waktu.dhuha },
    { name: 'dzuhur', time: waktu.dzuhur },
    { name: 'ashar', time: waktu.ashar },
    { name: 'maghrib', time: waktu.maghrib },
    { name: 'isya', time: waktu.isya }
  ];

  for (let i = 0; i < prayerTimes.length; i++) {
    if (now < prayerTimes[i].time) {
      return prayerTimes[i];
    }
  }

  return prayerTimes[0];
};

export async function activate(context: vscode.ExtensionContext) {
  // Membuat item di status bar
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );

  let locationId: LocationInterface;

  const listLocation = await getAllLocation();
  let waktu: WaktuSholat;
  const now = new Time().getHours().waktu;
  let reminderBeforeValue: number;
  let nextPrayer = { name: '', time: '' };


  if (listLocation) {
    const quickPickItems = listLocation.map(location => ({ label: location.lokasi, id: location.id }));

    const selectedLocation = await vscode.window.showQuickPick(quickPickItems, {
      placeHolder: "Pilih lokasi",
    });

    if (selectedLocation) {
      locationId = { id: selectedLocation.id, lokasi: selectedLocation.label };
      waktu = await getJadwalSholat(locationId);
      nextPrayer = getNextPrayerTime(now, waktu);
      statusBarItem.text = `[${nextPrayer.name} | ${nextPrayer.time}]`;
      statusBarItem.show();
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
    ) || '5';

    reminderBeforeValue = Number(reminderBefore).valueOf() * 60000;
  }

  const isHadistSuggetion = await vscode.window.showQuickPick(
    [Choice.YA, Choice.TIDAK],
    {
      placeHolder: 'Apakah ingin mendapatkan hadist?',
    }
  );

  let timeReminder;

  if (isHadistSuggetion === Choice.YA) {
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
    ) || '30';
  }

  const timeReminderValue = Number(timeReminder).valueOf() * 60000;
  // Fungsi untuk hit API
  const fetchData = async () => {
    try {
      const response = await axios.get("https://api.myquran.com/v2/hadits/bm/acak");
      const data = response.data.data;

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

      nextPrayer = getNextPrayerTime(now, waktu);
      statusBarItem.text = `[${nextPrayer.name} | ${nextPrayer.time}]`;
      statusBarItem.show();

      statusBarItem.command = "extension.showPopup";
      if (now === waktu.imsak || now === moment(waktu.imsak, 'HH:mm').subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
        if (now === waktu.imsak) {
          vscode.window.showWarningMessage(
            `Waktu imsak sekarang: ${now}`,
            { modal: true },
            { title: Choice.OKEE }
          );
        } else {
          vscode.window.showWarningMessage(
            `Waktu imsak akan segera tiba: ${now}`,
            { modal: true },
            { title: Choice.OKEE }
          );
        }
      } else if (now === waktu.subuh || now === moment(waktu.subuh, 'HH:mm').subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
        if (now === waktu.subuh) {
          vscode.window.showWarningMessage(
            `Waktu subuh sekarang: ${now}`,
            { modal: true },
            { title: Choice.OKEE }
          );
        } else {
          vscode.window.showWarningMessage(
            `Waktu subuh akan segera tiba: ${now}`,
            { modal: true },
            { title: Choice.OKEE }
          );
        }
      } else if (now === waktu.terbit || now === moment(waktu.terbit, 'HH:mm').subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
        if (now === waktu.terbit) {
          vscode.window.showWarningMessage(
            `Waktu terbit sekarang: ${now}`,
            { modal: true },
            { title: Choice.OKEE }
          );
        } else {
          vscode.window.showWarningMessage(
            `Waktu terbit akan segera tiba: ${now}`,
            { modal: true },
            { title: Choice.OKEE }
          );
        }
      } else if (now === waktu.dhuha || now === moment(waktu.dhuha, 'HH:mm').subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
        if (now === waktu.dhuha) {
          vscode.window.showWarningMessage(
            `Waktu dhuha sekarang: ${now}`,
            { modal: true },
            { title: Choice.OKEE }
          );
        } else {
          vscode.window.showWarningMessage(
            `Waktu dhuha akan segera tiba: ${now}`,
            { modal: true },
            { title: Choice.OKEE }
          );
        }
      } else if (now === waktu.dzuhur || now === moment(waktu.dzuhur, 'HH:mm').subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
        if (now === waktu.dzuhur) {
          vscode.window.showWarningMessage(
            `Waktu dzuhur sekarang: ${now}`,
            { modal: true },
            { title: Choice.OKEE }
          );
        } else {
          vscode.window.showWarningMessage(
            `Waktu dzuhur akan segera tiba: ${now}`,
            { modal: true },
            { title: Choice.OKEE }
          );
        }
      } else if (now === waktu.ashar || now === moment(waktu.ashar, 'HH:mm').subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
        if (now === waktu.ashar) {
          vscode.window.showWarningMessage(
            `Waktu ashar sekarang: ${now}`,
            { modal: true },
            { title: Choice.OKEE }
          );
        } else {
          vscode.window.showWarningMessage(
            `Waktu ashar akan segera tiba: ${now}`,
            { modal: true },
            { title: Choice.OKEE }
          );
        }
      } else if (now === waktu.maghrib || now === moment(waktu.maghrib, 'HH:mm').subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
        if (now === waktu.maghrib) {
          vscode.window.showWarningMessage(
            `Waktu maghrib sekarang: ${now}`,
            { modal: true },
            { title: Choice.OKEE }
          );
        } else {
          vscode.window.showWarningMessage(
            `Waktu maghrib akan segera tiba: ${now}`,
            { modal: true },
            { title: Choice.OKEE }
          );
        }
      } else if (now === waktu.isya || now === moment(waktu.isya, 'HH:mm').subtract(reminderBeforeValue, 'minutes').format('HH:mm')) {
        if (now === waktu.isya) {
          vscode.window.showWarningMessage(
            `Waktu isya sekarang: ${now}`,
            { modal: true },
            { title: Choice.OKEE }
          );
        } else {
          vscode.window.showWarningMessage(
            `Waktu isya akan segera tiba: ${now}`,
            { modal: true },
            { title: Choice.OKEE }
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
        `[${nextPrayer.name.toUpperCase()} | ${nextPrayer.time}]`,
      );
    }
  );

  context.subscriptions.push(disposable, statusBarItem);

  async function initialize() {
    try {
      await getAllLocation();
      if (isHadistSuggetion === Choice.YA) {
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