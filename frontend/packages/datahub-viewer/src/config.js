// Copyright (c) 2025 NTT InfraNet
const config = {
  baseUrl: process.env.REACT_APP_PUBLIC_URL,
  datahubServerUrl: process.env.REACT_APP_DATAHUB_SERVER_URL,
  datahubWebSocketServerUrl:
    process.env.REACT_APP_DATAHUB_WEB_SOCKET_SERVER_URL,
  mapBox: {
    token: process.env.REACT_APP_MAPBOX_TOKEN
  },
  cesium: {
    ionServer: process.env.REACT_APP_CESIUM_ION_SERVER
  },
  debug: process.env.REACT_APP_DEBUG === 'true'
}

export default config
