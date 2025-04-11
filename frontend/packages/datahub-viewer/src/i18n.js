// Copyright (c) 2025 NTT InfraNet
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      buttons: {
        done: 'Done',
        delete: 'Delete',
        cancel: 'Cancel',
        confirm: 'Confirm'
      },
      modals: {
        deleteModal: {
          title: 'Confirm',
          confirmation: 'Please confirm you want to delete the {{type}}',
          info: 'This action cannot be undone.'
        },
        setHeightModal: {
          snapToGround: 'Snap to ground'
        }
      },
      errors: {
        required: 'Required'
      },
      colors: {
        yellow: 'Yellow',
        red: 'Red',
        green: 'Green',
        blue: 'Blue',
        purple: 'Purple'
      },
      itemMenu: {
        edit: 'Edit Item',
        detail: 'Detail Info',
        clampToSurface: 'Clamp to surface',
        backFaceDisplay: 'Back Face Display',
        download: 'Download',
        delete: 'Delete',
        overlayProperty: 'List data'
      }
    },
    common: {
      units: {
        km: 'km',
        m: 'm',
        m2: 'm2',
        m3: 'm3',
        tonne: 'tonne',
        'tonne/m3': 'tonne/m3',
        'ton/usyd3': 'tonne/US yd3',
        yd: 'yd',
        sqyd: 'sq yds',
        cuyd: 'cuyd',
        ton: 'ton',
        'ton/cuyd': 'ton/cuyd',
        ft: 'ft',
        'ft-us': 'US ft',
        'us-ft': 'US ft',
        deg: 'deg',
        'Intl ft': 'Intl ft',
        intlFt: 'Intl ft',
        'US ft': 'US ft',
        usFt: 'US ft',
        usft: 'US ft',
        intlSqYds: 'Intl sq yds',
        usSqYds: 'US sq yds',
        usyd2: 'US sq yds',
        usyd3: 'US yd3'
      }
    }
  },
  ja: {
    translation: {
      buttons: {
        done: '完了',
        delete: '削除',
        cancel: 'キャンセル',
        confirm: '確認'
      },
      modals: {
        deleteModal: {
          title: '確認',
          confirmation: '{{ type }} を削除します',
          info: 'この作業はやり直しできません。'
        },
        setHeightModal: {
          snapToGround: '地面にスナップする'
        }
      },
      errors: {
        required: '必須項目'
      },
      colors: {
        yellow: '黄',
        red: '赤',
        green: '緑',
        blue: '青',
        purple: '紫'
      },
      itemMenu: {
        edit: 'アイテムの編集',
        detail: '詳細情報',
        clampToSurface: '表面固定',
        backFaceDisplay: '裏面表示',
        download: 'ダウンロード',
        delete: '削除',
        overlayProperty: 'データ一覧'
      }
    },
    common: {
      units: {
        km: 'km',
        m: 'm',
        m2: 'm2',
        m3: 'm3',
        tonne: 'tonne',
        'tonne/m3': 'tonne/m3',
        'ton/usyd3': 'トン／立方ヤード（US',
        yd: 'yd',
        sqyd: 'sq yds',
        cuyd: 'cuyd',
        ton: 'ton',
        'ton/cuyd': 'ton/cuyd',
        ft: 'ft',
        'ft-us': 'US ft',
        'us-ft': 'US ft',
        deg: 'deg',
        'Intl ft': 'Intl ft',
        intlFt: 'Intl ft',
        'US ft': 'US ft',
        usFt: 'US ft',
        usft: 'US ft',
        intlSqYds: '平方ヤード（国際）',
        usSqYds: 'US sq yds',
        usyd2: 'US sq yds',
        usyd3: 'US yd3'
      }
    }
  },
  zh: {
    translation: {
      buttons: {
        done: '完成',
        delete: '删除',
        cancel: '取消',
        confirm: '确认'
      },
      modals: {
        deleteModal: {
          title: '确认',
          confirmation: '请确认要删除 {{ type }}',
          info: '此操作无法撤消。'
        },
        setHeightModal: {
          snapToGround: '对齐地面'
        }
      },
      errors: {
        required: '必填项'
      }
    },
    common: {
      units: {
        km: 'km',
        m: 'm',
        m2: '平方米',
        m3: 'm3',
        tonne: 'tonne',
        'tonne/m3': 'tonne/m3',
        'ton/usyd3': '吨/美国立方码',
        yd: 'yd',
        sqyd: 'sq yds',
        cuyd: 'cuyd',
        ton: 'ton',
        'ton/cuyd': 'ton/cuyd',
        ft: 'ft',
        'ft-us': 'US ft',
        'us-ft': 'US ft',
        deg: 'deg',
        'Intl ft': 'Intl ft',
        intlFt: 'Intl ft',
        'US ft': 'US ft',
        usFt: 'US ft',
        usft: 'US ft',
        intlSqYds: '国际平方码',
        usSqYds: 'US sq yds',
        usyd2: 'US sq yds',
        usyd3: 'US yd3'
      }
    }
  }
}

i18n.use(LanguageDetector).init({
  resources,
  fallbackLng: 'en',
  detection: {
    order: ['navigator']
  },
  interpolation: {
    escapeValue: false,
    format: (value, format, lng = i18n.language) => {
      if (format.startsWith('date') || format.startsWith('time')) {
        value = typeof value === 'string' ? new Date(value) : value
        switch (format) {
          case 'date_short':
            return value.toLocaleDateString(lng, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          case 'date_month_short':
            return value.toLocaleDateString(lng, {
              year: 'numeric',
              month: 'short'
            })
          case 'date_month_day_short':
            return value.toLocaleDateString(lng, {
              month: 'short',
              day: 'numeric'
            })
          case 'datetime_full':
            return value.toLocaleDateString(lng, {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })
          case 'datetime':
            return value.toLocaleDateString(lng, {
              year: 'numeric',
              month: 'short',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })
          case 'datetime_short':
            return value.toLocaleDateString(lng, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })
          case 'time_short':
            return value.toLocaleTimeString(lng, {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })
          case 'time':
            return value.toLocaleTimeString(lng, {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })
          default:
            return value
        }
      }
    }
  },
  keySeparator: '.' // we use content as keys
})

export const setLanguage = async language => {
  if (language && language === 'ja') {
    await i18n.changeLanguage(language)
  } else {
    await i18n.changeLanguage('en')
  }
}

export default i18n
