import Session from '../../models/Session.js';

const getAllSessions = async () => {
  return await Session.find().populate('mentor mentee', 'name email');
};

const createSession = async (sessionData) => {
  const session = new Session(sessionData);
  return await session.save();
};

export { getAllSessions, createSession };
export default { getAllSessions, createSession };
