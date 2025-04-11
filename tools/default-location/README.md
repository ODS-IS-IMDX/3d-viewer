# 使用方法

1. location.html で緯度・経度を入力
2. 出力された JSON 文字列を DB corporations.location に設定する

# 再ビルド

## 前準備

```bash
npm install -g browserify
yarn install
```

## ビルド

```bash
browserify src/index.js -o convert.js
```
