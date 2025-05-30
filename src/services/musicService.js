import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Replace with your actual API URL

export const musicService = {
  // Get all songs
  getAllSongs: async () => {
    try {
      const response = await axios.get(`${API_URL}/songs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching songs:', error);
      throw error;
    }
  },

  // Get song by ID
  getSongById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/songs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching song with id ${id}:`, error);
      throw error;
    }
  },

  // Get all playlists
  getAllPlaylists: async () => {
    try {
      const response = await axios.get(`${API_URL}/playlists`);
      return response.data;
    } catch (error) {
      console.error('Error fetching playlists:', error);
      throw error;
    }
  },

  // Get playlist by ID with songs
  getPlaylistById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/playlists/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching playlist with id ${id}:`, error);
      throw error;
    }
  },

  // Add song to favorites
  addToFavorites: async (songId, userId) => {
    try {
      const response = await axios.post(`${API_URL}/users/${userId}/favorites`, { songId });
      return response.data;
    } catch (error) {
      console.error('Error adding song to favorites:', error);
      throw error;
    }
  },

  // Remove song from favorites
  removeFromFavorites: async (songId, userId) => {
    try {
      const response = await axios.delete(`${API_URL}/users/${userId}/favorites/${songId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing song from favorites:', error);
      throw error;
    }
  },

  // Get user's favorite songs
  getFavoriteSongs: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}/favorites`);
      return response.data;
    } catch (error) {
      console.error('Error fetching favorite songs:', error);
      throw error;
    }
  }
};

export default musicService; 