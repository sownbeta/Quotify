import { useState, useEffect } from 'react';
import { FaVolumeUp, FaCopy, FaTwitter } from 'react-icons/fa';
import './Dashboard.scss';
import Header from '../../components/layout/Header/Header';
import Footer from '../../components/layout/Footer/Footer';
const App = () => {
  const [quoteContent, setQuoteContent] = useState('');
  const [quoteAuthor, setQuoteAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

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

  return (
    <div className="quotes-container">
      <Header />
      <div className="quotes-wrapper">
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
      </div>
      <Footer/>
    </div>
  );
};

export default App;
