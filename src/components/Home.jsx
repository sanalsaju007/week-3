import React, { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [songs, setSongs] = useState([]); // State to store fetched songs
  const [currentTrack, setCurrentTrack] = useState(null); // Currently playing track
  const [isPlaying, setIsPlaying] = useState(false); // Playback state
  const audioRef = useRef(new Audio()); // Audio reference for preview

  // Fetch songs from the backend
  const fetchSongs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/songs');
      setSongs(response.data); // Assuming API response is an array of song objects
    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  };

  // Play or pause the current track
  const handlePlay = (previewUrl) => {
    if (audioRef.current.src !== previewUrl) {
      audioRef.current.src = previewUrl;
      audioRef.current.play();
      setIsPlaying(true);
      setCurrentTrack(previewUrl);
    } else {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Mute or unmute the audio
  const handleMute = () => {
    audioRef.current.muted = !audioRef.current.muted;
  };

  useEffect(() => {
    fetchSongs(); // Fetch songs when the component mounts
  }, []);

  return (
    <>
      <Navbar />
      <div className="home-container">
        <h1>Available Songs</h1>
        <div className="song-cards-container">
          {songs.length > 0 ? (
            songs.map((song) => (
              <div className="song-card" key={song._id}>
                <img src={song.previewImage} alt={song.title} className="song-image" />
                <div className="song-info">
                  <h3>{song.title}</h3>
                  <p><strong>Artist:</strong> {song.artist}</p>
                  <p><strong>Album:</strong> {song.album}</p>
                  <p><strong>Genre:</strong> {song.genre}</p>
                  <p><strong>Release Date:</strong> {new Date(song.releaseDate).toDateString()}</p>
                </div>
                <div className="song-actions">
                  <button onClick={() => handlePlay(song.previewUrl)}>
                    {isPlaying && currentTrack === song.previewUrl ? 'Pause' : 'Play'}
                  </button>
                  <button onClick={handleMute}>Mute</button>
                </div>
              </div>
            ))
          ) : (
            <p>No songs available</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
