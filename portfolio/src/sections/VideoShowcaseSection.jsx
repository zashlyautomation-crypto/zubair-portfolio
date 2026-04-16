import { useState, useCallback } from 'react'
import { VideoPanel } from '@/components/VideoPanel'
import { VideoModal } from '@/components/VideoModal'
import { VIDEO_SHOWCASE_DATA } from '@/constants'
import '@/styles/video-showcase.css'

export const VideoShowcaseSection = () => {
  const [activeVideo, setActiveVideo] = useState(null)

  const openModal  = useCallback((video) => setActiveVideo(video), [])
  const closeModal = useCallback(() => setActiveVideo(null), [])

  return (
    <section className="vs-section" aria-label="Video Showcase">

      {VIDEO_SHOWCASE_DATA.map((video) => (
        <VideoPanel
          key={video.id}
          video={video}
          onClick={() => openModal(video)}
        />
      ))}

      <VideoModal
        video={activeVideo}
        isOpen={!!activeVideo}
        onClose={closeModal}
      />

    </section>
  )
}

export default VideoShowcaseSection
