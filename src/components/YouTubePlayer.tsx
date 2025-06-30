import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { COLORS } from '../services/constants';

interface YouTubePlayerProps {
  videoId: string;
  height?: number;
  width?: number;
  onReady?: () => void;
  onError?: (error: string) => void;
  onStateChange?: (state: string) => void;
  onEnd?: () => void;
  playing?: boolean;
  loop?: boolean;
  controls?: boolean;
  showinfo?: boolean;
  modestbranding?: boolean;
  rel?: boolean;
  onProgress?: (currentTime: number) => void;
  onDuration?: (duration: number) => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  videoId,
  height = 220,
  width = 400,
  onReady,
  onError,
  onStateChange,
  onEnd,
  playing = true,
  loop = false,
  controls = true,
  showinfo = true,
  modestbranding = true,
  rel = false,
  onProgress,
  onDuration,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<any>(null);

  const onReadyCallback = useCallback(() => {
    setLoading(false);
    onReady?.();
  }, [onReady]);

  const onErrorCallback = useCallback((error: string) => {
    setLoading(false);
    setError(error);
    onError?.(error);
  }, [onError]);

  const onStateChangeCallback = useCallback((state: string) => {
    onStateChange?.(state);
  }, [onStateChange]);

  const onEndCallback = useCallback(() => {
    onEnd?.();
  }, [onEnd]);

  const onPlaybackStateChange = useCallback((state: string) => {
    onStateChange?.(state);
  }, [onStateChange]);

  const getCurrentTime = useCallback(async () => {
    if (playerRef.current) {
      const currentTime = await playerRef.current.getCurrentTime();
      onProgress?.(currentTime);
    }
  }, [onProgress]);

  // Update progress every second when playing
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playing) {
      interval = setInterval(getCurrentTime, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [playing, getCurrentTime]);

  if (error) {
    return (
      <View style={[styles.container, { height, width }]}>
        <Text style={styles.errorText}>Failed to load video</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height, width }]}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          <Text style={styles.loadingText}>Loading video...</Text>
        </View>
      )}
      <YoutubePlayer
        ref={playerRef}
        height={height}
        width={width}
        videoId={videoId}
        play={playing}
        loop={loop}
        controls={controls}
        showinfo={showinfo}
        modestbranding={modestbranding}
        rel={rel}
        onReady={onReadyCallback}
        onError={onErrorCallback}
        onStateChange={onPlaybackStateChange}
        onEnd={onEndCallback}
        onPlaybackQualityChange={() => {}}
        onDuration={onDuration}
        webViewProps={{
          androidLayerType: 'hardware',
          style: {
            opacity: 0.99,
            overflow: 'hidden',
          }
        }}
        initialPlayerParams={{
          preventFullScreen: true,
          cc_lang_pref: 'us',
          showClosedCaptions: true,
          controls: false,
          modestbranding: true,
          rel: 0,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.SURFACE.DARK,
    zIndex: 1,
  },
  loadingText: {
    color: COLORS.TEXT.PRIMARY,
    marginTop: 8,
    fontSize: 14,
  },
  errorText: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default YouTubePlayer; 