import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { COLORS } from '../services/constants';
import YouTubePlayer from '../components/YouTubePlayer';
import {
  getVideoDetails,
  getRelatedVideos,
  formatViewCount,
  type YouTubeVideo,
} from '../services/youtubeApi';
import * as ScreenOrientation from 'expo-screen-orientation';

type Props = NativeStackScreenProps<RootStackParamList, 'VideoPlayer'>;

const { width, height } = Dimensions.get('window');
const VIDEO_HEIGHT = width * 0.5625;

const VideoPlayerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { videoId, title } = route.params;
  const [video, setVideo] = useState<YouTubeVideo | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    loadVideoData();
    lockOrientation();
    return () => {
      unlockOrientation();
    };
  }, [videoId]);

  const loadVideoData = async () => {
    try {
      setLoading(true);
      const [videoDetails, related] = await Promise.all([
        getVideoDetails(videoId),
        getRelatedVideos(videoId, 5),
      ]);
      setVideo(videoDetails);
      setRelatedVideos(related);
    } catch (error) {
      console.error('Error loading video data:', error);
    } finally {
      setLoading(false);
    }
  };

  const lockOrientation = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE
    );
  };

  const unlockOrientation = async () => {
    await ScreenOrientation.unlockAsync();
  };

  const handleBack = async () => {
    await unlockOrientation();
    navigation.goBack();
  };

  const togglePlayPause = () => {
    setPlaying(!playing);
  };

  const toggleLock = () => {
    setIsLocked(!isLocked);
  };

  const handleProgress = (currentTime: number) => {
    const progressPercent = (currentTime / duration) * 100;
    setProgress(progressPercent);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      <YouTubePlayer
        videoId={videoId}
        height={height}
        width={width}
        playing={playing}
        onProgress={handleProgress}
        onDuration={setDuration}
      />

      {showControls && !isLocked && (
        <View style={styles.controlsOverlay}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.ratingCircle}>
              <Text style={styles.ratingText}>10</Text>
            </View>
          </View>

          {/* Center Play Button */}
          <TouchableOpacity style={styles.centerButton} onPress={togglePlayPause}>
            <Ionicons
              name={playing ? "pause" : "play"}
              size={50}
              color="white"
            />
          </TouchableOpacity>

          {/* Bottom Controls */}
          <View style={styles.bottomControls}>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: `${progress}%` }]} />
            </View>
            
            {/* <View style={styles.controlButtons}>
              <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="speedometer-outline" size={24} color="white" />
                <Text style={styles.controlText}>Speed (1x)</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.controlButton} onPress={toggleLock}>
                <Ionicons name={isLocked ? "lock-closed" : "lock-open"} size={24} color="white" />
                <Text style={styles.controlText}>Lock</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="list" size={24} color="white" />
                <Text style={styles.controlText}>Episodes</Text>
              </TouchableOpacity> */}

              {/* <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="text" size={24} color="white" />
                <Text style={styles.controlText}>Subtitles</Text>
              </TouchableOpacity> */}

              {/* <TouchableOpacity style={styles.controlButton}>
                <Ionicons name="play-skip-forward" size={24} color="white" />
                <Text style={styles.controlText}>Next Ep.</Text>
              </TouchableOpacity>
             </View> */}
          </View>
        </View>
      )}

      {isLocked && (
        <TouchableOpacity 
          style={styles.unlockButton} 
          onPress={toggleLock}
        >
          <Ionicons name="lock-closed" size={24} color="white" />
        </TouchableOpacity>
      )}

      <ScrollView>
        {video && (
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{video.title}</Text>
            <Text style={styles.videoStats}>
              {formatViewCount(video.viewCount)} views • {video.channelTitle}
            </Text>
            <Text style={styles.videoDescription} numberOfLines={3}>
              {video.description}
            </Text>
          </View>
        )}

        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Related Videos</Text>
          {relatedVideos.map((relatedVideo) => (
            <TouchableOpacity
              key={relatedVideo.id}
              style={styles.relatedVideo}
              onPress={() => navigation.replace('VideoPlayer', {
                videoId: relatedVideo.id,
                title: relatedVideo.title,
              })}
            >
              <Image
                source={{ uri: relatedVideo.thumbnail }}
                style={styles.relatedThumbnail}
              />
              <View style={styles.relatedInfo}>
                <Text style={styles.relatedTitle} numberOfLines={2}>
                  {relatedVideo.title}
                </Text>
                <Text style={styles.relatedChannel}>{relatedVideo.channelTitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  ratingCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerButton: {
    alignSelf: 'center',
    padding: 20,
  },
  bottomControls: {
    padding: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 20,
  },
  progress: {
    height: '100%',
    backgroundColor: COLORS.PRIMARY,
  },
  controlButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  controlButton: {
    alignItems: 'center',
  },
  controlText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  },
  unlockButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 8,
  },
  videoInfo: {
    padding: 16,
  },
  videoTitle: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  videoStats: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 14,
    marginBottom: 8,
  },
  videoDescription: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 14,
  },
  relatedSection: {
    padding: 16,
  },
  relatedTitle: {
    color: COLORS.TEXT.PRIMARY,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  relatedVideo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  relatedThumbnail: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  relatedInfo: {
    flex: 1,
  },
  relatedChannel: {
    color: COLORS.TEXT.SECONDARY,
    fontSize: 12,
    marginTop: 4,
  },
});

export default VideoPlayerScreen; 