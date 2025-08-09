import React from 'react';

const VideoPlayer = ({ video, onVideoEnd }) => {
  return (
    <div className="video-player">
      <h3 style={{ marginBottom: '1rem' }}>{video.title}</h3>
      <video
        controls
        width="100%"
        onEnded={onVideoEnd}
        style={{ borderRadius: '0.5rem' }}
      >
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
