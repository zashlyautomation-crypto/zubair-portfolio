import { useEffect, useRef, useState, useCallback } from 'react'
import { TOTAL_FRAMES } from '@/constants'

const framePath = (index) =>
  new URL(
    `../assets/images/2d-story/ezgif-frame-${String(index).padStart(3, '0')}.jpg`,
    import.meta.url
  ).href

const PRIORITY_COUNT = 12    // first N frames load immediately before anything renders
const BATCH_SIZE_NORMAL = 20 // frames loaded per batch on normal devices
const BATCH_SIZE_LOW = 8     // frames loaded per batch on low-memory devices (< 4GB)

export const useStoryFrames = () => {
  const images = useRef(new Array(TOTAL_FRAMES).fill(null))
  const [loaded, setLoaded] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const loadedCount = useRef(0)
  const isLowMemory = useRef(
    typeof navigator !== 'undefined' && navigator.deviceMemory < 4
  )

  const loadSingleFrame = useCallback((index) => {
    return new Promise((resolve) => {
      if (images.current[index]) { resolve(); return }
      const img = new Image()
      img.decoding = 'async'
      img.src = framePath(index + 1)  // frames are 1-indexed in filenames
      img.onload = () => {
        images.current[index] = img
        loadedCount.current++
        setLoadProgress(Math.round((loadedCount.current / TOTAL_FRAMES) * 100))
        if (loadedCount.current >= TOTAL_FRAMES) setLoaded(true)
        resolve()
      }
      img.onerror = () => {
        // Silent fail — never crash on missing frame
        loadedCount.current++
        if (loadedCount.current >= TOTAL_FRAMES) setLoaded(true)
        resolve()
      }
    })
  }, [])

  const loadBatch = useCallback(async (startIndex, batchSize) => {
    const end = Math.min(startIndex + batchSize, TOTAL_FRAMES)
    const batch = []
    for (let i = startIndex; i < end; i++) batch.push(loadSingleFrame(i))
    await Promise.all(batch)
  }, [loadSingleFrame])

  useEffect(() => {
    const run = async () => {
      // Load all frames immediately
      await loadBatch(0, TOTAL_FRAMES)
    }
    run()
  }, [loadBatch])

  return { images, loaded, loadProgress }
}
