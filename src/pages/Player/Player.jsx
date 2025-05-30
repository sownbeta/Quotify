import React, { useState, useEffect, useRef } from 'react';
import './Player.scss';
import { 
  PlayCircleFilled, 
  PauseCircleFilled, 
  StepBackwardFilled, 
  StepForwardFilled, 
  SoundFilled, 
  HeartOutlined, 
  HeartFilled,
  MenuOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  UnorderedListOutlined,
  LeftOutlined,
  RightOutlined,
  UserOutlined,
  SearchOutlined,
  HomeFilled,
  ClockCircleOutlined,
  MoreOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import musicService from '../../services/musicService';
import { message } from 'antd';

const Player = () => {
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showMobilePlaylist, setShowMobilePlaylist] = useState(false);
  const [activeView, setActiveView] = useState('home');
  
  // Data state
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [favoriteSongs, setFavoriteSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState({
    songs: true,
    playlists: true,
    favorites: true
  });
  const [error, setError] = useState(null);
  
  // Audio reference
  const audioRef = useRef(null);
  
  // Get user ID from local storage (if authenticated)
  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.id;
  };

  // Check if a song is in favorites
  const isFavorite = (songId) => {
    return favoriteSongs.some(favSong => favSong.id === songId);
  };

  // Fetch all data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch songs
        setLoading(prev => ({ ...prev, songs: true }));
        const songsData = await musicService.getAllSongs();
        setSongs(songsData);
        
        // Set first song as current if none selected
        if (!currentSong && songsData.length > 0) {
          setCurrentSong(songsData[0]);
        }
        
        setLoading(prev => ({ ...prev, songs: false }));
        
        // Fetch playlists
        setLoading(prev => ({ ...prev, playlists: true }));
        const playlistsData = await musicService.getAllPlaylists();
        setPlaylists(playlistsData);
        setLoading(prev => ({ ...prev, playlists: false }));
        
        // Fetch favorites if user is logged in
        const userId = getUserId();
        if (userId) {
          setLoading(prev => ({ ...prev, favorites: true }));
          const favoritesData = await musicService.getFavoriteSongs(userId);
          setFavoriteSongs(favoritesData);
          setLoading(prev => ({ ...prev, favorites: false }));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load music data. Please try again later.');
        setLoading({
          songs: false,
          playlists: false,
          favorites: false
        });
        message.error('Failed to load music data');
      }
    };
    
    fetchData();
  }, []);
  
  // Set up audio element when current song changes
  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.load();
      
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          message.error('Failed to play audio');
        });
      }
    }
  }, [currentSong]);
  
  // Update audio element when play state changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          message.error('Failed to play audio');
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    
    if (audio) {
      // Update duration when metadata is loaded
      const handleLoadedMetadata = () => {
        setDuration(audio.duration);
      };
      
      // Update current time during playback
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };
      
      // Handle end of song
      const handleEnded = () => {
        playNextSong();
      };
      
      // Add event listeners
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);
      
      // Set volume
      audio.volume = volume / 100;
      
      // Clean up event listeners
      return () => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, []);
  
  // Toggle play/pause
  const togglePlay = () => {
    if (currentSong) {
      setIsPlaying(!isPlaying);
    } else if (songs.length > 0) {
      setCurrentSong(songs[0]);
      setIsPlaying(true);
    }
  };
  
  // Toggle favorite status
  const toggleFavorite = async () => {
    if (!currentSong) return;
    
    const userId = getUserId();
    if (!userId) {
      message.warning('Please log in to add favorites');
      return;
    }
    
    try {
      const isFav = isFavorite(currentSong.id);
      
      if (isFav) {
        await musicService.removeFromFavorites(currentSong.id, userId);
        setFavoriteSongs(prev => prev.filter(song => song.id !== currentSong.id));
        message.success('Removed from favorites');
      } else {
        await musicService.addToFavorites(currentSong.id, userId);
        setFavoriteSongs(prev => [...prev, currentSong]);
        message.success('Added to favorites');
      }
    } catch (err) {
      console.error('Error updating favorites:', err);
      message.error('Failed to update favorites');
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };
  
  // Handle progress change (seek)
  const handleProgressChange = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };
  
  // Play a specific song
  const playSong = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };
  
  // Play next song
  const playNextSong = () => {
    if (!currentSong || songs.length === 0) return;
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(true);
  };
  
  // Play previous song
  const playPreviousSong = () => {
    if (!currentSong || songs.length === 0) return;
    
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(true);
  };
  
  // Toggle mobile playlist
  const toggleMobilePlaylist = () => {
    setShowMobilePlaylist(!showMobilePlaylist);
  };
  
  // Format time in MM:SS
  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Filter songs based on search query
  const filteredSongs = songs.filter(song => 
    song.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    song.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock data for development (will be replaced by API data)
  const mockSongs = [
    { id: 1, title: 'Beautiful Day', artist: 'Music Artist', duration: '3:45', album: 'Album Name', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { id: 2, title: 'Summer Vibes', artist: 'Cool Band', duration: '4:20', album: 'Summer Collection', cover: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 3, title: 'Midnight Dreams', artist: 'Night Owls', duration: '3:33', album: 'Dreamy Nights', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  ];

  // Use mock data if API data is not available
  const displaySongs = songs.length > 0 ? filteredSongs : mockSongs;
  const displayCurrentSong = currentSong || (mockSongs.length > 0 ? mockSongs[0] : null);

  return (
    <div className="spotify-player">
      {/* Hidden audio element for playback */}
      <audio ref={audioRef} />
      
      {/* Sidebar - Only visible on desktop */}
      <div className="sidebar">
        <div className="sidebar-top">
          <div className="logo">
            <h2>Musicify</h2>
          </div>
          <div className="navigation">
            <div className={`nav-item ${activeView === 'home' ? 'active' : ''}`} onClick={() => setActiveView('home')}>
              <HomeFilled />
              <span>Home</span>
            </div>
            <div className={`nav-item ${activeView === 'search' ? 'active' : ''}`} onClick={() => setActiveView('search')}>
              <SearchOutlined />
              <span>Search</span>
            </div>
            <div className={`nav-item ${activeView === 'library' ? 'active' : ''}`} onClick={() => setActiveView('library')}>
              <UnorderedListOutlined />
              <span>Your Library</span>
            </div>
          </div>
        </div>
        
        <div className="playlists">
          <h3>PLAYLISTS</h3>
          {loading.playlists ? (
            <div className="loading-indicator">
              <LoadingOutlined /> Loading playlists...
            </div>
          ) : (
            playlists.map(playlist => (
              <div className="playlist-item" key={playlist.id}>
                <span>{playlist.name}</span>
                <span className="song-count">{playlist.songCount || 0} songs</span>
              </div>
            ))
          )}
        </div>
        
        <div className="user-info">
          <div className="user-avatar">
            <UserOutlined />
          </div>
          <div className="user-name">
            {getUserId() ? 'User Name' : 'Guest'}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="main-content">
        {/* Mobile Header */}
        <div className="mobile-header">
          <div className="mobile-nav">
            <div className={`mobile-nav-item ${activeView === 'home' ? 'active' : ''}`} onClick={() => setActiveView('home')}>
              <HomeFilled />
              <span>Home</span>
            </div>
            <div className={`mobile-nav-item ${activeView === 'search' ? 'active' : ''}`} onClick={() => setActiveView('search')}>
              <SearchOutlined />
              <span>Search</span>
            </div>
            <div className={`mobile-nav-item ${activeView === 'library' ? 'active' : ''}`} onClick={() => setActiveView('library')}>
              <UnorderedListOutlined />
              <span>Library</span>
            </div>
          </div>
        </div>
        
        {/* Content Header */}
        <div className="content-header">
          <div className="header-navigation">
            <button className="nav-button"><LeftOutlined /></button>
            <button className="nav-button"><RightOutlined /></button>
          </div>
          
          <div className="search-container">
            <SearchOutlined />
            <input 
              type="text" 
              placeholder="Search for songs or artists" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="user-menu">
            <div className="user-avatar">
              <UserOutlined />
            </div>
            <span className="username">
              {getUserId() ? 'User Name' : 'Guest'}
            </span>
          </div>
        </div>
        
        {/* Main View */}
        <div className="content-view">
          <h1>Popular Songs</h1>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          {loading.songs ? (
            <div className="loading-container">
              <LoadingOutlined className="loading-icon" />
              <p>Loading songs...</p>
            </div>
          ) : (
            <>
              <div className="songs-header">
                <div className="song-number">#</div>
                <div className="song-title">TITLE</div>
                <div className="song-album">ALBUM</div>
                <div className="song-duration"><ClockCircleOutlined /></div>
              </div>
              
              <div className="songs-list">
                {displaySongs.map((song, index) => (
                  <div 
                    className={`song-row ${displayCurrentSong && displayCurrentSong.id === song.id ? 'active' : ''}`} 
                    key={song.id}
                    onClick={() => playSong(song)}
                  >
                    <div className="song-number">{index + 1}</div>
                    <div className="song-title">
                      <div className="song-cover">
                        <img src={song.cover} alt={song.title} />
                        {displayCurrentSong && displayCurrentSong.id === song.id && isPlaying && (
                          <div className="playing-animation">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        )}
                      </div>
                      <div className="song-info">
                        <div className="song-name">{song.title}</div>
                        <div className="song-artist">{song.artist}</div>
                      </div>
                    </div>
                    <div className="song-album">{song.album}</div>
                    <div className="song-duration">
                      <HeartOutlined 
                        className={`like-icon ${isFavorite(song.id) ? 'liked' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSong(song);
                          toggleFavorite();
                        }}
                      />
                      <span>{song.duration}</span>
                      <MoreOutlined className="more-icon" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Now Playing Bar */}
      <div className="now-playing-bar">
        <div className="now-playing-left">
          {displayCurrentSong ? (
            <>
              <div className="current-track-image">
                <img src={displayCurrentSong.cover} alt={displayCurrentSong.title} />
              </div>
              <div className="current-track-info">
                <div className="track-name">{displayCurrentSong.title}</div>
                <div className="track-artist">{displayCurrentSong.artist}</div>
              </div>
              <div className="track-like" onClick={toggleFavorite}>
                {isFavorite(displayCurrentSong.id) ? (
                  <HeartFilled className="liked" />
                ) : (
                  <HeartOutlined />
                )}
              </div>
            </>
          ) : (
            <div className="no-song-playing">
              No song selected
            </div>
          )}
        </div>
        
        <div className="now-playing-center">
          <div className="player-controls">
            <button className="control-button" onClick={playPreviousSong}>
              <StepBackwardFilled />
            </button>
            <button className="control-button play-pause" onClick={togglePlay}>
              {isPlaying ? <PauseCircleFilled /> : <PlayCircleFilled />}
            </button>
            <button className="control-button" onClick={playNextSong}>
              <StepForwardFilled />
            </button>
          </div>
          
          <div className="playback-bar">
            <span className="progress-time">{formatTime(currentTime)}</span>
            <div className="progress-container">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                className="progress-bar"
                onChange={handleProgressChange}
                disabled={!displayCurrentSong}
              />
              <div 
                className="progress-indicator" 
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="progress-time">{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="now-playing-right">
          <div className="volume-controls">
            <SoundFilled />
            <div className="volume-bar">
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                className="volume-slider"
                onChange={handleVolumeChange}
              />
              <div 
                className="volume-indicator" 
                style={{ width: `${volume}%` }}
              ></div>
            </div>
          </div>
          
          {/* Mobile playlist toggle button */}
          <button className="mobile-playlist-toggle" onClick={toggleMobilePlaylist}>
            <UnorderedListOutlined />
          </button>
        </div>
      </div>
      
      {/* Mobile Playlist Overlay */}
      <div className={`mobile-playlist-overlay ${showMobilePlaylist ? 'show' : ''}`}>
        <div className="mobile-playlist-header">
          <h3>Now Playing</h3>
          <button className="close-playlist" onClick={toggleMobilePlaylist}>
            &times;
          </button>
        </div>
        
        {displayCurrentSong && (
          <div className="mobile-current-song">
            <img src={displayCurrentSong.cover} alt={displayCurrentSong.title} className="mobile-cover" />
            <div className="mobile-song-info">
              <h2>{displayCurrentSong.title}</h2>
              <p>{displayCurrentSong.artist}</p>
            </div>
          </div>
        )}
        
        <div className="mobile-playlist">
          <h4>Up Next</h4>
          {loading.songs ? (
            <div className="loading-indicator">
              <LoadingOutlined /> Loading songs...
            </div>
          ) : (
            displaySongs.map(song => (
              <div 
                className={`mobile-playlist-item ${displayCurrentSong && displayCurrentSong.id === song.id ? 'active' : ''}`} 
                key={song.id}
                onClick={() => playSong(song)}
              >
                <div className="mobile-playlist-cover">
                  <img src={song.cover} alt={song.title} />
                </div>
                <div className="mobile-playlist-info">
                  <div className="mobile-playlist-title">{song.title}</div>
                  <div className="mobile-playlist-artist">{song.artist}</div>
                </div>
                <div className="mobile-playlist-duration">{song.duration}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Player;
