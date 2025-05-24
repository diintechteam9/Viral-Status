import { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaIdCard, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';

const RegisterForm = ({ userType, onSuccess, switchToLogin }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let endpoint = '';
      
      switch (userType) {
        case 'user':
          endpoint = 'api/user/register';
          break;
        // case 'admin':
        //   endpoint = 'api/admin/register';
        //   break;
        case 'client':
          endpoint = 'api/client/register';
          break;
        default:
          throw new Error('Invalid user type');
      }

      const response = await axios.post(`${process.env.BACKEND_URL}/${endpoint}`, formData);
      console.log(response)
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderUserFields = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          <FaUser className="mr-2 text-gray-500" /> Full Name
        </label>
        <input
          type="text"
          name="name"
          required
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          placeholder="Enter your full name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          <FaEnvelope className="mr-2 text-gray-500" /> Email
        </label>
        <input
          type="email"
          name="email"
          required
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
          <FaLock className="mr-2 text-gray-500" /> Password
        </label>
        <input
          type="password"
          name="password"
          required
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          placeholder="Create a password"
        />
      </div>
    </div>
  );

  const renderClientFields = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FaUser className="mr-2 text-gray-500" /> Full Name
          </label>
          <input
            type="text"
            name="name"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FaEnvelope className="mr-2 text-gray-500" /> Email
          </label>
          <input
            type="email"
            name="email"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FaLock className="mr-2 text-gray-500" /> Password
          </label>
          <input
            type="password"
            name="password"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Create a password"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FaBuilding className="mr-2 text-gray-500" /> Business Name
          </label>
          <input
            type="text"
            name="businessName"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter business name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FaIdCard className="mr-2 text-gray-500" /> GST Number
          </label>
          <input
            type="text"
            name="gstNo"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter GST number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FaIdCard className="mr-2 text-gray-500" /> PAN Number
          </label>
          <input
            type="text"
            name="panNo"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter PAN number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FaIdCard className="mr-2 text-gray-500" /> Aadhar Number
          </label>
          <input
            type="text"
            name="aadharNo"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter Aadhar number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-gray-500" /> City
          </label>
          <input
            type="text"
            name="city"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter city"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-gray-500" /> Pincode
          </label>
          <input
            type="text"
            name="pincode"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            placeholder="Enter pincode"
          />
        </div>
      </div>
      <div>
        <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
          <FaGlobe className="mr-2 text-gray-500" /> Website URL (optional)
        </label>
        <input
          type="url"
          name="websiteUrl"
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          placeholder="Enter website URL"
        />
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-3">
          Create Your Account
        </h2>
        <p className="text-lg text-gray-600">
          {userType === 'user' ? 'Join our community' : 'Register your business'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {userType === 'user' && renderUserFields()}
        {/* {userType === 'admin' && renderAdminFields()} */}
        {userType === 'client' && renderClientFields()}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </span>
            ) : 'Create Account'}
          </button>
          <button
            type="button"
            onClick={switchToLogin}
            className="text-sm text-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm; 