import { useState } from "react";
import { auth } from "../api/Api";
import { useNavigate } from "react-router-dom";

const Signup = ({ selectedRole }) => {
  const roleToUse = selectedRole || 'investor';
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    investment_range: '',
    experience_level: '',
    farm_size: '',
    primary_crops: '',
    farm_location: '',
    farming_experience: '',
    project_description: '',
    agreeToTerms: false,
    agreeToMarketing: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (error) setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const requiredFields = [
      { value: formData.first_name.trim(), message: 'First name is required' },
      { value: formData.last_name.trim(), message: 'Last name is required' },
      { value: formData.username.trim(), message: 'Username is required' },
      { value: formData.email.trim(), message: 'Email address is required' },
      { value: formData.password, message: 'Password is required' },
    ];

    const missing = requiredFields.find((item) => !item.value);
    if (missing) {
      setError(missing.message);
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms and conditions');
      setLoading(false);
      return;
    }

    if (roleToUse === 'investor' && !formData.investment_range) {
      setError('Select your investment range');
      setLoading(false);
      return;
    }

    if (
      roleToUse === 'farmer' &&
      (!formData.farm_size || !formData.primary_crops.trim() || !formData.farm_location.trim())
    ) {
      setError('Provide your farm size, primary crops, and location');
      setLoading(false);
      return;
    }

    try {
      const result = await auth.signup({ ...formData, role: roleToUse });
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Unable to create account. Please try again.');
      }
    } catch (signupError) {
      console.error(signupError);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-semibold text-slate-900">
          Create your {roleToUse === 'investor' ? 'investor' : 'farmer'} account
        </h2>
        <p className="text-sm text-slate-600">
          {roleToUse === 'investor'
            ? 'Invest in promising agricultural ventures and diversify your holdings.'
            : 'Raise capital and connect with investors who believe in sustainable farming.'}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col text-sm font-medium text-slate-700">
          First name*
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            required
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-700">
          Last name*
          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            required
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-700 md:col-span-2">
          Username*
          <input
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            required
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-700">
          Email address*
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            required
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-700">
          Phone number
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-700">
          Password*
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            required
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-700">
          Confirm password*
          <input
            name="confirm_password"
            type="password"
            value={formData.confirm_password}
            onChange={handleInputChange}
            className="mt-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            required
          />
        </label>

        {roleToUse === 'investor' ? (
          <div className="md:col-span-2 space-y-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Investment range*
              <select
                name="investment_range"
                value={formData.investment_range}
                onChange={handleInputChange}
                className="mt-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              >
                <option value="">Select an amount</option>
                <option value="1k-10k">$1,000 - $10,000</option>
                <option value="10k-50k">$10,000 - $50,000</option>
                <option value="50k-100k">$50,000 - $100,000</option>
                <option value="100k+">$100,000+</option>
              </select>
            </label>
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Experience level
              <select
                name="experience_level"
                value={formData.experience_level}
                onChange={handleInputChange}
                className="mt-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Select experience</option>
                <option value="beginner">Beginner (0-2 years)</option>
                <option value="intermediate">Intermediate (2-5 years)</option>
                <option value="advanced">Advanced (5+ years)</option>
              </select>
            </label>
          </div>
        ) : (
          <div className="md:col-span-2 space-y-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col text-sm font-medium text-slate-700">
                Farm size*
                <select
                  name="farm_size"
                  value={formData.farm_size}
                  onChange={handleInputChange}
                  className="mt-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  required
                >
                  <option value="">Select size</option>
                  <option value="small">Small (1-10 acres)</option>
                  <option value="medium">Medium (10-50 acres)</option>
                  <option value="large">Large (50+ acres)</option>
                </select>
              </label>
              <label className="flex flex-col text-sm font-medium text-slate-700">
                Farming experience
                <select
                  name="farming_experience"
                  value={formData.farming_experience}
                  onChange={handleInputChange}
                  className="mt-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Years farming</option>
                  <option value="1-5">1-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </label>
            </div>
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Primary crops*
              <input
                name="primary_crops"
                value={formData.primary_crops}
                onChange={handleInputChange}
                className="mt-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Farm location*
              <input
                name="farm_location"
                value={formData.farm_location}
                onChange={handleInputChange}
                className="mt-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium text-slate-700">
              Project description
              <textarea
                name="project_description"
                value={formData.project_description}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          </div>
        )}
      </div>

      <div className="space-y-3 text-sm text-slate-600">
        <label className="flex items-start gap-3">
          <input
            className="mt-1 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            name="agreeToTerms"
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            required
          />
          <span>
            I agree to the
            {' '}
            <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700">Terms of Service</a>
            {' '}
            and
            {' '}
            <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700">Privacy Policy</a>.
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
            className="mt-1 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            name="agreeToMarketing"
            type="checkbox"
            checked={formData.agreeToMarketing}
            onChange={handleInputChange}
          />
          <span>Keep me posted about platform updates and opportunities.</span>
        </label>
      </div>

      <button
        className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
        type="submit"
        disabled={loading}
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
};

export default Signup;
