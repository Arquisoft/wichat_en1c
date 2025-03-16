// src/components/BackgroundVideo.js
import React from 'react';

const BackgroundVideo = ({ videoSrc }) => {
  return (
    // Container for the video, ensures it takes up the entire screen height (100vh) and is at the botton of the screen
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', overflow: 'hidden', zIndex: -1 }}>
      <video data-testid="video-element"
        src={videoSrc}  // Video source passed as a prop
        type="video/mp4"  // Video type 
        autoPlay           // Makes the video autoplay when loaded
        loop               // Loops the video infinitely
        muted              // Mutes the video to avoid unwanted sound
        playsInline        // Allows the video to play inline on mobile devices (without fullscreen)
        style={{
          position: 'absolute', // Positions the video absolutely within the container
          top: 0,               // Aligns the video to the top of the container
          left: 0,              // Aligns the video to the left of the container
          width: '100%',        // Ensures the video takes up 100% of the container's width
          height: '100%',       // Ensures the video takes up 100% of the container's height
          objectFit: 'cover',   // Makes the video cover the container without distortion
        }}
      />
    </div>
  );
};

export default BackgroundVideo;