import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaDatabase,
  FaRobot,
  FaComments,
  FaHeadset,
  FaCog,
  FaShieldAlt,
  FaQuestionCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaSearch,
  FaEdit,
  FaTrash,
  FaUserShield,
  FaUsers,
  FaBuilding,
  FaTools,
  FaServer,
  FaNetworkWired,
  FaAngleLeft
} from "react-icons/fa";
import LoginForm from "../auth/LoginForm";

const SuperAdminDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isMobile, setIsMobile] = useState(false);
  const [admins, setAdmins] = useState(null);
  const [clients, setClients] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [selectedAdminName, setSelectedAdminName] = useState('');
  const [showClientLoginModal, setShowClientLoginModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedClientName, setSelectedClientName] = useState('');
  const [admincount, setadmincount] = useState(null);
  const [clientcount, setclientcount] = useState(null);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    websiteUrl: '',
    city: '',
    pincode: '',
    gstNo: '',
    panNo: '',
    aadharNo: ''
  });

  // Check if screen is mobile and handle resize events
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth < 992) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Check on initial load
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    // Close sidebar automatically on mobile after clicking a tab
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const getAdmins = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:4000/api/superadmin/getadmins"
      );
      const data = await response.json();
      console.log(data);
      setAdmins(data.data);
      setadmincount(data.count)
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getClients = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:4000/api/superadmin/getclients"
      );
      const data = await response.json();
      console.log(data);
      setClients(data.data);
      setclientcount(data.count);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const deleteadmin = async(id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:4000/api/superadmin/deleteadmin/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete admin');
      }

      // Refresh the admin list
      await getAdmins();
      
      // Show success message
      alert('Admin deleted successfully');
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert(error.message || 'Failed to delete admin. Please try again.');
    }
  };

  const deleteclient = async(id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`http://localhost:4000/api/superadmin/deleteclient/${id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete client');
      }

      // Refresh the client list
      await getClients();
      
      // Show success message
      alert('Client deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      alert(error.message || 'Failed to delete client. Please try again.');
    }
  };

  useEffect(() => {
    console.log(activeTab);
    if(activeTab === "Overview"){
      getAdmins();
      getClients();
    }
    if (activeTab === "Admin Management") {
      getAdmins();
    } 
    if (activeTab === "Client Management") {
      getClients();
    }
  }, [activeTab]);

  // Handle admin login
  const handleAdminLogin = (loginData) => {
    // Close the modal
    setShowLoginModal(false);
    
    onLogout(); // First logout from super admin
    
    // Small delay to ensure logout completes before login
    setTimeout(() => {
      window.location.href = "/"; // Redirect to root where the auth state will be checked
      
      // Store login data for the auth flow to pick up
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('userId', loginData.user._id || loginData.user.id);
    }, 100);
  };
    // Handle client login
    const handleClientLogin = (loginData) => {
      // Close the modal
      setShowClientLoginModal(false);
      
      onLogout(); // First logout from super admin
      
      // Small delay to ensure logout completes before login
      setTimeout(() => {
        window.location.href = "/"; // Redirect to root where the auth state will be checked
        
        // Store login data for the auth flow to pick up
        localStorage.setItem('token', loginData.token);
        localStorage.setItem('userType', 'client');
        localStorage.setItem('userId', loginData.user._id || loginData.user.id);
      }, 100);
    };
  
  // Open login modal for a specific admin
  const openAdminLogin = (adminId, adminEmail, adminName) => {
    setSelectedAdminId(adminId);
    setSelectedAdminName(adminName);
    setShowLoginModal(true);
    
    // Store the admin email in sessionStorage for the login form to use
    if (adminEmail) {
      sessionStorage.setItem('tempadminEmail', adminEmail);
    }
  };

   // Open login modal for a specific admin
   const openClientLogin = (clientId, clientEmail, clientName) => {
    setSelectedClientId(clientId);
    setSelectedClientName(clientName);
    setShowClientLoginModal(true);
    
    // Store the admin email in sessionStorage for the login form to use
    if (clientEmail) {
      sessionStorage.setItem('tempClientEmail', clientEmail);
    }
  };

  // Filter admins based on search term
  const filteredAdmins = admins ? 
    admins.filter(admin => 
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

  // Filter clients based on search term
  const filteredClients = clients ? 
    clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

  const navItems = [
    { name: "Overview", icon: <FaChartBar /> },
    { name: "Admin Management", icon: <FaUserShield /> },
    { name: "Client Management", icon: <FaBuilding /> },
    { name: "System Settings", icon: <FaTools /> },
    { name: "Server Management", icon: <FaServer /> },
    { name: "API Management", icon: <FaNetworkWired /> },
    { name: "Database", icon: <FaDatabase /> },
    { name: "Security", icon: <FaShieldAlt /> },
    { name: "Support", icon: <FaHeadset /> },
    { name: "Configuration", icon: <FaCog /> },
    { name: "Settings", icon: <FaCog />, subItems: ["Log out"] },
  ];

  // Format date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      if (newAdmin.password !== newAdmin.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:4000/api/superadmin/registeradmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newAdmin.name,
          email: newAdmin.email,
          password: newAdmin.password
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create admin');
      }

      setShowAddAdminModal(false);
      setNewAdmin({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      await getAdmins();
      alert('Admin created successfully');
    } catch (error) {
      console.error('Error creating admin:', error);
      alert(error.message || 'Failed to create admin. Please try again.');
    }
  };

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      if (newClient.password !== newClient.confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:4000/api/superadmin/registerclient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newClient.name,
          email: newClient.email,
          password: newClient.password,
          businessName: newClient.businessName,
          websiteUrl: newClient.websiteUrl,
          city: newClient.city,
          pincode: newClient.pincode,
          gstNo: newClient.gstNo,
          panNo: newClient.panNo,
          aadharNo: newClient.aadharNo
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create client');
      }

      setShowAddClientModal(false);
      setNewClient({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        businessName: '',
        websiteUrl: '',
        city: '',
        pincode: '',
        gstNo: '',
        panNo: '',
        aadharNo: ''
      });
      await getClients();
      alert('Client created successfully');
    } catch (error) {
      console.error('Error creating client:', error);
      alert(error.message || 'Failed to create client. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddAdminModal(false)}
            >
              <FaTimes size={20} />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Add New Admin</h2>
              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={newAdmin.name}
                    onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={newAdmin.confirmPassword}
                    onChange={(e) => setNewAdmin({...newAdmin, confirmPassword: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Create Admin
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddClientModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative min-h-screen">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowAddClientModal(false)}
            >
              <FaTimes size={20} />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Add New Client</h2>
              <form onSubmit={handleAddClient} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={newClient.name}
                    onChange={(e) => setNewClient({...newClient, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={newClient.email}
                    onChange={(e) => setNewClient({...newClient, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={newClient.password}
                    onChange={(e) => setNewClient({...newClient, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={newClient.confirmPassword}
                    onChange={(e) => setNewClient({...newClient, confirmPassword: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Business Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={newClient.businessName}
                    onChange={(e) => setNewClient({...newClient, businessName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Website URL</label>
                  <input
                    type="url"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={newClient.websiteUrl}
                    onChange={(e) => setNewClient({...newClient, websiteUrl: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      value={newClient.city}
                      onChange={(e) => setNewClient({...newClient, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pincode</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                      value={newClient.pincode}
                      onChange={(e) => setNewClient({...newClient, pincode: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">GST Number</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={newClient.gstNo}
                    onChange={(e) => setNewClient({...newClient, gstNo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">PAN Number</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={newClient.panNo}
                    onChange={(e) => setNewClient({...newClient, panNo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    value={newClient.aadharNo}
                    onChange={(e) => setNewClient({...newClient, aadharNo: e.target.value})}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Create Client
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowLoginModal(false)}
            >
              <FaTimes size={20} />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
              {selectedAdminName && (
                <p className="text-center text-gray-600 mb-4">
                  Logging in as: <span className="font-semibold">{selectedAdminName}</span>
                </p>
              )}
              <LoginForm userType="admin" onLogin={handleAdminLogin} switchToRegister={() => {}} />
            </div>
          </div>
        </div>
      )}
      {/* Client Login Modal */}

      {showClientLoginModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
            <button 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowClientLoginModal(false)}
            >
              <FaTimes size={20} />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-center">Client Login</h2>
              {selectedClientName && (
                <p className="text-center text-gray-600 mb-4">
                  Logging in as: <span className="font-semibold">{selectedClientName}</span>
                </p>
              )}
              <LoginForm userType="client" onLogin={handleClientLogin} switchToRegister={() => {}} />
            </div>
          </div>
        </div>
      )}

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-purple-900 text-white shadow-xl z-50 transition-all duration-300 ease-in-out ${
          isMobile
            ? isSidebarOpen
              ? "w-64 translate-x-0"
              : "-translate-x-full w-64"
            : isSidebarOpen
            ? "w-64"
            : "w-20"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-purple-800">
          {isSidebarOpen && (
            <h4 className="m-0 font-semibold text-lg">Super Admin Panel</h4>
          )}
          <button
            className="text-white hover:text-gray-300 focus:outline-none"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <FaAngleLeft size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        <div
          className="flex flex-col mt-3 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 60px)" }}
        >
          {navItems.map((item, index) => (
            <div key={index}>
              <button
                className={`flex items-center w-full py-3 px-5 text-left hover:bg-purple-800 ${
                  activeTab === item.name
                    ? "bg-purple-700 text-white"
                    : "text-gray-300"
                }`}
                onClick={() => handleTabClick(item.name)}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                {(isSidebarOpen || isMobile) && <span>{item.name}</span>}
              </button>

              {/* Dropdown for Settings */}
              {isSidebarOpen && item.subItems && activeTab === item.name && (
                <div className="ml-8 mt-1 mb-2">
                  {item.subItems.map((subItem, subIndex) => (
                    <button
                      key={subIndex}
                      className="flex items-center w-full py-2 text-left hover:bg-purple-800 text-gray-300"
                      onClick={() => {
                        if (subItem === "Log out") onLogout();
                      }}
                    >
                      {subItem === "Log out" && (
                        <FaSignOutAlt className="mr-2" />
                      )}
                      <span>{subItem}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div
        className={`${
          isMobile ? "ml-0" : isSidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Mobile header with toggle button */}
        {isMobile && (
          <div className="flex justify-between items-center p-4 bg-white shadow-sm">
            <button
              className="p-2 bg-purple-800 text-white rounded-md"
              onClick={toggleSidebar}
            >
              <FaBars />
            </button>
            <h4 className="m-0 font-bold">Super Admin Panel</h4>
          </div>
        )}

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{activeTab}</h2>
                <nav className="text-sm">
                  <ol className="flex">
                    <li className="mr-2">
                      <a href="#" className="text-purple-500 hover:text-purple-700">
                        Dashboard
                      </a>
                    </li>
                    <li className="mr-2">/</li>
                    <li className="text-gray-500">{activeTab}</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>

          {/* Dashboard Content based on active tab */}
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-purple-500 text-white rounded-lg p-4 h-full shadow">
                <h5 className="text-lg font-semibold">Total Admins</h5>
                <h2 className="text-3xl my-2">{admincount}</h2>
                <p className="text-sm">3 new this month</p>
              </div>
              <div className="bg-blue-500 text-white rounded-lg p-4 h-full shadow">
                <h5 className="text-lg font-semibold">Total Clients</h5>
                <h2 className="text-3xl my-2">{clientcount}</h2>
                <p className="text-sm">12% increase from last month</p>
              </div>
              <div className="bg-green-500 text-white rounded-lg p-4 h-full shadow">
                <h5 className="text-lg font-semibold">System Health</h5>
                <h2 className="text-3xl my-2">99.8%</h2>
                <p className="text-sm">All systems operational</p>
              </div>
            </div>
          )}

          {/* Admin Management Table */}
          {activeTab === "Admin Management" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Search and filters */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                  <h3 className="text-xl font-semibold">Admin Users</h3>
                  
                  <div>
                      <button 
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg"
                        onClick={() => setShowAddAdminModal(true)}
                      >
                        Add Admin
                      </button>
                    </div>
                </div>
                <div className="relative m-2">
                    <input
                      type="text"
                      placeholder="Search admins..."
                      className="pl-10 w-full pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <FaSearch className="text-gray-400" />
                    </div>
                   
                  </div>
              </div>
              
              {/* Table */}
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading admins...</p>
                  </div>
                ) : !admins || admins.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No admins found.</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredAdmins.map((admin, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-500 font-semibold">
                                {admin.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                                <div className="text-sm text-gray-500">Admin since {formatDate(admin.createdAt)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{admin.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-6 text-sm font-medium flex space-x-3">
                            <button 
                              onClick={() => openAdminLogin(admin._id, admin.email, admin.name)} 
                              className="text-purple-500 hover:text-purple-700" 
                              title="Log in as this admin"
                            >
                              Login
                            </button>
                            {/* <button 
                              className="text-blue-500 hover:text-blue-700" 
                              title="Edit admin"
                            >
                              Edit
                            </button> */}
                            <button 
                              className="text-red-500 hover:text-red-700" 
                              onClick={()=>deleteadmin(admin._id)}
                              title="Delete admin"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* Client Management Table */}
          {activeTab === "Client Management" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Search and filters */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                  <h3 className="text-xl font-semibold">Clients</h3>
                  
                  <div>
                      <button 
                        className="bg-purple-500 text-white px-4 py-2 rounded-lg"
                        onClick={() => setShowAddClientModal(true)}
                      >
                        Add Client
                      </button>
                    </div>
                </div>
                <div className="relative m-2">
                    <input
                      type="text"
                      placeholder="Search admins..."
                      className="pl-10 w-full pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <FaSearch className="text-gray-400" />
                    </div>
                   
                  </div>
              </div>
              
              {/* Table */}
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading clients...</p>
                  </div>
                ) : !clients || clients.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500">No clients found.</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredClients.map((client, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-semibold">
                                {client.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{client.name}</div>
                                <div className="text-sm text-gray-500">Client since {formatDate(client.createdAt)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{client.businessName}</div>
                            <div className="text-sm text-gray-500">
                              {client.websiteUrl ? (
                                <a href={client.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-500 hover:underline">
                                  Website
                                </a>
                              ) : (
                                "No website"
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{client.email}</div>
                            <div className="text-sm text-gray-500">
                              {client.city}, {client.pincode}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              <p>GST: {client.gstNo}</p>
                              <p>PAN: {client.panNo}</p>
                              <p>Aadhar: {client.aadharNo}</p>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-sm font-medium flex space-x-3">
                          <button 
                              onClick={() => openClientLogin(client._id, client.email, client.name)} 
                              className="text-purple-500 hover:text-purple-700" 
                              title="Log in as this client"
                            >
                              Login
                            </button>
                            {/* <button 
                              className="text-blue-500 hover:text-blue-700" 
                              title="Edit client"
                            >
                              Edit
                            </button> */}
                            <button 
                              className="text-red-500 hover:text-red-700"
                              onClick={()=>deleteclient(client._id)} 
                              title="Delete client"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* System Settings */}
          {activeTab === "System Settings" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">System Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Email Settings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">SMTP Server</span>
                      <span>smtp.example.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SMTP Port</span>
                      <span>587</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">From Email</span>
                      <span>system@example.com</span>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">API Configuration</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">API Version</span>
                      <span>v2.3.1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rate Limit</span>
                      <span>100/minute</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timeout</span>
                      <span>30 seconds</span>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Security Settings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Password Policy</span>
                      <span>Strong</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">2FA</span>
                      <span>Enabled</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Session Timeout</span>
                      <span>30 minutes</span>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Storage</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Provider</span>
                      <span>AWS S3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Region</span>
                      <span>us-east-1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Retention Policy</span>
                      <span>90 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard; 