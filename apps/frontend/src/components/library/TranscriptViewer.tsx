import React, { useEffect, useRef, useState } from 'react';
import styles from './TranscriptViewer.module.css';

interface TranscriptSegment {
  start?: number;
  end?: number;
  timestamp?: string;
  text: string;
}

interface TranscriptViewerProps {
  transcriptJson: string;
  currentTime: number;
  onSeek: (time: number) => void;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  transcriptJson,
  currentTime,
  onSeek,
}) => {
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(-1);
  const currentSegmentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const parsed = JSON.parse(transcriptJson);

      // Handle different transcript formats
      let transcriptSegments: TranscriptSegment[] = [];

      if (Array.isArray(parsed)) {
        transcriptSegments = parsed;
      } else if (parsed.segments && Array.isArray(parsed.segments)) {
        transcriptSegments = parsed.segments;
      } else if (parsed.results && Array.isArray(parsed.results)) {
        transcriptSegments = parsed.results;
      }

      setSegments(transcriptSegments);
    } catch (error) {
      console.error('Failed to parse transcript JSON:', error);
      setSegments([]);
    }
  }, [transcriptJson]);

  useEffect(() => {
    // Find current segment based on video time
    const index = segments.findIndex((seg, idx) => {
      const start = seg.start ?? parseTimestamp(seg.timestamp ?? '0:00');
      const nextStart =
        idx < segments.length - 1
          ? (segments[idx + 1].start ??
            parseTimestamp(segments[idx + 1].timestamp ?? '0:00'))
          : Number.POSITIVE_INFINITY;
      return currentTime >= start && currentTime < nextStart;
    });

    setCurrentSegmentIndex(index);

    // Auto-scroll to current segment
    if (index >= 0 && currentSegmentRef.current) {
      currentSegmentRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTime, segments]);

  const parseTimestamp = (timestamp: string): number => {
    // Parse timestamp like "00:12" or "1:23:45"
    const parts = timestamp.split(':').map((p) => Number.parseInt(p, 10));
    if (parts.length === 2) {
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSegmentClick = (segment: TranscriptSegment) => {
    const time = segment.start ?? parseTimestamp(segment.timestamp ?? '0:00');
    onSeek(time);
  };

  const handleExport = () => {
    const text = segments
      .map((seg) => {
        const time = seg.start ?? parseTimestamp(seg.timestamp ?? '0:00');
        return `[${formatTimestamp(time)}] ${seg.text}`;
      })
      .join('\n\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transcript.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredSegments = searchTerm
    ? segments.filter((seg) =>
        seg.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : segments;

  if (segments.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Transcript</h3>
        </div>
        <div className={styles.emptyState}>No transcript available</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Transcript</h3>
        <button
          className={styles.exportButton}
          onClick={handleExport}
          type="button"
          title="Export transcript"
        >
          ⬇ Export
        </button>
      </div>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search transcript..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.segments}>
        {filteredSegments.map((segment, index) => {
          const time =
            segment.start ?? parseTimestamp(segment.timestamp ?? '0:00');
          const isActive = currentSegmentIndex === index && !searchTerm;

          return (
            <div
              key={index}
              ref={isActive ? currentSegmentRef : null}
              className={`${styles.segment} ${isActive ? styles.active : ''}`}
              onClick={() => handleSegmentClick(segment)}
            >
              <div className={styles.timestamp}>{formatTimestamp(time)}</div>
              <div className={styles.text}>{segment.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
