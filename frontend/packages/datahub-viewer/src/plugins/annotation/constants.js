// Copyright (c) 2025 NTT InfraNet
// @flow
export const AnnotationTypes = {
  POINT: 'Point',
  LINE_STRING: 'LineString',
  ARROW: 'Arrow',
  POLYGON: 'Polygon',
  RECTANGLE: 'Rectangle',
  TEXT: 'Text'
}

export const DetailsType = {
  ARROW: 'Arrow'
}

export const ANNOTATION_COLOR_LIST = [
  '#FF0000',
  '#800000',
  '#FF00FF',
  '#800080',
  '#00FF00',
  '#008000',
  '#808000',
  '#0000FF',
  '#000080',
  '#00FFFF',
  '#008080',
  '#EDEDED',
  '#C0C0C0',
  '#808080',
  '#000000'
]
export const ANNOTATION_HIGHLIGHT_COLOR_LIST = [
  '#FF3232',
  '#B20000',
  '#FF32FF',
  '#B200B2',
  '#32FF32',
  '#00B200',
  '#B2B200',
  '#3232FF',
  '#0000B2',
  '#32FFFF',
  '#00B2B2',
  '#FFFFFF',
  '#D8D8D8',
  '#999999',
  '#212121'
]
export const TRIANGULAR_CONE_COLOR = {
  ORIGINAL: '#df9056',
  HIGHLIGHT: '#EAB893'
}
export const ANNOTATION_POINT_COLOR = {
  ORIGINAL: '#566adf',
  HIGHLIGHT: '#93A0EA'
}

export const ANNOTATION_TEXT_FONT_SIZE_LIST = [
  10,
  11,
  12,
  14,
  16,
  18,
  20,
  24,
  28,
  32,
  36,
  40,
  44,
  48,
  54,
  60,
  66,
  72,
  80,
  88,
  96
]
export const ANNOTATION_HEX_COLOR = '#00AEEF'
export const ANNOTATION_COLOR = '#00FFFF'
export const ANNOTATION_TEXT_DEFAULT_COLOR = '#EDEDED'

export const ANNOTATION_ZINDEX_FACTOR = 0.1 // 注釈の表示順制御用係数
export const ANNOTATION_EDITING_ZINDEX = 0

export const COORDINATE_DIGIT_AFTER_DECIMAL_POINT = 8 // 座標値の小数点以下の桁数

export const ANNOTAION_FORM_ID = 'annotationForm'

export const ANNOTAION_FILE_LIST_MODAL_TYPE = {
  LIST: 'LIST',
  URL: 'URL'
}

/** アノテーショングラフ設定の単位オプションのvalue */
export const ANNOTAION_GRAPH_X_AXIS_UNIT_OPTIONS_VALUE = {
  HOUR: 'HOUR',
  DAY: 'DAY',
  WEEK: 'WEEK',
  MONTH: 'MONTH',
  OTHERS: 'OTHERS'
}

export const THRESHOLD_CONDITION = {
  GREATER_THAN: 'GREATER_THAN',
  LESS_THAN: 'LESS_THAN'
}

export const THRESHOLD_ACTION_TYPE = {
  NOTICE: 'NOTICE',
  MODEL: 'MODEL'
}

export const OVER_THRESHOLD_ACTION = {
  MAIL: 'mail',
  MODEL_COLOR: 'model_color',
  MODEL_VISIBLE: 'model_visible',
  MODEL_HIDDEN: 'model_hidden'
}

export const MAX_THRESHOLD_SETTING = 10
export const MAX_OVER_THRESHOLD_ACTION = 5
export const UPDATE_INTERVAL_MIN = 5 // [min]
export const OVER_THRESHOLD_ACTION_MODEL_DISTANCE = 5 // [km]

/** CSVグラフデータ端数処理の小数点以下の桁数 */
export const GRAPH_DATA_DECIMAL_PLACES = 2

export const DATA_INTEGRATION_OPERATOR = {
  GREATER_THAN: { name: 'GREATER_THAN', value: false },
  LESS_THAN: { name: 'LESS_THAN', value: false },
  OR_GREATER: { name: 'OR_GREATER', value: true },
  OR_LESS: { name: 'OR_LESS', value: true }
}

export const DATA_INTEGRATION_TYPE = {
  TIMELINE: 'TIMELINER'
}

export const DATA_INTEGRATION_REFERENCE_INFO_TYPE = {
  ASSET: 'asset'
}
