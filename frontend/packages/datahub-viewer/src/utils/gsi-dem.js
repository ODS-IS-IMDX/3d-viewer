// Copyright (c) 2025 NTT InfraNet
// @flow

export class DemClient {
  static DEM_URL_LIST = [
    {
      title: 'DEM5A',
      url: 'https://cyberjapandata.gsi.go.jp/xyz/dem5a_png/{z}/{x}/{y}.png',
      minZoom: 15,
      maxZoom: 15
    },
    {
      title: 'DEM5B',
      url: 'https://cyberjapandata.gsi.go.jp/xyz/dem5b_png/{z}/{x}/{y}.png',
      minZoom: 15,
      maxZoom: 15
    },
    {
      title: 'DEM5C',
      url: 'https://cyberjapandata.gsi.go.jp/xyz/dem5c_png/{z}/{x}/{y}.png',
      minZoom: 15,
      maxZoom: 15
    },
    {
      title: 'DEM10B',
      url: 'https://cyberjapandata.gsi.go.jp/xyz/dem_png/{z}/{x}/{y}.png',
      minZoom: 14,
      maxZoom: 14
    }
  ]

  skipTime = 100 // ms

  timer = null
  current = null
  image = null

  constructor () {
    this.onLoad = this.onLoad.bind(this)
    this.onLoadError = this.onLoadError.bind(this)
  }

  cancel () {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  /**
   * 地理院 API を利用して標高を取得します。
   * @param {*} latitude 緯度
   * @param {*} longitude 経度
   * @param {*} onLoaded 読み込み完了時呼び出し
   */
  getElevation (
    latitude: number,
    longitude: number,
    onLoaded: (result: any) => {}
  ): number {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.current = {
        latLng: {
          lat: latitude,
          lng: longitude
        },
        urlList: this.makeUrlList(),
        onLoaded: onLoaded
      }
      this.load(this.current)
    }, this.skipTime)
  }

  makeUrlList (zoomLevel: number) {
    return DemClient.DEM_URL_LIST.flatMap(demInfo => {
      if (demInfo.maxZoom < demInfo.minZoom) {
        const buff = demInfo.maxZoom
        demInfo.maxZoom = demInfo.minZoom
        demInfo.minZoom = buff
      }

      const zoomList = []
      for (let z = demInfo.maxZoom; z >= demInfo.minZoom; z--) {
        zoomList.push({
          url: demInfo.url,
          zoom: z
        })
      }
      return zoomList
    })
  }

  load (current) {
    if (this.current !== current) {
      this.current = null
      return
    }

    if (!this.current.urlList || this.current.urlList.length <= 0) {
      current.onLoaded({
        lat: current.latLng.latitude,
        lng: current.latLng.longitude,
        elev: null
      })
      this.current = null
      return
    }

    const urlInfo = this.current.urlList.shift()

    const latitude = this.current.latLng.lat
    const longitude = this.current.latLng.lng
    const tileInfo = this.getTileInfo(latitude, longitude, urlInfo.zoom)
    const url = this.createUrl(
      urlInfo.url,
      tileInfo.x,
      tileInfo.y,
      urlInfo.zoom
    )

    this.image = document.createElement('img')
    this.image.setAttribute('crossorigin', 'anonymous')

    this.image.addEventListener('load', event => {
      this.onLoad(urlInfo, current, tileInfo, this.image)
    })
    this.image.addEventListener('error', error => {
      this.onLoadError(urlInfo, current, tileInfo, error)
    })
    this.image.src = url
  }

  onLoad (urlInfo, current, tileInfo, img) {
    if (current !== this.current) {
      return
    }

    if (!this.canvas) {
      this.canvas = document.createElement('canvas')
      this.canvas.width = 256
      this.canvas.height = 256
    }

    const ctx = this.canvas.getContext('2d')
    ctx.drawImage(img, 0, 0)

    const imageData = ctx.getImageData(0, 0, 256, 256)
    const idx = tileInfo.pY * 256 * 4 + tileInfo.pX * 4
    const r = imageData.data[idx + 0]
    const g = imageData.data[idx + 1]
    const b = imageData.data[idx + 2]
    let h = 0

    if (r !== 128 || g !== 0 || b !== 0) {
      const d = r * Math.pow(2, 16) + g * Math.pow(2, 8) + b
      h = d < Math.pow(2, 23) ? d : d - Math.pow(2, 24)
      if (h === -Math.pow(2, 23)) {
        h = 0
      } else {
        h *= 0.01
      }

      current.onLoaded({
        lat: current.latLng.latitude,
        lng: current.latLng.longitude,
        elev: h
      })
      this.current = null
    } else {
      this.onLoadError(urlInfo, current, tileInfo, img)
    }
  }

  onLoadError (urlInfo, current, tileInfo, img) {
    if (current !== this.current) {
      this.current = null
      return
    }
    this.load(current)
  }

  createUrl (
    template: string,
    x: string,
    y: string,
    zoomLevel: string
  ): string {
    return template
      .replace('{x}', x)
      .replace('{y}', y)
      .replace('{z}', zoomLevel)
  }

  getTileInfo (latitude: number, longitude: number, zoomLevel: number): any {
    const lonRad = (longitude * Math.PI) / 180
    const R = 128 / Math.PI
    const worldCoordinateX = R * (lonRad + Math.PI)
    const pixelCoordinateX = worldCoordinateX * Math.pow(2, zoomLevel)
    const tileCoordinateX = Math.floor(pixelCoordinateX / 256)

    const latRad = (latitude * Math.PI) / 180
    const worldCoordinateY =
      (-R / 2) * Math.log((1 + Math.sin(latRad)) / (1 - Math.sin(latRad))) + 128
    const pixelCoordinateY = worldCoordinateY * Math.pow(2, zoomLevel)
    const tileCoordinateY = Math.floor(pixelCoordinateY / 256)

    return {
      x: tileCoordinateX,
      y: tileCoordinateY,
      pX: Math.floor(pixelCoordinateX - tileCoordinateX * 256),
      pY: Math.floor(pixelCoordinateY - tileCoordinateY * 256)
    }
  }
}
