// src/App.js
// Main application coordinator that manages navigation and component communication

import React, { useState } from 'react';
import './App.css';

// Import components from organized directory structure
import Dashboard from './components/dashboard/Dashboard';
import ProjectDashboard from './components/projects/ProjectDashboard';
import CategoryComparison from './components/projects/CategoryComparison';
import VendorManagement from './components/vendors/VendorManagement';
import LoadingCard from './components/shared/LoadingCard';
import ErrorCard from './components/shared/ErrorCard';

function App() {
  // Navigation state management - this controls which view is currently active
  // Think of this as the application's "location" within your interface
  const [currentView, setCurrentView] = useState('dashboard');
  const [navigationState, setNavigationState] = useState({
    selectedProjectId: null,
    selectedCategoryId: null,
    previousView: null
  });

  /**
   * Navigation functions that handle transitions between different parts of your application
   * These functions update both the current view and maintain navigation state
   */

  // Navigate from dashboard to detailed project view
  const handleProjectClick = (projectId) => {
    setNavigationState({
      selectedProjectId: projectId,
      selectedCategoryId: null,
      previousView: 'dashboard'
    });
    setCurrentView('project');
  };

  // Navigate from project view to category comparison
  const handleCategoryClick = (categoryId) => {
    setNavigationState(prevState => ({
      ...prevState,
      selectedCategoryId: categoryId,
      previousView: 'project'
    }));
    setCurrentView('category');
  };

  // Navigate from project view to vendor management
  const handleVendorManagementClick = (categoryId) => {
    setNavigationState(prevState => ({
      ...prevState,
      selectedCategoryId: categoryId,
      previousView: 'project'
    }));
    setCurrentView('vendor-management');
  };

  // Navigate to the vendor catalog (owner rep functionality)
  const handleVendorCatalogClick = () => {
    setNavigationState(prevState => ({
      ...prevState,
      previousView: currentView
    }));
    setCurrentView('vendor-catalog');
  };

  // Handle back navigation - this maintains proper navigation context
  const handleBackNavigation = () => {
    const { previousView } = navigationState;
    
    switch (currentView) {
      case 'project':
        // Going back to dashboard clears project selection
        setCurrentView('dashboard');
        setNavigationState({
          selectedProjectId: null,
          selectedCategoryId: null,
          previousView: null
        });
        break;
        
      case 'category':
      case 'vendor-management':
        // Going back to project view maintains project context
        setCurrentView('project');
        setNavigationState(prevState => ({
          ...prevState,
          selectedCategoryId: null,
          previousView: 'dashboard'
        }));
        break;
        
      case 'vendor-catalog':
        // Return to whatever view initiated vendor catalog access
        setCurrentView(previousView || 'dashboard');
        break;
        
      default:
        // Default back navigation goes to dashboard
        setCurrentView('dashboard');
        setNavigationState({
          selectedProjectId: null,
          selectedCategoryId: null,
          previousView: null
        });
    }
  };

  /**
   * View rendering logic - this determines which component to display based on current navigation state
   * Each case passes the appropriate props and event handlers to create seamless component communication
   */
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            onProjectClick={handleProjectClick}
            onVendorCatalogClick={handleVendorCatalogClick}
          />
        );

      case 'project':
        // Only render if we have a selected project
        if (!navigationState.selectedProjectId) {
          return (
            <ErrorCard 
              title="No Project Selected"
              message="Please select a project from the dashboard to view details."
              onRetry={() => setCurrentView('dashboard')}
              retryText="Back to Dashboard"
            />
          );
        }
        
        return (
          <ProjectDashboard
            projectId={navigationState.selectedProjectId}
            onCategoryClick={handleCategoryClick}
            onVendorManagementClick={handleVendorManagementClick}
            onBack={handleBackNavigation}
          />
        );

      case 'category':
        // Only render if we have both project and category selected
        if (!navigationState.selectedProjectId || !navigationState.selectedCategoryId) {
          return (
            <ErrorCard 
              title="No Category Selected"
              message="Please select a category from the project view to compare vendors."
              onRetry={handleBackNavigation}
              retryText="Back to Project"
            />
          );
        }
        
        return (
          <CategoryComparison
            projectId={navigationState.selectedProjectId}
            categoryId={navigationState.selectedCategoryId}
            onBack={handleBackNavigation}
          />
        );

      case 'vendor-management':
        // Vendor management needs category context for project-specific vendor operations
        if (!navigationState.selectedCategoryId) {
          return (
            <ErrorCard 
              title="No Category Context"
              message="Vendor management requires a category context from a specific project."
              onRetry={handleBackNavigation}
              retryText="Back to Project"
            />
          );
        }
        
        return (
          <VendorManagement
            categoryId={navigationState.selectedCategoryId}
            projectId={navigationState.selectedProjectId}
            onBack={handleBackNavigation}
          />
        );

      case 'vendor-catalog':
        // Owner rep vendor catalog management - independent of project context
        return (
          <VendorManagement
            mode="catalog" // Special mode for owner rep vendor catalog management
            onBack={handleBackNavigation}
          />
        );

      default:
        // Fallback to dashboard if navigation state becomes invalid
        console.warn(`Unknown view: ${currentView}, falling back to dashboard`);
        setCurrentView('dashboard');
        return (
          <Dashboard 
            onProjectClick={handleProjectClick}
            onVendorCatalogClick={handleVendorCatalogClick}
          />
        );
    }
  };

  // Main render - this provides the consistent application shell
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {/* Application-wide navigation header could go here */}
      {/* For now, navigation is handled within individual components */}
      
      {/* Render the current view based on navigation state */}
      {renderCurrentView()}
      
      {/* Application-wide footer or status bar could go here */}
    </div>
  );
}

export default App;