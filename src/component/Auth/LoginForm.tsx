import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
  const { login, logout, isLoggedIn } = useAuth();
  const [username, setUsername] = useState('user');
  const [password, setPassword] = useState('pass');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login({ username, password })) {
      setError('');
    } else {
      setError('Invalid username or password (use user/pass)');
    }
  };

  if (isLoggedIn) {
    return (
      <div className="p-4 text-center bg-green-100 rounded-lg shadow-md">
        <p className="font-semibold text-green-700">Logged in successfully!</p>
        <button
          onClick={logout}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md space-y-3 max-w-sm mx-auto">
      <h3 className="text-xl font-bold text-center">Mock Login</h3>
      <input
        type="text"
        placeholder="Username (user)"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 border rounded-lg"
      />
      <input
        type="password"
        placeholder="Password (pass)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded-lg"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;