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
    
@app.post("/api/projects", response_model=Dict[str, Any])
async def create_project(project_data: Dict[str, Any]):
    """
    Create a new project and add it to the system.
    This is the main endpoint for adding new projects.
    
    Expected data:
    {
        "name": "Project Name",
        "client": "Client Company",
        "startDate": "2025-06-01",
        "bidDeadline": "2025-08-15", 
        "estimatedValue": 2500000,
        "status": "early",
        "description": "Project description",
        "address": "123 Main St",
        "city": "Metro City",
        "state": "NY",
        "zipCode": "10001",
        "clientContactName": "John Doe",
        "clientContactEmail": "john@company.com",
        "clientContactPhone": "(555) 123-4567"
    }
    """
    try:
        # Validate required fields
        required_fields = ["name", "client"]
        missing_fields = [field for field in required_fields if not project_data.get(field)]
        
        if missing_fields:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        # Validate estimated value is a number
        estimated_value = project_data.get("estimatedValue", 0)
        try:
            project_data["estimatedValue"] = float(estimated_value) if estimated_value else 0
        except (ValueError, TypeError):
            raise HTTPException(status_code=400, detail="estimatedValue must be a valid number")
        
        # Create the project
        new_project = data_service.create_new_project(project_data)
        
        return {
            "success": True,
            "message": "Project created successfully",
            "project": new_project,
            "timestamp": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating project: {str(e)}")

@app.put("/api/projects/{project_id}", response_model=Dict[str, Any])
async def update_project(project_id: int, updates: Dict[str, Any]):
    """
    Update an existing project's information.
    This allows editing project details after creation.
    """
    try:
        # Validate estimated value if provided
        if "estimatedValue" in updates:
            try:
                updates["estimatedValue"] = float(updates["estimatedValue"]) if updates["estimatedValue"] else 0
            except (ValueError, TypeError):
                raise HTTPException(status_code=400, detail="estimatedValue must be a valid number")
        
        success = data_service.update_project(project_id, updates)
        
        if not success:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return {
            "success": True,
            "message": f"Project {project_id} updated successfully",
            "timestamp": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating project: {str(e)}")

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: int):
    """
    Delete a project and all its associated data.
    This removes the project entirely from the system.
    """
    try:
        success = data_service.delete_project(project_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Project not found")
        
        return {
            "success": True,
            "message": f"Project {project_id} deleted successfully",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting project: {str(e)}")

@app.post("/api/projects/{project_id}/categories", response_model=Dict[str, Any])
async def add_category_to_project(project_id: int, category_data: Dict[str, Any]):
    """
    Add a new category to an existing project.
    This builds out the project structure after creation.
    
    Expected data:
    {
        "name": "Category Name",
        "description": "Category description", 
        "totalItems": 10,
        "specifications": "Technical specifications",
        "estimatedValue": 150000,
        "deadlineDate": "2025-02-01"
    }
    """
    try:
        # Validate required fields
        if not category_data.get("name"):
            raise HTTPException(status_code=400, detail="Category name is required")
        
        # Validate numeric fields
        for field in ["totalItems", "estimatedValue"]:
            if field in category_data:
                try:
                    category_data[field] = float(category_data[field]) if category_data[field] else 0
                except (ValueError, TypeError):
                    raise HTTPException(status_code=400, detail=f"{field} must be a valid number")
        
        new_category = data_service.add_category_to_project(project_id, category_data)
        
        return {
            "success": True,
            "message": "Category added successfully",
            "category": new_category,
            "timestamp": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding category: {str(e)}")

@app.get("/api/project-templates", response_model=List[Dict[str, Any]])
async def get_project_templates():
    """
    Get common project templates to speed up project creation.
    This provides pre-filled templates for common project types.
    """
    try:
        templates = data_service.get_project_templates()
        return templates
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving templates: {str(e)}")

@app.post("/api/projects/from-template", response_model=Dict[str, Any])
async def create_project_from_template(request_data: Dict[str, Any]):
    """
    Create a new project using a template and custom data.
    This speeds up project creation by starting with a template.
    
    Expected data:
    {
        "templateName": "Office Building",
        "projectData": {
            "name": "Downtown Office Complex",
            "client": "Metro Development", 
            // ... other project fields
        },
        "includeCategories": true
    }
    """
    try:
        template_name = request_data.get("templateName")
        project_data = request_data.get("projectData", {})
        include_categories = request_data.get("includeCategories", False)
        
        if not template_name:
            raise HTTPException(status_code=400, detail="templateName is required")
        
        # Get template
        templates = data_service.get_project_templates()
        template = next((t for t in templates if t["name"] == template_name), None)
        
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        # Merge template data with provided data (provided data takes precedence)
        merged_data = {
            "description": template["description"],
            "estimatedValue": template["estimatedValue"],
            "status": template["status"],
            **project_data  # User data overrides template
        }
        
        # Validate required fields
        if not merged_data.get("name") or not merged_data.get("client"):
            raise HTTPException(status_code=400, detail="Project name and client are required")
        
        # Create the project
        new_project = data_service.create_new_project(merged_data)
        
        # Add template categories if requested
        created_categories = []
        if include_categories and template.get("commonCategories"):
            for category_template in template["commonCategories"]:
                try:
                    category = data_service.add_category_to_project(new_project["id"], category_template)
                    created_categories.append(category)
                except Exception as e:
                    print(f"Warning: Failed to create category {category_template['name']}: {e}")
        
        return {
            "success": True,
            "message": "Project created from template successfully",
            "project": new_project,
            "categories": created_categories,
            "template_used": template_name,
            "timestamp": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating project from template: {str(e)}")

# Simple test endpoint for project creation
@app.post("/api/test-create-project")
async def test_create_project():
    """
    Test endpoint to verify project creation works.
    Creates a sample project for testing.
    """
    try:
        test_project_data = {
            "name": "Test Project " + datetime.now().strftime("%H:%M:%S"),
            "client": "Test Client Corp",
            "startDate": "2025-08-01",
            "bidDeadline": "2025-09-15",
            "estimatedValue": 1000000,
            "status": "early",
            "description": "Test project created via API",
            "address": "123 Test St",
            "city": "Test City",
            "state": "TX",
            "zipCode": "12345",
            "clientContactName": "Test Contact",
            "clientContactEmail": "test@testclient.com",
            "clientContactPhone": "(555) 123-4567"
        }
        
        new_project = data_service.create_new_project(test_project_data)
        
        return {
            "success": True,
            "message": "Test project created successfully",
            "project": new_project,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }    

@app.post("/api/vendors", response_model=Dict[str, Any])
async def create_vendor(vendor_data: Dict[str, Any]):
    """
    Create a new vendor and add it to the catalog.
    This is the main endpoint for adding new vendors.
    
    Expected data:
    {
        "companyName": "SteelCorp",
        "contactInfo": {
            "representative": "Sarah Johnson",
            "email": "sarah.johnson@steelcorp.com",
            "phone": "(555) 123-4567",
            "website": "https://steelcorp.com"
        },
        "specialties": ["Structural Steel", "Custom Fabrication"],
        "address": {
            "street": "1234 Industrial Blvd",
            "city": "Pittsburgh",
            "state": "PA",
            "zipCode": "15201"
        },
        "notes": "Reliable delivery schedules, excellent communication"
    }
    """
    try:
        # Validate required fields
        required_fields = ["companyName"]
        missing_fields = [field for field in required_fields if not vendor_data.get(field)]
        
        if missing_fields:
            raise HTTPException(
                status_code=400, 
                detail=f"Missing required fields: {', '.join(missing_fields)}"
            )
        
        # Validate contact info structure
        contact_info = vendor_data.get("contactInfo", {})
        required_contact_fields = ["representative", "email", "phone"]
        missing_contact_fields = [field for field in required_contact_fields if not contact_info.get(field)]
        
        if missing_contact_fields:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required contact info: {', '.join(missing_contact_fields)}"
            )
        
        # Validate address structure
        address = vendor_data.get("address", {})
        required_address_fields = ["city", "state"]
        missing_address_fields = [field for field in required_address_fields if not address.get(field)]
        
        if missing_address_fields:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required address info: {', '.join(missing_address_fields)}"
            )
        
        # Validate specialties
        specialties = vendor_data.get("specialties", [])
        if not specialties or len(specialties) == 0:
            raise HTTPException(
                status_code=400,
                detail="At least one specialty is required"
            )
        
        # Create the vendor
        new_vendor = data_service.add_vendor(vendor_data)
        
        return {
            "success": True,
            "message": "Vendor created successfully",
            "vendor": new_vendor,
            "timestamp": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating vendor: {str(e)}")

@app.put("/api/vendors/{vendor_id}", response_model=Dict[str, Any])
async def update_vendor(vendor_id: int, updates: Dict[str, Any]):
    """
    Update an existing vendor's information.
    This allows editing vendor details after creation.
    """
    try:
        # In a real implementation, this would update the vendor data
        # using data_service.update_vendor(vendor_id, updates)
        
        return {
            "success": True,
            "message": f"Vendor {vendor_id} updated successfully",
            "updatedData": updates,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating vendor: {str(e)}")
    
@app.get("/api/groups")
async def get_groups():
    """
    Get all project groups with their metadata
    """
    try:
        data = data_service._read_data()
        groups = data.get("groups", [])
        
        # Enrich groups with calculated metrics from their projects
        enriched_groups = []
        projects = data.get("projects", [])
        
        for group in groups:
            # Calculate actual metrics from projects in this group
            group_projects = [p for p in projects if p.get("groupId") == group["id"]]
            
            # Update group with current project metrics
            enriched_group = group.copy()
            enriched_group["actualProjectCount"] = len(group_projects)
            enriched_group["actualTotalValue"] = sum(p.get("estimatedValue", 0) for p in group_projects)
            enriched_group["activeProjects"] = len([p for p in group_projects if p.get("status") in ["active", "early"]])
            enriched_group["completedProjects"] = len([p for p in group_projects if p.get("status") == "complete"])
            
            enriched_groups.append(enriched_group)
        
        return enriched_groups
        
    except Exception as e:
        print(f"Error fetching groups: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching groups: {str(e)}")

@app.get("/api/groups/{group_id}")
async def get_group(group_id: int):
    """
    Get a specific group by ID with its projects
    """
    try:
        data = data_service._read_data()
        groups = data.get("groups", [])
        projects = data.get("projects", [])
        
        # Find the specific group
        group = next((g for g in groups if g["id"] == group_id), None)
        if not group:
            raise HTTPException(status_code=404, detail=f"Group with id {group_id} not found")
        
        # Get projects in this group
        group_projects = [p for p in projects if p.get("groupId") == group_id]
        
        # Enrich group with current metrics
        enriched_group = group.copy()
        enriched_group["actualProjectCount"] = len(group_projects)
        enriched_group["actualTotalValue"] = sum(p.get("estimatedValue", 0) for p in group_projects)
        enriched_group["activeProjects"] = len([p for p in group_projects if p.get("status") in ["active", "early"]])
        enriched_group["completedProjects"] = len([p for p in group_projects if p.get("status") == "complete"])
        enriched_group["projects"] = group_projects
        
        return enriched_group
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching group {group_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching group: {str(e)}")
# You can test your API by running: uvicorn app.main:app --reload
# Then visit http://localhost:8000/docs to see the interactive API documentation