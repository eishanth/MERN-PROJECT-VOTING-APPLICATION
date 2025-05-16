import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { hasVotedOnPoll, saveVote, getVotedOption } from '../utils/voteTracker';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const socket = io('http://localhost:5000');

function ViewPoll() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // Check if user has already voted when component mounts
  useEffect(() => {
    if (hasVotedOnPoll(id)) {
      setHasVoted(true);
      setSelectedOption(getVotedOption(id));
    }
  }, [id]);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/polls/${id}`);
        setPoll(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error loading poll');
        setLoading(false);
        console.error('Error fetching poll:', error);
      }
    };

    fetchPoll();
    socket.emit('joinPoll', id);

    socket.on('voteUpdate', (updatedPoll) => {
      setPoll(updatedPoll);
    });

    return () => {
      socket.off('voteUpdate');
    };
  }, [id]);

  const handleVote = async () => {
    if (hasVoted || selectedOption === null) return;

    try {
      const response = await axios.patch(`http://localhost:5000/api/polls/${id}/vote`, {
        optionIndex: selectedOption
      });

      // Save the vote in localStorage
      saveVote(id, selectedOption);

      setPoll(response.data);
      setHasVoted(true);
      socket.emit('vote', { pollId: id, updatedPoll: response.data });
    } catch (error) {
      setError('Error submitting vote');
      console.error('Error voting:', error);
    }
  };

  if (loading) return <div className="loading">Loading poll...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!poll) return <div className="error">Poll not found</div>;

  const chartData = {
    labels: poll.options.map(option => option.text),
    datasets: [
      {
        label: 'Votes',
        data: poll.options.map(option => option.votes),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Poll Results',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="view-poll">
      <h1>{poll.question}</h1>
      
      <div className="options-list">
        {poll.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !hasVoted && setSelectedOption(index)}
            className={`vote-option ${hasVoted ? 'voted' : ''} 
                      ${selectedOption === index ? 'selected' : ''} 
                      ${hasVoted && selectedOption === index ? 'user-vote' : ''}`}
            disabled={hasVoted}
          >
            <span className="option-text">{option.text}</span>
            <span className="vote-count">
              {option.votes} {option.votes === 1 ? 'vote' : 'votes'}
              {hasVoted && selectedOption === index && ' (Your vote)'}
            </span>
          </button>
        ))}
      </div>

      {!hasVoted && selectedOption !== null && (
        <button
          onClick={handleVote}
          className="submit-vote-button"
        >
          Submit Vote
        </button>
      )}

      <div className="results-chart">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {hasVoted && (
        <div className="voted-message">
          Thank you for voting! You've selected "{poll.options[selectedOption].text}"
        </div>
      )}
    </div>
  );
}

export default ViewPoll; 