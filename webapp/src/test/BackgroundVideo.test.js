// src/test/BackgroundVideo.test.js
import { render, screen } from '@testing-library/react';
import BackgroundVideo from '../components/BackgroundVideo';

describe('BackgroundVideo Component', () => {
  test('renders and applies correct attributes and styles to video element', () => {
    const videoSrc = '/homeBackground30fps.mp4';
    render(<BackgroundVideo videoSrc={videoSrc} />);
    
     // Check if the video element is in the document
    const videoElement = screen.getByTestId('video-element');
    expect(videoElement).toBeInTheDocument();

    // Check if the video src matches the passed prop
    expect(videoElement).toHaveAttribute('src', videoSrc);

    // Check that the video has the correct attributes
    expect(videoElement).toHaveAttribute('autoPlay');
    expect(videoElement).toHaveAttribute('loop');
    expect(videoElement).toHaveAttribute('playsInline');

    // Check if the video element has the correct styles for full screen
    expect(videoElement).toHaveStyle('position: absolute');
    expect(videoElement).toHaveStyle('top: 0');
    expect(videoElement).toHaveStyle('left: 0');
    expect(videoElement).toHaveStyle('width: 100%');
    expect(videoElement).toHaveStyle('height: 100%');
    expect(videoElement).toHaveStyle('objectFit: cover');
  });
});