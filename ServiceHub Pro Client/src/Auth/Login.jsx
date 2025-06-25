import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Eye, EyeOff, Chrome } from 'lucide-react';
import { useAuth } from './AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import Swal from 'sweetalert2';

const Login = () => {
  usePageTitle('Login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all fields.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back to ServiceHub Pro!',
        timer: 2000,
        showConfirmButton: false
      });
      navigate(from, { replace: true });
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await googleSignIn();
      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome to ServiceHub Pro!',
        timer: 2000,
        showConfirmButton: false
      });
      navigate(from, { replace: true });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Google Sign In Failed',
        text: 'Unable to sign in with Google. Please try again.',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-base-100 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back</h1>
            <p className="text-base-content/70">Sign in to your ServiceHub Pro account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="input input-bordered w-full pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="divider my-6">OR</div>

          <button
            onClick={handleGoogleSignIn}
            className={`btn btn-outline w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {!loading && <Chrome className="w-5 h-5 mr-2" />}
            Continue with Google
          </button>

          <div className="text-center mt-6">
            <p className="text-base-content/70">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:text-primary-focus font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
