// Copyright (c) 2025 NTT InfraNet
module.exports.STATUS_CREATED = 'Created'
module.exports.STATUS_QUEUEING = 'Queueing'
module.exports.STATUS_UPLOADING = 'Uploading'
module.exports.STATUS_NOT_STARTED = 'NotStarted'
module.exports.STATUS_PROCESSING = 'Processing'
module.exports.STATUS_COMPLETED = 'Completed'
module.exports.STATUS_ERROR = 'Error'
module.exports.STATUS_PAUSED = 'Paused'
module.exports.STATUS_STALLED = 'Stalled'

const SITE_CATEGORY = {
  ASSET: 'asset',
  ANNOTATION: 'annotation',
  BLACKBOARD_INTERNAL: 'blackboard-internal',
  BLACKBOARD_EXTERNAL: 'blackboard-external',
  PICTURE: 'picture',
  IMAGE: 'image',
  WMTS: 'wmts',
  QUICK_3D: 'quick-3d',
  VIDEO: 'video',
  DEVICE_ELMO_CAMERA: 'device.elmo-camera'
}
module.exports.SITE_CATEGORY = SITE_CATEGORY
module.exports.SITE_RELATED_BUCKET_INFO = {
  [SITE_CATEGORY.ASSET]: {
    name: 'bucket name',
    isCreate: true,
    responseTargetForSite: true,
    rootDirectoryName: ''
  }
}

module.exports.LOG_PREFIX = '[infra-dx-3dviewer]'
module.exports.LOG_DEBUG = '[infra-dx-3dviewer] '
module.exports.LOG_INFO = '[infra-dx-3dviewer][INFO] '
module.exports.LOG_ERROR = '[infra-dx-3dviewer][ERROR] '
