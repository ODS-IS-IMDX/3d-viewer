// Copyright (c) 2025 NTT InfraNet
// @flow
import { type Theme } from '@ehv/design-system'
import { transparentize } from 'polished'

export type MapNavigatorTheme = {
  ...Theme,
  Control: Theme,
  Compass: {
    ...Theme,
    OuterRing: Theme,
    InnerTarget: Theme
  },
  HomeButton: Theme,
  ZoomInOut: {
    ZoomIn: Theme,
    ZoomOut: Theme
  },
  CurrentLocation: Theme,
  Mobile: Theme
}

export const mapNavigatorTheme: MapNavigatorTheme = {
  Control: {
    width: 64,
    alignItems: 'center'
  },
  Compass: {
    opacity: 0.75,
    width: 64,
    height: 64,

    circle: {
      opacity: 1
    },
    OuterRing: {
      circle: {
        fill: transparentize(0.5, '#000')
      },
      path: {
        fill: '#fff',
        opacity: 0.5
      },
      states: {
        hover: {
          circle: {
            fill: transparentize(0.3, '#000')
          },
          path: {
            fill: '#fff',
            opacity: 1
          }
        },
        active: {
          path: {
            fill: '#16abe3',
            opacity: 1
          }
        }
      }
    },
    InnerTarget: {
      states: {
        hover: {
          g: {
            fill: '#fff'
          },
          path: {
            fill: transparentize(0.3, '#000')
          }
        },
        active: {
          g: {
            fill: '#16abe3'
          },
          path: {
            fill: '#fff'
          }
        }
      }
    }
  },
  HomeButton: {
    borderRadius: '50%',
    opacity: 0.75,
    height: 45,
    width: 45,

    circle: {
      opacity: 1
    },
    states: {
      hover: {
        opacity: 1
      },
      active: {
        opacity: 1,
        circle: {
          fill: '#16abe3'
        }
      }
    }
  },
  ZoomInOut: {
    width: 41,

    ZoomIn: {
      width: '100%',
      opacity: 0.75,
      display: 'flex',
      alignItems: 'start',

      'svg > g > path:nth-child(1)': {
        opacity: 1
      },
      states: {
        hover: {
          opacity: 1
        },
        active: {
          opacity: 1,

          'svg > g > path:nth-child(1)': {
            fill: '#16abe3'
          }
        }
      }
    },
    ZoomOut: {
      width: '100%',
      opacity: 0.75,
      display: 'flex',
      alignItems: 'end',

      'svg > path:nth-child(2)': {
        opacity: 1
      },
      states: {
        hover: {
          opacity: 1
        },
        active: {
          opacity: 1,

          'svg > path:nth-child(2)': {
            fill: '#16abe3'
          }
        }
      }
    }
  },
  /** 現在地ボタン */
  CurrentLocationButton: {
    borderRadius: '50%',
    opacity: 0.75,
    height: 45,
    width: 45,

    'svg > circle': {
      opacity: 1
    },
    states: {
      hover: {
        opacity: 1
      },
      active: {
        opacity: 1,

        'svg > circle': {
          fill: '#16abe3'
        }
      }
    }
  },
  Mobile: {
    backgroundColor: transparentize(0.5, '#000'),
    borderRadius: '50%',
    height: 40,
    width: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    states: {
      active: {
        backgroundColor: '#16abe3'
      }
    }
  }
}

export default mapNavigatorTheme
