import { useState, useEffect } from 'react';
import { 
  FaVolumeUp, 
  FaCopy, 
  FaTwitter, 
  FaRegLightbulb,
  FaChartLine, 
  FaTasks,
  FaMapMarkerAlt,
  FaTemperatureHigh,
  FaCalendarAlt,
  FaRegClock,
  FaRegStar,
  FaSearch
} from 'react-icons/fa';
import { 
  WiDaySunny, 
  WiCloudy, 
  WiRain, 
  WiSnow,
  WiThunderstorm,
  WiHumidity
} from 'react-icons/wi';
import './Dashboard.scss';

const Dashboard = () => {
  const [quoteContent, setQuoteContent] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const [city, setCity] = useState('Hanoi');
  const [stats, setStats] = useState({
    visitors: 1254,
    engagement: 67,
    completion: 82,
    growth: 24
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cityInput, setCityInput] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [favoriteQuotes, setFavoriteQuotes] = useState([]);

  // Fetch quote
  const fetchQuote = async () => {
    setIsLoading(true);
    setError(null);

    const fetchWithTimeout = async (url, timeout = 5000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        clearTimeout(id);
        throw error;
      }
    };

    try {
      const data = await fetchWithTimeout('https://api.quotable.io/random');
      console.log('quotes', data);
      setQuoteContent(data.content);
      setQuoteAuthor(data.author);
    } catch (error) {
      console.error('', error);
      try {
        const fallbackData = await fetchWithTimeout('https://dummyjson.com/quotes/random');
        console.log('fallback quotes', fallbackData);
        setQuoteContent(fallbackData.quote);
        setQuoteAuthor(fallbackData.author);
        setError(null);
      } catch (fallbackError) {
        console.error('Loading', fallbackError);
        setError('Failed to load quote. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch weather data
  const fetchWeather = async (city) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=6d055e39ee237af35ca066f35474e9df`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not available');
      }
      
      const data = await response.json();
      setWeather({
        temp: Math.round(data.main.temp),
        humidity: data.main.humidity,
        condition: data.weather[0].main.toLowerCase(),
        description: data.weather[0].description,
        city: data.name,
        country: data.sys.country
      });
    } catch (error) {
      console.error('Weather fetch error:', error);
      setWeatherError('Failed to load weather data');
    } finally {
      setWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
    fetchWeather(city);
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    // Load favorite quotes from localStorage
    const savedFavorites = localStorage.getItem('favoriteQuotes');
    if (savedFavorites) {
      setFavoriteQuotes(JSON.parse(savedFavorites));
    }
    
    return () => clearInterval(timeInterval);
  }, [city]);

  const handleCopy = () => {
    if (quoteContent && !isLoading && !error) {
      navigator.clipboard
        .writeText(`${quoteContent} - ${quoteAuthor}`)
        .then(() => alert('Copied to clipboard'))
        .catch((err) => console.error('Copy Failed', err));
    }
  };

  const handleSpeech = () => {
    if (quoteContent && !isLoading && !error) {
      const utterance = new SpeechSynthesisUtterance(`${quoteContent} by ${quoteAuthor}`);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTweet = () => {
    if (quoteContent && !isLoading && !error) {
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `${quoteContent} - ${quoteAuthor}`
      )}`;
      window.open(tweetUrl, '_blank');
    }
  };
  
  const handleSaveQuote = () => {
    if (quoteContent && !isLoading && !error) {
      const newFavorite = {
        id: Date.now(),
        content: quoteContent,
        author: quoteAuthor
      };
      
      const updatedFavorites = [...favoriteQuotes, newFavorite];
      setFavoriteQuotes(updatedFavorites);
      
      // Save to localStorage
      localStorage.setItem('favoriteQuotes', JSON.stringify(updatedFavorites));
      alert('Quote saved to favorites!');
    }
  };
  
  const handleDeleteFavorite = (id) => {
    const updatedFavorites = favoriteQuotes.filter(quote => quote.id !== id);
    setFavoriteQuotes(updatedFavorites);
    localStorage.setItem('favoriteQuotes', JSON.stringify(updatedFavorites));
  };
  
  const handleCitySearch = (e) => {
    e.preventDefault();
    if (cityInput.trim()) {
      fetchWeather(cityInput);
      setCity(cityInput);
      setCityInput('');
      setSearchVisible(false);
    }
  };

  const getWeatherIcon = () => {
    if (!weather) return null;
    
    if (weather.condition.includes('cloud')) return <WiCloudy className="weather-icon" />;
    if (weather.condition.includes('rain')) return <WiRain className="weather-icon" />;
    if (weather.condition.includes('snow')) return <WiSnow className="weather-icon" />;
    if (weather.condition.includes('thunder')) return <WiThunderstorm className="weather-icon" />;
    return <WiDaySunny className="weather-icon" />;
  };
  
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  const formatTime = (date) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return date.toLocaleTimeString('en-US', options);
  };

  return (
    <div className="quotes-container">
      <div className="quotes-wrapper">
        {/* Date and Time Display */}
        <div className="datetime-display">
          <div className="date">
            <FaCalendarAlt />
            <span>{formatDate(currentTime)}</span>
          </div>
          <div className="time">
            <FaRegClock />
            <span>{formatTime(currentTime)}</span>
          </div>
        </div>
        
        {/* Weather Widget */}
        <div className="weather-widget">
          {weatherLoading ? (
            <p className="loading-text">Loading weather...</p>
          ) : weatherError ? (
            <p className="error-text">{weatherError}</p>
          ) : (
            <>
              <div className="weather-header">
                <div className="weather-location">
                  <FaMapMarkerAlt /> 
                  <span>{weather?.city}, {weather?.country}</span>
                  <button 
                    className="search-toggle" 
                    onClick={() => setSearchVisible(!searchVisible)}
                    title="Search city"
                  >
                    <FaSearch />
                  </button>
                </div>
                <div className="weather-icon-container">
                  {getWeatherIcon()}
                </div>
              </div>
              
              {searchVisible && (
                <form className="city-search" onSubmit={handleCitySearch}>
                  <input
                    type="text"
                    value={cityInput}
                    onChange={(e) => setCityInput(e.target.value)}
                    placeholder="Enter city name..."
                  />
                  <button type="submit">Search</button>
                </form>
              )}
              
              <div className="weather-details">
                <div className="weather-temp">
                  <FaTemperatureHigh />
                  <span>{weather?.temp}°C</span>
                </div>
                <div className="weather-humidity">
                  <WiHumidity />
                  <span>{weather?.humidity}%</span>
                </div>
                <div className="weather-desc">
                  <span>{weather?.description}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Quote Content */}
        <div className="quotes-content">
          <h1 className="title">QUOTES OF THE DAY</h1>

          <div className="quotes-content">
            {error ? (
              <p className="error-message" style={{ color: 'red' }}>
                {error}
              </p>
            ) : (
              <p className="quotes-text">
                <span className="left-quote">❝</span>
                {isLoading ? 'Loading quote...' : quoteContent || 'No quote available'}
                <span className="right-quote">❞</span>
              </p>
            )}
            <h2 className="name-author">
              <span>-</span> {quoteAuthor || 'Unknown'} <span>-</span>
            </h2>
          </div>
        </div>
        <hr className="divider" />

        <div className="quotes-button">
          <div className="quote-footer">
            <div className="left-icons">
              <button
                className="circle-btn"
                onClick={handleSpeech}
                disabled={isLoading || !!error || !quoteContent}
                title="Read quote aloud"
              >
                <FaVolumeUp />
              </button>
              <button
                className="circle-btn"
                onClick={handleCopy}
                disabled={isLoading || !!error || !quoteContent}
                title="Copy quote"
              >
                <FaCopy />
              </button>
              <button
                className="circle-btn"
                onClick={handleTweet}
                disabled={isLoading || !!error || !quoteContent}
                title="Share on Twitter"
              >
                <FaTwitter />
              </button>
              <button
                className="circle-btn save-btn"
                onClick={handleSaveQuote}
                disabled={isLoading || !!error || !quoteContent}
                title="Save to favorites"
              >
                <FaRegStar />
              </button>
            </div>
            <button
              className="new-quote-btn"
              onClick={fetchQuote}
              disabled={isLoading}
              title="Get a new quote"
            >
              {isLoading ? 'Loading...' : 'New Quote'}
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <h2 className="stats-title"><FaChartLine /> Overview</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <FaRegLightbulb />
              </div>
              <div className="stat-content">
                <h3>Visitors</h3>
                <p className="stat-value">{stats.visitors}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaTasks />
              </div>
              <div className="stat-content">
                <h3>Completion</h3>
                <p className="stat-value">{stats.completion}%</p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${stats.completion}%` }}></div>
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <FaChartLine />
              </div>
              <div className="stat-content">
                <h3>Growth</h3>
                <p className="stat-value">{stats.growth}%</p>
                <div className="progress-bar">
                  <div className="progress" style={{ width: `${stats.growth}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Favorite Quotes */}
        {favoriteQuotes.length > 0 && (
          <div className="favorite-quotes">
            <h2 className="favorites-title"><FaRegStar /> Favorite Quotes</h2>
            <div className="favorites-list">
              {favoriteQuotes.map(quote => (
                <div key={quote.id} className="favorite-item">
                  <p className="favorite-content">"{quote.content}"</p>
                  <div className="favorite-footer">
                    <span className="favorite-author">— {quote.author}</span>
                    <button 
                      className="delete-favorite" 
                      onClick={() => handleDeleteFavorite(quote.id)}
                      title="Remove from favorites"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
