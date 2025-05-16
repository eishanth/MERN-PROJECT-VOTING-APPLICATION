import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import CreatePoll from './components/CreatePoll';
import ViewPoll from './components/ViewPoll';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-brand">Voting App</div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/create">Create Poll</Link></li>
          </ul>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreatePoll />} />
            <Route path="/poll/:id" element={<ViewPoll />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
