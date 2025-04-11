// Copyright (c) 2025 NTT InfraNet
import { useEffect, useRef } from 'react'

/**
 * PropsやStateなどの更新前の値を保持しておくためのカスタムフック
 * @param {*} value 古い値を保持しておきたいオブジェクト
 * @returns 指定したオブジェクトの更新前の値
 */
const usePrevious = (value: any) => {
  const ref = useRef(null)
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

export default usePrevious
