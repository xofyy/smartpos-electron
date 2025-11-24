import { useEffect, useState } from 'react'

interface ScanDetectionOptions {
  timeToEvaluate?: number
  averageWaitTime?: number
  minLength?: number
  endChar?: number[]
  onComplete: (code: string) => void
}

export const useScanDetection = ({
  timeToEvaluate = 100,
  averageWaitTime = 50,
  minLength = 3,
  endChar = [13, 9], // Enter, Tab
  onComplete
}: ScanDetectionOptions) => {
  const [buffer, setBuffer] = useState<string>('')
  const [lastTime, setLastTime] = useState<number>(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now()
      const timeDiff = currentTime - lastTime

      // If time difference is too large, reset buffer (manual typing)
      if (timeDiff > timeToEvaluate) {
        setBuffer('')
      }

      setLastTime(currentTime)

      // Ignore special keys except Enter/Tab if they are end chars
      if (endChar.includes(e.keyCode)) {
        if (buffer.length >= minLength) {
          onComplete(buffer)
          setBuffer('')
          e.preventDefault() // Prevent default action (e.g. form submission)
        }
        return
      }

      // Add char to buffer if it's a printable character
      if (e.key.length === 1) {
        setBuffer(prev => prev + e.key)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [buffer, lastTime, timeToEvaluate, minLength, endChar, onComplete])
}
