import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/polls');
        setPolls(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching polls. Please try again later.');
        setLoading(false);
        console.error('Error fetching polls:', error);
      }
    };

    fetchPolls();
  }, []);

  if (loading) return <div className="loading">Loading polls...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="home">
      <h1>Active Polls</h1>
      {polls.length === 0 ? (
        <div className="no-polls">
          <p>No active polls found.</p>
          <Link to="/create" className="create-poll-button">Create a New Poll</Link>
        </div>
      ) : (
        <div className="polls-grid">
          {polls.map(poll => (
            <div key={poll._id} className="poll-card">
              <h3>{poll.question}</h3>
              <div className="poll-info">
                <p>{poll.options.length} options</p>
                <p>Total votes: {poll.options.reduce((sum, option) => sum + option.votes, 0)}</p>
              </div>
              <Link to={`/poll/${poll._id}`} className="vote-button">
                Vote Now
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home; 