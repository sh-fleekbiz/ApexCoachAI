import React, { useEffect, useRef, useState } from 'react';
import { TranscriptViewer } from './TranscriptViewer.js';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  source: string;
  transcriptJson: string | null;
  title: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  source,
  transcriptJson,
  title,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []);

  const handleSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      // Auto-play after seeking
      videoRef.current.play();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          src={source}
          controls
          className={styles.video}
          title={title}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {transcriptJson && (
        <div className={styles.transcriptContainer}>
          <TranscriptViewer
            transcriptJson={transcriptJson}
            currentTime={currentTime}
            onSeek={handleSeek}
          />
        </div>
      )}
    </div>
  );
};
