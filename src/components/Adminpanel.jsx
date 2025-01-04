import React, { useState } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [songDetails, setSongDetails] = useState({
    title: '',
    artist: '',
    album: '',
    genre: '',
    releaseDate: '',
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSongDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePreviewImageChange = (e) => {
    setPreviewImage(e.target.files[0]);
  };

  const handleAudioFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const formData = new FormData();
    Object.keys(songDetails).forEach((key) => {
      formData.append(key, songDetails[key]);
    });

    formData.append('previewImage', previewImage);
    formData.append('audioFile', audioFile);

    try {
      const response = await axios.post('http://localhost:5000/api/songs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setSuccessMessage('Song added successfully!');
        setSongDetails({
          title: '',
          artist: '',
          album: '',
          genre: '',
          releaseDate: '',
        });
        setPreviewImage(null);
        setAudioFile(null);
      }
    } catch (error) {
      setErrorMessage('Failed to add song. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="admin-panel-container">
      {/* Header */}
      <div className="admin-panel-header">Admin Panel</div>

      {/* Layout: Sidebar and Main */}
      <div className="admin-panel-layout">
        {/* Sidebar */}
        <div className="admin-panel-sidebar">
          <button>Add Song</button>
          <button>Delete Song</button>
          <button>Edit Song</button>
        </div>

        {/* Main Content */}
        <div className="admin-panel-main">
          <form onSubmit={handleSubmit} className="admin-panel-form">
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={songDetails.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Artist:</label>
              <input
                type="text"
                name="artist"
                value={songDetails.artist}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Album:</label>
              <input
                type="text"
                name="album"
                value={songDetails.album}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Genre:</label>
              <input
                type="text"
                name="genre"
                value={songDetails.genre}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Release Date:</label>
              <input
                type="date"
                name="releaseDate"
                value={songDetails.releaseDate}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Upload Preview Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePreviewImageChange}
                required
              />
            </div>
            <div>
              <label>Upload MP3 File:</label>
              <input
                type="file"
                accept="audio/mp3"
                onChange={handleAudioFileChange}
                required
              />
            </div>
            <button type="submit">Add Song</button>
          </form>

          {/* Messages */}
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
