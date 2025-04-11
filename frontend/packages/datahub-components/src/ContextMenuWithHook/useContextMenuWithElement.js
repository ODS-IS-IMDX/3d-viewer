// Copyright (c) 2025 NTT InfraNet
import { useCallback, useEffect, useMemo, useState } from 'react'

export const CornerType = {
  topLeft: 1,
  topRight: 2,
  bottomRight: 3,
  bottomLeft: 4
}

const isBottom = cornerType =>
  [CornerType.bottomRight, CornerType.bottomLeft].includes(cornerType)
const isRight = cornerType =>
  [CornerType.topRight, CornerType.bottomRight].includes(cornerType)

export const useContextMenuWithElement = ({
  elementCorner,
  menuCorner,
  absolute: { x = 0, y = 0 },
  menuWidth = 0,
  menuHeight = 0
}) => {
  const [element, setElement] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const [, update] = useState()
  const forceUpdate = useCallback(() => {
    update({})
  }, [])

  const observer = useMemo(
    () =>
      new ResizeObserver(() => {
        forceUpdate()
      }),
    [forceUpdate]
  )

  const elementRef = useCallback(element => {
    setElement(element)
  }, [])

  const openContextMenu = useCallback(event => {
    event.stopPropagation()
    setIsMenuOpen(true)
  }, [])

  const closeContextMenu = useCallback(event => {
    event.stopPropagation()
    setIsMenuOpen(false)
  }, [])

  const handleResize = useCallback(() => {
    forceUpdate()
  }, [forceUpdate])

  useEffect(() => {
    if (element) {
      observer.observe(element)
      return () => {
        observer.disconnect()
      }
    }
  }, [element])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isMenuOpen, handleResize])

  const position = {}
  if (isMenuOpen && element) {
    const { clientWidth, clientHeight } = document.documentElement || {}
    const { top, right, bottom, left } = element.getBoundingClientRect() || {}

    const relativePosition = {
      x: isRight(elementCorner) ? right : left,
      y: isBottom(elementCorner) ? bottom : top
    }
    if (isBottom(menuCorner)) {
      position.bottom = clientHeight - relativePosition.y + y
    } else {
      position.top = relativePosition.y + y
      const overY = position.top + menuHeight - clientHeight
      if (overY > 0) {
        position.top = position.top - overY
      }
    }
    if (isRight(menuCorner)) {
      position.right = clientWidth - relativePosition.x + x
    } else {
      position.left = relativePosition.x + x
      const overX = position.left + menuWidth - clientWidth
      if (overX > 0) {
        position.left = position.left - overX
      }
    }
  }

  return {
    isMenuOpen,
    menuPosition: position,
    elementRef,
    setIsMenuOpen,
    openContextMenu,
    closeContextMenu
  }
}

export default useContextMenuWithElement
