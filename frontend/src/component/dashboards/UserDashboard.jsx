import React, { useState, useEffect } from 'react';
import {
  FaChartBar,
  FaUser,
  FaComments,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaBell,
  FaHistory,
  FaQuestionCircle
} from 'react-icons/fa';
import { API_BASE_URL } from '../../config';

const UserDashboard = ({ user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isMobile, setIsMobile] = useState(false);

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

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const navItems = [
    { name: "Overview", icon: <FaChartBar /> },
    { name: "Profile", icon: <FaUser /> },
    { name: "Messages", icon: <FaComments /> },
    { name: "Notifications", icon: <FaBell /> },
    { name: "History", icon: <FaHistory /> },
    { name: "Help", icon: <FaQuestionCircle /> },
    { name: "Settings", icon: <FaCog />, subItems: ["Log out"] },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40"
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
            <h4 className="m-0 font-semibold text-lg">User Panel</h4>
          )}
          <button
            className="text-black hover:text-gray-700 focus:outline-none"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
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

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-20"
        }`}
      >
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Welcome, {user.name}</h1>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <div className="bg-white rounded-lg shadow-md p-6 mt-4">
            <h2 className="text-2xl font-bold mb-4">{activeTab}</h2>
            
            {activeTab === "Overview" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-lg mb-2">Profile</h3>
                  <p>View and edit your profile information</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-lg mb-2">Messages</h3>
                  <p>Check your messages and notifications</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-bold text-lg mb-2">Settings</h3>
                  <p>Manage your account settings</p>
                </div>
              </div>
            )}

            {activeTab === "Profile" && (
              <div className="space-y-4">
                <p>Profile content will go here</p>
              </div>
            )}

            {activeTab === "Messages" && (
              <div className="space-y-4">
                <p>Messages content will go here</p>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="space-y-4">
                <p>Notifications content will go here</p>
              </div>
            )}

            {activeTab === "History" && (
              <div className="space-y-4">
                <p>History content will go here</p>
              </div>
            )}

            {activeTab === "Help" && (
              <div className="space-y-4">
                <p>Help content will go here</p>
              </div>
            )}

            {activeTab === "Settings" && (
              <div className="space-y-4">
                <p>Settings content will go here</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard; 