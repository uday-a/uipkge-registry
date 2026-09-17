import Story from '../../components/story/Story'
import { VideoPlaylistSidebar } from '@react-registry-blocks/video-playlist-sidebar/VideoPlaylistSidebar'

export default function VideoPlaylistSidebarDemo() {
  return (
    <Story
      title="Video Playlist Sidebar"
      description="YouTube and Vimeo style video playlist drawer with active playing indicators, duration badges, auto-play next switch, loop/shuffle controls, and active lesson summary card."
    >
      <VideoPlaylistSidebar />
    </Story>
  )
}
