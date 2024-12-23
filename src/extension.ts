import * as vscode from "vscode";
import axios, { options } from "axios";
import { MyTreeDataProvider, MyTreeItem } from "./TreeDataProvider";
import { Time } from "./time";


export function activate(context: vscode.ExtensionContext) {
  // Membuat item di status bar
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );

  statusBarItem.text = "Fetching data...";
  statusBarItem.show();

  // Membuat TreeDataProvider
  const treeDataProvider = new MyTreeDataProvider();
  vscode.window.registerTreeDataProvider("myTreeView", treeDataProvider);

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

      // Update TreeView
      const items = [new MyTreeItem(data.id, vscode.TreeItemCollapsibleState.None)];
      treeDataProvider.refresh(items);
    } catch (error) {
      statusBarItem.text = "Failed to fetch data";
      console.error(error);
    }
  };

  const fetchDataWaktuSholat = async () => {
    try {

      const time = new Time().getHours();

      const now = time.waktu;

      const response = await axios.get(`https://api.myquran.com/v2/sholat/jadwal/1219/${time.tanggal}`);

      const data = response.data.data.jadwal;

      const waktu: { waktu: string, imsak: string, subuh: string, terbit: string, dhuha: string, dzuhur: string, ashar: string, maghrib: string, isya: string } = data;

      if (now === waktu.imsak) {
        vscode.window.showWarningMessage(
          `Waktu imsak sekarang: ${now}`,
          { modal: true },
          { title: "Okee" }
        );
      } else if (now === waktu.subuh) {
        vscode.window.showWarningMessage(
          `Waktu subuh sekarang: ${now}`,
          { modal: true },
          { title: "Okee" }
        );
      } else if (now === waktu.terbit) {
        vscode.window.showWarningMessage(
          `Waktu terbit sekarang: ${now}`,
          { modal: true },
          { title: "Okee" }
        );
      } else if (now === waktu.dhuha) {
        vscode.window.showWarningMessage(
          `Waktu dhuha sekarang: ${now}`,
          { modal: true },
          { title: "Okee" }
        );
      } else if (now === waktu.dzuhur) {
        vscode.window.showWarningMessage(
          `Waktu dzuhur sekarang: ${now}`,
          { modal: true },
          { title: "Okee" }
        );
      } else if (now === waktu.ashar) {
        vscode.window.showWarningMessage(
          `Waktu ashar sekarang: ${now}`,
          { modal: true },
          { title: "Okee" }
        );
      } else if (now === waktu.maghrib) {
        vscode.window.showWarningMessage(
          `Waktu maghrib sekarang: ${now}`,
          { modal: true },
          { title: "Okee" }
        );
      } else if (now === waktu.isya) {
        vscode.window.showWarningMessage(
          `Waktu isya sekarang: ${now}`,
          { modal: true },
          { title: "Okee" }
        );
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

  fetchData();
  fetchDataWaktuSholat();
  setInterval(fetchData, 360000);
  setInterval(fetchDataWaktuSholat, 60000);
}

export function deactivate() { }