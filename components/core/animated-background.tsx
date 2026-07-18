'use client'

import { useState, useRef, useEffect, useCallback, type ReactElement, Children } from 'react'

interface AnimatedBackgroundProps {
  children: ReactElement[]
  className?: string
  transition?: { type?: string; bounce?: number; duration?: number }
}

export function AnimatedBackground({ children, className, transition }: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [bgStyle, setBgStyle] = useState({ left: 0, top: 0, width: 0, height: 0 })

  useEffect(() => {
    if (!hoveredId) {
      setBgStyle({ left: 0, top: 0, width: 0, height: 0 })
      return
    }
    const parent = containerRef.current
    if (!parent) return
    const child = parent.querySelector(`[data-id="${CSS.escape(hoveredId)}"]`) as HTMLElement | null
    if (!child) return
    const pRect = parent.getBoundingClientRect()
    const cRect = child.getBoundingClientRect()
    setBgStyle({
      left: cRect.left - pRect.left,
      top: cRect.top - pRect.top,
      width: cRect.width,
      height: cRect.height,
    })
  }, [hoveredId])

  const findChild = useCallback((e: React.MouseEvent) => {
    return (e.target as HTMLElement).closest('[data-id]') as HTMLElement | null
  }, [])

  const dur = transition?.duration ?? 0.3

  return (
    <div
      ref={containerRef}
      className="relative inline-flex"
      onMouseEnter={(e) => {
        const child = findChild(e)
        if (child) setHoveredId(child.dataset.id!)
      }}
      onMouseMove={(e) => {
        const child = findChild(e)
        if (child && child.dataset.id !== hoveredId) setHoveredId(child.dataset.id!)
      }}
      onMouseLeave={() => setHoveredId(null)}
    >
      <div
        aria-hidden
        className={className}
        style={{
          position: 'absolute',
          opacity: hoveredId ? 1 : 0,
          ...bgStyle,
          transition: `all ${dur}s cubic-bezier(0.34, 1.56, 0.64, 1)`,
        }}
      />
      {Children.map(children, (child) => child)}
    </div>
  )
}
