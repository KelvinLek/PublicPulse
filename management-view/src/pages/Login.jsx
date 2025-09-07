import React from 'react';
import './Auth.css';


const Login = ({ onSwitchToRegister, onLogin }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (onLogin) onLogin(email, password);
  };

  return (
    <section className="auth-page">
      <div className="auth-container">
        <h2>Login to Your Account</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input type="email" id="login-email" name="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input type="password" id="login-password" name="password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary">Login</button>
        </form>
        <p className="auth-switch">
          Don't have an account? <button type="button" className="link-btn" onClick={onSwitchToRegister}>Register here</button>
        </p>
      </div>
    </section>
  );
};

export default Login;
