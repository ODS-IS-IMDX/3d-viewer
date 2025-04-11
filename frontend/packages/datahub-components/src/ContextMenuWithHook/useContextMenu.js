// Copyright (c) 2025 NTT InfraNet
import { useCallback, useEffect, useState } from 'react'

export const useContextMenu = ({ location, elementId }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({})
  const [basePosition, setBasePosition] = useState({})

  let position = {}
  const openContextMenu = event => {
    event.stopPropagation()
    const width = 184
    const resizerWidth = 20
    const contextWidth = 18
    const { clientWidth, clientHeight } = document.documentElement || {}
    const { height, top, right } = event.target.getBoundingClientRect()

    if (location === 'right') {
      if (clientWidth > right + width - resizerWidth - contextWidth) {
        position = {
          top: top - height / 2,
          left: right
        }
      } else {
        position = {
          top: top - height / 2,
          left: right - width + resizerWidth
        }
      }
    } else {
      position = {
        right: clientWidth - right + 5,
        bottom: clientHeight - top + 5
      }
    }
    setMenuPosition(position)
    setBasePosition(position)
    setIsMenuOpen(true)
  }

  const closeContextMenu = event => {
    event.stopPropagation()
    setIsMenuOpen(false)
  }

  const adjustPosition = useCallback(() => {
    const element = elementId && document.getElementById(elementId)
    if (element) {
      const { clientHeight } = document.documentElement || {}
      const { height } = element.getBoundingClientRect()

      let position = { ...basePosition }
      if (clientHeight < basePosition.top + height) {
        position = {
          left: menuPosition.left,
          bottom: 1
        }
      }
      setMenuPosition(position)
    }
  }, [elementId, menuPosition.left, basePosition])

  const handleResize = useCallback(() => {
    adjustPosition()
  }, [adjustPosition])

  useEffect(() => {
    if (isMenuOpen && location === 'right') {
      adjustPosition()
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (location !== 'right' || !isMenuOpen) return

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [location, isMenuOpen, handleResize])

  return {
    isMenuOpen,
    setIsMenuOpen,
    menuPosition,
    openContextMenu,
    closeContextMenu
  }
}
