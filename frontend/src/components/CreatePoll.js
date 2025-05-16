import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CreatePoll() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validation
    if (!question.trim()) {
      setError('Please enter a question');
      setIsSubmitting(false);
      return;
    }

    const validOptions = options.filter(opt => opt.trim());
    if (validOptions.length < 2) {
      setError('Please provide at least 2 options');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/polls', {
        question: question.trim(),
        options: validOptions
      });

      navigate(`/poll/${response.data._id}`);
    } catch (error) {
      setError('Error creating poll. Please try again.');
      console.error('Error creating poll:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-poll">
      <h1>Create New Poll</h1>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            className="form-control"
            disabled={isSubmitting}
          />
        </div>

        <div className="options-container">
          <label>Options:</label>
          {options.map((option, index) => (
            <div key={index} className="option-group">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="form-control"
                disabled={isSubmitting}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="remove-option"
                  disabled={isSubmitting}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="form-buttons">
          <button
            type="button"
            onClick={addOption}
            className="add-option"
            disabled={isSubmitting}
          >
            Add Option
          </button>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Poll'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePoll; 