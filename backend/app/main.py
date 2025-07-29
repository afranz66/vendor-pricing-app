from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any
from app.services.data_service import DataService
from datetime import datetime

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

@app.get("/api/categories/{category_id}/quotes", response_model=Dict[str, Any])
async def get_category_quotes(category_id: int):
    """
    Get detailed quote comparison data for a specific category.
    This supports the Quote Comparison page with enriched vendor and bid information.
    """
    try:
        category = data_service.get_category_by_id(category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        # Get enriched vendor data with bid details
        vendors_with_bids = data_service.get_enriched_vendors_for_category(category_id)
        
        # Calculate competition metrics
        submitted_bids = [v for v in vendors_with_bids if v.get('bidStatus') == 'submitted']
        best_quote = min([v['bidAmount'] for v in submitted_bids], default=0) if submitted_bids else None
        
        return {
            "category": category,
            "vendors": vendors_with_bids,
            "analytics": {
                "totalVendors": len(vendors_with_bids),
                "submittedQuotes": len(submitted_bids),
                "bestQuote": best_quote,
                "averageQuote": sum([v['bidAmount'] for v in submitted_bids]) / len(submitted_bids) if submitted_bids else 0,
                "competitionLevel": "High" if len(submitted_bids) >= 3 else "Low" if len(submitted_bids) > 0 else "None"
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving category quotes: {str(e)}")

@app.get("/api/categories/{category_id}/vendor-management", response_model=Dict[str, Any])
async def get_vendor_management_data(category_id: int):
    """
    Get comprehensive vendor management data for a specific category.
    This supports the Manage Vendors page with vendor relationships and communication history.
    """
    try:
        category = data_service.get_category_by_id(category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        # Get all vendors for this category with enriched data
        vendors = data_service.get_enriched_vendors_for_category(category_id)
        
        # Calculate vendor statistics
        vendor_stats = {
            "totalVendors": len(vendors),
            "quotesReceived": len([v for v in vendors if v.get('bidStatus') == 'submitted']),
            "pendingQuotes": len([v for v in vendors if v.get('bidStatus') == 'pending']),
            "invitedVendors": len([v for v in vendors if v.get('bidStatus') == 'invited']),
            "declinedVendors": len([v for v in vendors if v.get('bidStatus') == 'declined'])
        }
        
        return {
            "category": category,
            "vendors": vendors,
            "statistics": vendor_stats
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving vendor management data: {str(e)}")

@app.post("/api/categories/{category_id}/vendors/{vendor_id}/invite")
async def send_vendor_invite(category_id: int, vendor_id: int):
    """
    Send a quote invitation to a specific vendor for a category.
    This supports the vendor management invitation functionality.
    """
    try:
        # In a real implementation, this would:
        # 1. Update the vendor's bid status to 'invited'
        # 2. Send an email invitation
        # 3. Log the communication
        
        # For now, we'll just return a success response
        # You can implement the actual logic in your data_service
        
        return {
            "success": True,
            "message": f"Invitation sent to vendor {vendor_id} for category {category_id}",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending vendor invite: {str(e)}")

@app.post("/api/categories/{category_id}/vendors/bulk-invite")
async def send_bulk_vendor_invites(category_id: int, vendor_ids: List[int]):
    """
    Send quote invitations to multiple vendors at once.
    This supports the bulk actions in vendor management.
    """
    try:
        results = []
        for vendor_id in vendor_ids:
            # In a real implementation, send individual invites
            results.append({
                "vendorId": vendor_id,
                "status": "sent",
                "timestamp": datetime.now().isoformat()
            })
        
        return {
            "success": True,
            "message": f"Bulk invitations sent to {len(vendor_ids)} vendors",
            "results": results
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending bulk invites: {str(e)}")

@app.put("/api/categories/{category_id}/vendors/{vendor_id}")
async def update_vendor_details(category_id: int, vendor_id: int, vendor_data: Dict[str, Any]):
    """
    Update vendor information for a specific category.
    This supports the vendor profile editing functionality.
    """
    try:
        # In a real implementation, this would update the vendor data
        # in your data service and validate the input
        
        return {
            "success": True,
            "message": f"Vendor {vendor_id} updated successfully",
            "updatedData": vendor_data,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating vendor: {str(e)}")

@app.post("/api/categories/{category_id}/vendors/{vendor_id}/select-quote")
async def select_vendor_quote(category_id: int, vendor_id: int):
    """
    Select a vendor's quote as the winning bid.
    This supports the quote selection functionality.
    """
    try:
        # In a real implementation, this would:
        # 1. Update the vendor's status to 'selected'
        # 2. Update other vendors' status to 'not_selected'
        # 3. Log the selection decision
        # 4. Possibly send notifications
        
        return {
            "success": True,
            "message": f"Quote selected for vendor {vendor_id} in category {category_id}",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error selecting quote: {str(e)}")

@app.post("/api/categories/{category_id}/vendors/{vendor_id}/contact")
async def contact_vendor(category_id: int, vendor_id: int, message: str):
    """
    Send a message to a vendor.
    This supports the vendor communication functionality.
    """
    try:
        # In a real implementation, this would:
        # 1. Send an email to the vendor
        # 2. Log the communication
        # 3. Update the last contact date
        
        return {
            "success": True,
            "message": f"Message sent to vendor {vendor_id}",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error contacting vendor: {str(e)}")
# You can test your API by running: uvicorn app.main:app --reload
# Then visit http://localhost:8000/docs to see the interactive API documentation