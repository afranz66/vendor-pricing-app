from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from app.services.data_service import DataService

# Create the FastAPI application
app = FastAPI(
    title="Construction Management API",
    description="API for managing construction projects, vendors, and bidding processes",
    version="1.0.0"
)

# Configure CORS to allow your React frontend to communicate with this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize the data service
data_service = DataService()

@app.get("/")
async def root():
    """
    Simple health check endpoint to verify the API is running.
    This is like testing that your server can respond to requests.
    """
    return {"message": "Construction Management API is running"}

@app.get("/api/projects", response_model=List[Dict[str, Any]])
async def get_projects():
    """
    Get all projects with calculated metrics.
    This endpoint provides the data your React dashboard needs.
    """
    try:
        # Get all projects from storage
        projects = data_service.get_all_projects()
        
        # Enrich each project with calculated metrics
        enriched_projects = []
        for project in projects:
            # Get real-time metrics for this project
            metrics = data_service.calculate_project_metrics(project["id"])
            
            # Combine project data with calculated metrics
            enriched_project = {
                **project,  # Original project data
                "metrics": metrics  # Calculated metrics
            }
            enriched_projects.append(enriched_project)
        
        return enriched_projects
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving projects: {str(e)}")

@app.get("/api/projects/{project_id}", response_model=Dict[str, Any])
async def get_project(project_id: int):
    """
    Get a specific project with full details including categories and vendors.
    This endpoint supports your detailed project view.
    """
    try:
        # Get the project
        project = data_service.get_project_by_id(project_id)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Get categories for this project
        categories = data_service.get_categories_for_project(project_id)
        
        # Enrich categories with vendor information
        enriched_categories = []
        for category in categories:
            enriched_vendors = data_service.get_enriched_vendors_for_category(category["id"])
            enriched_category = {
                **category,
                "vendors": enriched_vendors  # Full vendor profiles with bid info
            }
            enriched_categories.append(enriched_category)
        
        # Calculate project metrics
        metrics = data_service.calculate_project_metrics(project_id)
        
        return {
            **project,
            "categories": enriched_categories,
            "metrics": metrics
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving project: {str(e)}")

@app.get("/api/vendors", response_model=List[Dict[str, Any]])
async def get_vendors():
    """
    Get all vendors from the catalog.
    This supports the owner rep vendor management functionality.
    """
    try:
        vendors = data_service.get_all_vendors()
        return vendors
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving vendors: {str(e)}")

@app.get("/api/categories/{category_id}/vendors", response_model=List[Dict[str, Any]])
async def get_category_vendors(category_id: int):
    """
    Get enriched vendor information for a specific category.
    This supports your category comparison view with contact information.
    """
    try:
        enriched_vendors = data_service.get_enriched_vendors_for_category(category_id)
        if not enriched_vendors:
            raise HTTPException(status_code=404, detail="Category not found or no vendors available")
        
        return enriched_vendors
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving category vendors: {str(e)}")

# You can test your API by running: uvicorn app.main:app --reload
# Then visit http://localhost:8000/docs to see the interactive API documentation