import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = ({ url, playing = false, controls = true, width = '100%', height = '100%', ...props }) => {
  if (!url) return <div className="bg-black text-white p-4">No video URL provided.</div>;
  return (
    <div className="video-player-wrapper" style={{ position: 'relative', paddingTop: '56.25%' }}>
      <ReactPlayer
        url={url}
        playing={playing}
        controls={controls}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        {...props}
      />
    </div>
  );
};

export default VideoPlayer;
