import React from 'react'
import HLSPlayer from '../HSLPlayer/page'
interface PlayerProps {
    videoFile: string
}

const VideoPlayer:React.FC<PlayerProps> = ({videoFile}) => {
    
  return (
    <div className='w-full'>
      <HLSPlayer videoSrc={`http://localhost:8000/uploads/courses/${videoFile}/master.m3u8`} />
    </div>
  )
}

export default VideoPlayer