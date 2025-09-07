import React from 'react';
import './Auth.css';


const Register = ({ onSwitchToLogin, onRegister }) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSubmit = e => {
    e.preventDefault();
    if (onRegister) onRegister(name, email, password, confirmPassword);
  };

  return (
    <section className="auth-page">
      <div className="auth-container">
        <h2>Create Account</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="register-name">Full Name</label>
            <input type="text" id="register-name" name="name" required value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="register-email">Email</label>
            <input type="email" id="register-email" name="email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="register-password">Password</label>
            <input type="password" id="register-password" name="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="register-confirm">Confirm Password</label>
            <input type="password" id="register-confirm" name="confirmPassword" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary">Register</button>
        </form>
        <p className="auth-switch">
          Already have an account? <button type="button" className="link-btn" onClick={onSwitchToLogin}>Login here</button>
        </p>
      </div>
    </section>
  );
};

export default Register;
