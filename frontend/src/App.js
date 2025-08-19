// src/App.js - Complete integration with Holy Grail Layout
import React, { useState } from 'react';
import { 
  Home, 
  FolderOpen, 
  Users, 
  Settings, 
  FileText,
  Bell,
  Search,
  Menu,
  X,
  Plus,
  BarChart3,
  Building
} from 'lucide-react';
import './App.css';

// Import all your existing components
import Dashboard from './components/dashboard/Dashboard';
import ProjectDashboard from './components/projects/ProjectDashboard';
import QuoteComparison from './components/projects/QuoteComparison';
import ManageVendors from './components/vendors/ManageVendors';
import VendorCatalog from './components/vendors/VendorCatalog';
import CreateVendor from './components/vendors/CreateVendor';
import CreateProject from './components/projects/CreateProject';
import GCDetailsPage from './components/contractors/GCDetailsPage';
import GroupDashboard from './components/dashboard/GroupDashboard';
import LoadingCard from './components/shared/LoadingCard';
import ErrorCard from './components/shared/ErrorCard';

// Import your hooks
import { useProjects } from './hooks/useApi';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navigationState, setNavigationState] = useState({
    selectedProjectId: null,
    selectedCategoryId: null,
    selectedProject: null,
    selectedGroup: null,
    previousView: null
  });

  // Get projects data for activity feed
  const { projects } = useProjects();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'projects', label: 'All Projects', icon: FolderOpen },
    { id: 'vendors', label: 'Vendors', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Your existing navigation functions
  const handleProjectClick = (projectId) => {
    setNavigationState({
      selectedProjectId: projectId,
      selectedCategoryId: null,
      selectedProject: null,
      previousView: currentView === 'projects' ? 'projects' : 'dashboard'
    });
    setCurrentView('project');
    setSidebarOpen(false);
  };

  const handleQuoteComparisonClick = (categoryId) => {
    setNavigationState(prevState => ({
      ...prevState,
      selectedCategoryId: categoryId,
      previousView: 'project'
    }));
    setCurrentView('quote-comparison');
  };

  const handleVendorManagementClick = (categoryId) => {
    setNavigationState(prevState => ({
      ...prevState,
      selectedCategoryId: categoryId,
      previousView: 'project'
    }));
    setCurrentView('vendor-management');
  };

  const handleCreateProjectClick = () => {
    setNavigationState(prevState => ({
      ...prevState,
      previousView: currentView
    }));
    setCurrentView('create-project');
  };

  const handleCreateVendorClick = () => {
    setNavigationState(prevState => ({
      ...prevState,
      previousView: currentView
    }));
    setCurrentView('create-vendor');
  };

  const handleGCClick = (project) => {
    setNavigationState(prevState => ({
      ...prevState,
      selectedProject: project,
      previousView: currentView
    }));
    setCurrentView('gc-details');
    setSidebarOpen(false);
  };

  const handleGroupClick = (group) => {
    setNavigationState(prevState => ({
      ...prevState,
      selectedGroup: group,
      previousView: currentView
    }));
    setCurrentView('group-dashboard');
    setSidebarOpen(false);
  };

  const handleBackNavigation = () => {
    const { previousView } = navigationState;
    
    switch (currentView) {
      case 'project':
        setCurrentView(previousView || 'dashboard');
        setNavigationState({
          selectedProjectId: null,
          selectedCategoryId: null,
          selectedProject: null,
          selectedGroup: null,
          previousView: null
        });
        break;
      case 'quote-comparison':
      case 'vendor-management':
        setCurrentView('project');
        setNavigationState(prevState => ({
          ...prevState,
          selectedCategoryId: null,
          previousView: 'dashboard'
        }));
        break;
      case 'create-project':
        setCurrentView(previousView || 'dashboard');
        setNavigationState(prevState => ({
          ...prevState,
          selectedProject: null,
          selectedGroup: null,
          previousView: null
        }));
        break;
      case 'create-vendor':
        setCurrentView(previousView || 'vendors');
        setNavigationState(prevState => ({
          ...prevState,
          selectedProject: null,
          selectedGroup: null,
          previousView: null
        }));
        break;
      case 'gc-details':
        setCurrentView(previousView || 'dashboard');
        setNavigationState(prevState => ({
          ...prevState,
          selectedProject: null,
          previousView: null
        }));
        break;
      case 'group-dashboard':
        setCurrentView(previousView || 'dashboard');
        setNavigationState(prevState => ({
          ...prevState,
          selectedGroup: null,
          previousView: null
        }));
        break;
      default:
        if (previousView) {
          setCurrentView(previousView);
        }
        setNavigationState(prevState => ({
          ...prevState,
          selectedProject: null,
          previousView: null
        }));
    }
  };

  const handleProjectCreated = (newProject) => {
    console.log('New project created:', newProject);
    // Navigate to the new project
    if (newProject && newProject.id) {
      handleProjectClick(newProject.id);
    } else {
      // Fallback to dashboard
      setCurrentView('dashboard');
      setNavigationState({
        selectedProjectId: null,
        selectedCategoryId: null,
        selectedProject: null,
        selectedGroup: null,
        previousView: null
      });
    }
  };

  const handleVendorCreated = (newVendor) => {
    console.log('New vendor created:', newVendor);
    // Navigate back to vendor catalog
    setCurrentView('vendors');
    setNavigationState({
      selectedProjectId: null,
      selectedCategoryId: null,
      selectedProject: null,
      selectedGroup: null,
      previousView: null
    });
  };

  const renderMainContent = () => {
    switch(currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            onProjectClick={handleProjectClick}
            onCreateProjectClick={handleCreateProjectClick}
            onGCClick={handleGCClick}
            onGroupClick={handleGroupClick}
          />
        );
      
      case 'project':
        return (
          <ProjectDashboard
            projectId={navigationState.selectedProjectId}
            onBack={handleBackNavigation}
            onQuoteComparisonClick={handleQuoteComparisonClick}
            onVendorManagementClick={handleVendorManagementClick}
          />
        );
      
      case 'quote-comparison':
        return (
          <QuoteComparison
            categoryId={navigationState.selectedCategoryId}
            projectId={navigationState.selectedProjectId}
            onBack={handleBackNavigation}
          />
        );

      case 'vendor-management':
        return (
          <ManageVendors
            categoryId={navigationState.selectedCategoryId}
            projectId={navigationState.selectedProjectId}
            onBack={handleBackNavigation}
          />
        );
      
      case 'create-project':
        return (
          <CreateProject
            onBack={handleBackNavigation}
            onProjectCreated={handleProjectCreated}
          />
        );

      case 'create-vendor':
        return (
          <CreateVendor
            onBack={handleBackNavigation}
            onVendorCreated={handleVendorCreated}
          />
        );

      case 'gc-details':
        return (
          <GCDetailsPage
            project={navigationState.selectedProject}
            onBack={handleBackNavigation}
          />
        );

      case 'group-dashboard':
        return (
          <GroupDashboard
            group={navigationState.selectedGroup}
            onBack={handleBackNavigation}
            onProjectClick={handleProjectClick}
            onGCClick={handleGCClick}
          />
        );

      case 'projects':
        return (
          <div className="max-w-7xl mx-auto p-8">
            <div className="mb-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-3">
                      All Projects
                    </h1>
                    <p className="text-lg text-slate-600 font-medium">
                      Complete overview of all construction projects
                    </p>
                  </div>
                  <button
                    onClick={handleCreateProjectClick} 
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Plus size={24} />
                    New Project
                  </button>
                </div>
              </div>
            </div>
            <Dashboard 
              onProjectClick={handleProjectClick}
              onCreateProjectClick={handleCreateProjectClick}
              onGCClick={handleGCClick}
              onGroupClick={handleGroupClick}
            />
          </div>
        );
      
      case 'vendors':
        return (
          <VendorCatalog
            onCreateVendor={handleCreateVendorClick}
            onViewVendor={(vendorId) => console.log('View vendor:', vendorId)}
            onEditVendor={(vendorId) => console.log('Edit vendor:', vendorId)}
          />
        );

      case 'reports':
        return (
          <div className="max-w-7xl mx-auto p-8">
            <div className="space-y-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-900 bg-clip-text text-transparent mb-4">
                  Reports & Analytics
                </h2>
                <p className="text-slate-600">Generate detailed reports on project performance, vendor relationships, and bidding analytics.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Project Performance</h3>
                  <p className="text-slate-600">Track completion rates, budget performance, and timeline adherence across all projects.</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Vendor Analytics</h3>
                  <p className="text-slate-600">Analyze vendor performance, bid competitiveness, and relationship strength.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="max-w-7xl mx-auto p-8">
            <div className="space-y-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-900 bg-clip-text text-transparent mb-4">
                  Settings
                </h2>
                <p className="text-slate-600">Configure your application preferences and account settings.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Application Settings</h3>
                <p className="text-slate-600">Settings interface will be implemented here...</p>
              </div>
            </div>
          </div>
        );
      
      default:
        console.warn(`Unknown view: ${currentView}, falling back to dashboard`);
        setCurrentView('dashboard');
        return (
          <Dashboard 
            onProjectClick={handleProjectClick}
            onCreateProjectClick={handleCreateProjectClick}
            onGCClick={handleGCClick}
            onGroupClick={handleGroupClick}
          />
        );
    }
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [];
    
    switch(currentView) {
      case 'dashboard':
        return [{ label: 'Dashboard', active: true }];
      case 'projects':
        return [{ label: 'All Projects', active: true }];
      case 'project':
        breadcrumbs.push(
          { label: 'Dashboard', onClick: () => setCurrentView('dashboard') },
          { label: 'Project Details', active: true }
        );
        break;
      case 'quote-comparison':
        breadcrumbs.push(
          { label: 'Dashboard', onClick: () => setCurrentView('dashboard') },
          { label: 'Project', onClick: handleBackNavigation },
          { label: 'Quote Comparison', active: true }
        );
        break;
      case 'vendor-management':
        breadcrumbs.push(
          { label: 'Dashboard', onClick: () => setCurrentView('dashboard') },
          { label: 'Project', onClick: handleBackNavigation },
          { label: 'Manage Vendors', active: true }
        );
        break;
      case 'create-project':
        breadcrumbs.push(
          { label: 'Dashboard', onClick: () => setCurrentView('dashboard') },
          { label: 'Create Project', active: true }
        );
        break;
      case 'create-vendor':
        breadcrumbs.push(
          { label: 'Vendors', onClick: () => setCurrentView('vendors') },
          { label: 'Add Vendor', active: true }
        );
        break;
      case 'gc-details':
        breadcrumbs.push(
          { label: 'Dashboard', onClick: () => setCurrentView('dashboard') },
          { label: 'Contractor Details', active: true }
        );
        break;
      case 'group-dashboard':
        breadcrumbs.push(
          { label: 'Dashboard', onClick: () => setCurrentView('dashboard') },
          { label: 'Project Collection', active: true }
        );
        break;
      default:
        return [{ label: currentView.charAt(0).toUpperCase() + currentView.slice(1), active: true }];
    }
    
    return breadcrumbs;
  };

  const getRecentActivity = () => {
    if (!projects || projects.length === 0) return [];
    
    const activities = [];
    
    // Generate some sample activities from your projects data
    projects.slice(0, 3).forEach(project => {
      if (project.status === 'active') {
        activities.push({
          type: 'bid_submitted',
          message: 'Bid submitted',
          project: project.name,
          time: '2 hours ago',
          color: 'emerald'
        });
      }
      
      if (project.bidDeadline) {
        const deadline = new Date(project.bidDeadline);
        const today = new Date();
        const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
        
        if (daysLeft <= 7 && daysLeft > 0) {
          activities.push({
            type: 'deadline_approaching',
            message: 'Deadline approaching',
            project: project.name,
            time: `${daysLeft} days left`,
            color: 'amber'
          });
        }
      }
    });
    
    return activities.slice(0, 4); // Limit to 4 most recent
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-4">
              <Building className="text-blue-600" size={32} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-900 bg-clip-text text-transparent">
                Vendor Management App
              </h1>
            </div>
            
            {/* Breadcrumb Navigation */}
            {getBreadcrumbs().length > 1 && (
              <nav className="hidden md:flex items-center text-sm text-slate-600">
                {getBreadcrumbs().map((crumb, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <span className="mx-2 text-slate-400">→</span>}
                    {crumb.active ? (
                      <span className="text-slate-800 font-medium">{crumb.label}</span>
                    ) : (
                      <button 
                        onClick={crumb.onClick}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {crumb.label}
                      </button>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2">
              <Search size={20} className="text-slate-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                className="bg-transparent outline-none text-slate-700 w-48"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors relative">
              <Bell size={24} className="text-slate-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body - Holy Grail Layout */}
      <div className="flex-1 flex">
        {/* Navigation Sidebar */}
        <nav className={`
          bg-white shadow-lg border-r border-slate-200 transition-all duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:static fixed inset-y-0 left-0 z-40
          w-64 lg:w-64
        `}>
          <div className="p-6">
            <ul className="space-y-2">
              {navigationItems.map(item => {
                const Icon = item.icon;
                const isActive = currentView === item.id || 
                  (item.id === 'dashboard' && ['project', 'quote-comparison', 'vendor-management', 'create-project', 'gc-details', 'group-dashboard'].includes(currentView));
                
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setCurrentView(item.id);
                        setSidebarOpen(false);
                        // Reset navigation state when switching main sections
                        if (['dashboard', 'projects', 'vendors', 'reports', 'settings'].includes(item.id)) {
                          setNavigationState({
                            selectedProjectId: null,
                            selectedCategoryId: null,
                            selectedProject: null,
                            selectedGroup: null,
                            previousView: null
                          });
                        }
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg' 
                          : 'text-slate-600 hover:bg-slate-100'
                        }
                      `}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            
            {/* Quick Actions */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleCreateProjectClick();
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-200"
                >
                  <Plus size={18} />
                  <span className="font-medium">New Project</span>
                </button>
                <button
                  onClick={() => {
                    handleCreateVendorClick();
                    setSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-all duration-200"
                >
                  <Plus size={18} />
                  <span className="font-medium">New Vendor</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
          {renderMainContent()}
        </main>

        {/* Right Sidebar (Aside) - Activity Feed */}
        <aside className="hidden xl:block w-80 bg-white shadow-lg border-l border-slate-200 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {getRecentActivity().map((activity, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                    <div className={`w-2 h-2 bg-${activity.color}-500 rounded-full`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{activity.message}</p>
                      <p className="text-xs text-slate-600">{activity.project}</p>
                      <p className="text-xs text-slate-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
                {getRecentActivity().length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-sm text-slate-500">No recent activity</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={handleCreateProjectClick}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:from-blue-100 hover:to-indigo-100 transition-all"
                >
                  <p className="text-sm font-medium text-slate-800">Create New Project</p>
                </button>
                <button 
                  onClick={handleCreateVendorClick}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100 hover:from-emerald-100 hover:to-teal-100 transition-all"
                >
                  <p className="text-sm font-medium text-slate-800">Add New Vendor</p>
                </button>
                <button 
                  onClick={() => setCurrentView('reports')}
                  className="w-full text-left px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100 hover:from-purple-100 hover:to-pink-100 transition-all"
                >
                  <p className="text-sm font-medium text-slate-800">View Reports</p>
                </button>
              </div>
            </div>

            {/* Project Quick Stats */}
            {projects && projects.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Portfolio Stats</h3>
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-lg border border-emerald-100">
                    <p className="text-2xl font-bold text-emerald-700">{projects.length}</p>
                    <p className="text-sm text-emerald-600">Total Projects</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-2xl font-bold text-blue-700">
                      {projects.filter(p => p.status === 'active').length}
                    </p>
                    <p className="text-sm text-blue-600">Active Projects</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100">
                    <p className="text-2xl font-bold text-purple-700">
                      ${(projects.reduce((sum, p) => sum + (p.estimatedValue || 0), 0) / 1000000).toFixed(1)}M
                    </p>
                    <p className="text-sm text-purple-600">Total Value</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default App;