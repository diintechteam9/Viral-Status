import React, { useState, useEffect } from "react";
import { useAsyncError, useNavigate } from "react-router-dom";
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
  FaExternalLinkAlt,
  FaAngleLeft
} from "react-icons/fa";
import LoginForm from "../auth/LoginForm";

const AdminDashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isMobile, setIsMobile] = useState(false);
  const [clients, setclients] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedClientName, setSelectedClientName] = useState('');
  const [clientcount,setclientcount]=useState(null);

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
  const getclients = async (req, res) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        "http://localhost:4000/api/admin/getclients"
      );
      const data = await response.json();
      console.log(data.data);
      setclients(data.data);
      setclientcount(data.count);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
 
  useEffect(()=>{
    console.log(activeTab)
    if(activeTab=="Client" || activeTab=="Overview"){
      getclients()
    }
  },[activeTab])

  // Handle client login
  const handleClientLogin = (loginData) => {
    // Close the modal
    setShowLoginModal(false);
    
    // Use the login data from the form to authenticate the client
    // The App component will handle setting localStorage and rendering the ClientDashboard
    // We don't need window.location.href as onLogin will update state in App component
    onLogout(); // First logout from admin
    
    // Small delay to ensure logout completes before login
    setTimeout(() => {
      // Use the onLogin prop which was passed down from App
      // This function is defined in App.jsx and handles all the authentication logic
      window.location.href = "/"; // Redirect to root where the auth state will be checked
      
      // Store login data for the auth flow to pick up
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('userType', 'client');
      localStorage.setItem('userId', loginData.user._id || loginData.user.id);
    }, 100);
  };
  
  // Open login modal for a specific client
  const openClientLogin = (clientId, clientEmail, clientName) => {
    setSelectedClientId(clientId);
    setSelectedClientName(clientName);
    setShowLoginModal(true);
    
    // Store the client email in sessionStorage for the login form to use
    if (clientEmail) {
      sessionStorage.setItem('tempClientEmail', clientEmail);
    }
  };

  // Filter clients based on search term
  const filteredClients = clients ? 
    clients.filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

  const navItems = [
    { name: "Overview", icon: <FaChartBar /> },
    { name: "Client", icon: <FaChartBar /> },
    { name: "Datastore", icon: <FaDatabase /> },
    { name: "AI Agent", icon: <FaRobot /> },
    { name: "Conversation", icon: <FaComments /> },
    { name: "Support", icon: <FaHeadset /> },
    { name: "Configuration", icon: <FaCog /> },
    { name: "Security", icon: <FaShieldAlt /> },
    { name: "Help", icon: <FaQuestionCircle /> },
    { name: "Settings", icon: <FaCog />, subItems: ["Log out"] },
  ];

  const sidebarWidth = isSidebarOpen ? "16rem" : "5rem";

  // Format date nicely
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Client Login Modal */}
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
          className="fixed top-0 left-0 w-full h-full opacity-50 z-40 bg-black"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-all duration-300 ease-in-out ${
          isMobile
            ? isSidebarOpen
              ? "w-64 translate-x-0"
              : "-translate-x-full w-64"
            : isSidebarOpen
            ? "w-64"
            : "w-20"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          {isSidebarOpen && (
            <h4 className="m-0 font-semibold text-lg">Admin Panel</h4>
          )}
          <button
            className="text-black hover:text-gray-700 focus:outline-none"
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
                className={`flex items-center w-full py-3 px-5 text-left hover:bg-gray-100 ${
                  activeTab === item.name
                    ? "bg-blue-500 text-white"
                    : "text-black"
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
                      className="flex items-center w-full py-2 text-left hover:bg-gray-100 text-black"
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
              className="p-2 bg-gray-800 text-white rounded-md"
              onClick={toggleSidebar}
            >
              <FaBars />
            </button>
            <h4 className="m-0 font-bold">Admin Panel</h4>
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
                      <a href="#" className="text-blue-500 hover:text-blue-700">
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
              <div className="bg-blue-500 text-white rounded-lg p-4 h-full shadow">
                <h5 className="text-lg font-semibold">Total Clients</h5>
                <h2 className="text-3xl my-2">{clientcount}</h2>
                <p className="text-sm">12% increase from last month</p>
              </div>
              <div className="bg-green-500 text-white rounded-lg p-4 h-full shadow">
                <h5 className="text-lg font-semibold">Active Sessions</h5>
                <h2 className="text-3xl my-2">423</h2>
                <p className="text-sm">5% increase from yesterday</p>
              </div>
              <div className="bg-yellow-500 text-white rounded-lg p-4 h-full shadow">
                <h5 className="text-lg font-semibold">AI Interactions</h5>
                <h2 className="text-3xl my-2">8,732</h2>
                <p className="text-sm">18% increase from last week</p>
              </div>
            </div>
          )}

          {/* Client Table */}
          {activeTab == "Client" && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {/* Search and filters */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                  <h3 className="text-xl font-semibold">Client List</h3>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search clients..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      <FaSearch className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Table */}
              <div className="overflow-x-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
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
                                  Website <FaExternalLinkAlt className="ml-1 text-xs" />
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
                          <td className="px-6 py-6 text-sm font-medium flex">
                              <button 
                                onClick={() => openClientLogin(client._id, client.email, client.name)} 
                                className="text-red-500 hover:text-red-700" 
                                title="clientlogin"
                              >
                                login
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
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
