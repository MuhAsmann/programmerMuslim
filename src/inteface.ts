export type TimeInterface = {
    waktu: string,
    tanggal: string
}

export type LocationInterface = {
    id: string,
    lokasi: string
} 

export type ResponseInterface = {
    status: boolean,
    request: any,
    data: LocationInterface[]
}

export type WaktuSholat = {
    waktu: string,
    imsak: string,
    subuh: string,
    terbit: string,
    dhuha: string,
    dzuhur: string,
    ashar: string,
    maghrib: string,
    isya: string
}
