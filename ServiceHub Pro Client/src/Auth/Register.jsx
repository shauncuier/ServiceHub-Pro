import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Chrome, User, Mail, Image } from 'lucide-react';
import { useAuth } from './AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import Swal from 'sweetalert2';

const Register = () => {
  usePageTitle('Register');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    photoURL: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const { name, email, password } = formData;
    
    if (!name || !email || !password) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Information',
        text: 'Please fill in all required fields.',
        confirmButtonColor: '#3085d6'
      });
      return false;
    }

    if (password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long.',
        confirmButtonColor: '#3085d6'
      });
      return false;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Password must contain at least one uppercase and one lowercase letter.',
        confirmButtonColor: '#3085d6'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData.email, formData.password, formData.name);
      Swal.fire({
        icon: 'success',
        title: 'Account Created!',
        text: 'Welcome to ServiceHub Pro! Please login to continue.',
        timer: 2000,
        showConfirmButton: false
      });
      navigate('/login');
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
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
        title: 'Account Created!',
        text: 'Welcome to ServiceHub Pro!',
        timer: 2000,
        showConfirmButton: false
      });
      navigate('/');
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Google Sign Up Failed',
        text: 'Unable to create account with Google. Please try again.',
        confirmButtonColor: '#3085d6'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-base-100 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
            <p className="text-base-content/70">Join ServiceHub Pro today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className="input input-bordered w-full pl-12"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full pl-12"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Photo URL (Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="photoURL"
                  placeholder="Enter photo URL"
                  className="input input-bordered w-full pl-12"
                  value={formData.photoURL}
                  onChange={handleChange}
                />
                <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" size={20} />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Create a password"
                  className="input input-bordered w-full pr-12"
                  value={formData.password}
                  onChange={handleChange}
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
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  6+ chars with uppercase & lowercase
                </span>
              </label>
            </div>

            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
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
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:text-primary-focus font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
