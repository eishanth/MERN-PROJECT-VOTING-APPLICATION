const STORAGE_KEY = 'votedPolls';

export const getVotedPolls = () => {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
};

export const hasVotedOnPoll = (pollId) => {
  const votedPolls = getVotedPolls();
  return !!votedPolls[pollId];
};

export const saveVote = (pollId, optionIndex) => {
  const votedPolls = getVotedPolls();
  votedPolls[pollId] = optionIndex;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(votedPolls));
};

export const getVotedOption = (pollId) => {
  const votedPolls = getVotedPolls();
  return votedPolls[pollId];
}; 