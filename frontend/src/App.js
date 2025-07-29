// frontend/src/App.js
// Updated to include the new QuoteComparison and ManageVendors pages

import React, { useState } from 'react';
import './App.css';

// Import existing components
import Dashboard from './components/dashboard/Dashboard';
import ProjectDashboard from './components/projects/ProjectDashboard';
import LoadingCard from './components/shared/LoadingCard';
import ErrorCard from './components/shared/ErrorCard';

// Import your new components
import QuoteComparison from './components/projects/QuoteComparison';
import ManageVendors from './components/vendors/ManageVendors';
import CreateProject from './components/projects/CreateProject';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [navigationState, setNavigationState] = useState({
    selectedProjectId: null,
    selectedCategoryId: null,
    previousView: null
  });

  // Navigate from dashboard to detailed project view
  const handleProjectClick = (projectId) => {
    setNavigationState({
      selectedProjectId: projectId,
      selectedCategoryId: null,
      previousView: 'dashboard'
    });
    setCurrentView('project');
  };

  // Navigate to quote comparison page
  const handleQuoteComparisonClick = (categoryId) => {
    setNavigationState(prevState => ({
      ...prevState,
      selectedCategoryId: categoryId,
      previousView: 'project'
    }));
    setCurrentView('quote-comparison');
  };

  // Navigate to vendor management page
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
  // Handle back navigation
  const handleBackNavigation = () => {
    const { previousView } = navigationState;
    
    switch (currentView) {
      case 'project':
        setCurrentView('dashboard');
        setNavigationState({
          selectedProjectId: null,
          selectedCategoryId: null,
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
        setCurrentView('dashboard');
        setNavigationState({
          selectedProjectId: null,
          selectedCategoryId: null,
          previousView: null
        });
        break;
        
      default:
        setCurrentView('dashboard');
        break;
    }
  };

  // Render the current view based on navigation state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            onProjectClick={handleProjectClick}
            onCreateProjectClick={handleCreateProjectClick}
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
            onProjectCreated={(newProject) => {
              // Optional: You can add logic here to navigate to the new project
              console.log('New project created:', newProject);
              // For example: handleProjectClick(newProject.id);
            }}
          />
        );

      default:
        console.warn(`Unknown view: ${currentView}, falling back to dashboard`);
        setCurrentView('dashboard');
        return (
          <Dashboard 
            onProjectClick={handleProjectClick}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {renderCurrentView()}
    </div>
  );
}

export default App;