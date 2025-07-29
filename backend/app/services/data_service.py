import json
import os
from typing import List, Dict, Optional, Any
from datetime import datetime

class DataService:
    """
    A simple file-based data service that mimics database operations.
    This teaches the same patterns as database access but uses JSON file storage.
    """
    
    def __init__(self, data_file_path: str = "data/application_data.json"):
        """
        Initialize the data service with the path to your JSON data file.
        This is like establishing a database connection, but for file access.
        """
        self.data_file_path = data_file_path
        self._ensure_data_file_exists()
    
    def _ensure_data_file_exists(self):
        """
        Create the data file if it doesn't exist, with empty collections.
        This is like initializing a database with empty tables.
        """
        if not os.path.exists(self.data_file_path):
            # Create the directory if it doesn't exist
            os.makedirs(os.path.dirname(self.data_file_path), exist_ok=True)
            
            # Initialize with empty collections
            empty_data = {
                "vendors": [],
                "projects": [],
                "categories": [],
                "documents": []
            }
            self._write_data(empty_data)
    
    def _read_data(self) -> Dict[str, Any]:
        """
        Read the entire data file into memory.
        This is like executing a SELECT * query to get all data.
        """
        try:
            with open(self.data_file_path, 'r', encoding='utf-8') as file:
                return json.load(file)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            print(f"Error reading data file: {e}")
            # Return empty structure if file is corrupted or missing
            return {
                "vendors": [],
                "projects": [],
                "categories": [],
                "documents": []
            }
    
    def _write_data(self, data: Dict[str, Any]) -> bool:
        """
        Write the complete data structure back to the file.
        This is like committing a database transaction.
        """
        try:
            with open(self.data_file_path, 'w', encoding='utf-8') as file:
                json.dump(data, file, indent=2, ensure_ascii=False)
            return True
        except Exception as e:
            print(f"Error writing data file: {e}")
            return False
    
    # Project operations - these mimic database CRUD operations
    
    def get_all_projects(self) -> List[Dict[str, Any]]:
        """
        Retrieve all projects from storage.
        This is like SELECT * FROM projects;
        """
        data = self._read_data()
        return data.get("projects", [])
    
    def get_project_by_id(self, project_id: int) -> Optional[Dict[str, Any]]:
        """
        Find a specific project by ID.
        This is like SELECT * FROM projects WHERE id = project_id;
        """
        projects = self.get_all_projects()
        return next((project for project in projects if project["id"] == project_id), None)
    
    def add_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Add a new project to storage.
        This is like INSERT INTO projects VALUES (...);
        """
        data = self._read_data()
        
        # Generate a new ID (in a database, this would be auto-generated)
        existing_ids = [project["id"] for project in data["projects"]]
        new_id = max(existing_ids, default=0) + 1
        
        # Add metadata fields
        project_data["id"] = new_id
        project_data["createdDate"] = datetime.now().isoformat()
        project_data["lastUpdated"] = datetime.now().isoformat()
        
        # Add to the projects collection
        data["projects"].append(project_data)
        
        # Save back to file
        if self._write_data(data):
            return project_data
        else:
            raise Exception("Failed to save project data")
    
    # Vendor operations - these teach the same patterns as project operations
    
    def get_all_vendors(self) -> List[Dict[str, Any]]:
        """
        Retrieve all vendors from the vendor catalog.
        This supports the owner rep vendor management functionality.
        """
        data = self._read_data()
        return data.get("vendors", [])
    
    def get_vendor_by_id(self, vendor_id: int) -> Optional[Dict[str, Any]]:
        """
        Find a specific vendor by ID.
        This is used when projects need to display vendor contact information.
        """
        vendors = self.get_all_vendors()
        return next((vendor for vendor in vendors if vendor["id"] == vendor_id), None)
    
    def add_vendor(self, vendor_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Add a new vendor to the catalog.
        This allows owner reps to expand their vendor relationships.
        """
        data = self._read_data()
        
        # Generate new ID
        existing_ids = [vendor["id"] for vendor in data["vendors"]]
        new_id = max(existing_ids, default=100) + 1  # Start vendor IDs at 101
        
        # Add metadata
        vendor_data["id"] = new_id
        vendor_data["dateAdded"] = datetime.now().isoformat()
        vendor_data["lastUpdated"] = datetime.now().isoformat()
        
        # Add to vendors collection
        data["vendors"].append(vendor_data)
        
        if self._write_data(data):
            return vendor_data
        else:
            raise Exception("Failed to save vendor data")
    
    # Category operations - these handle the bidding and comparison functionality
    
    def get_categories_for_project(self, project_id: int) -> List[Dict[str, Any]]:
        """
        Get all categories that belong to a specific project.
        This supports the project dashboard category display.
        """
        data = self._read_data()
        categories = data.get("categories", [])
        return [category for category in categories if category["projectId"] == project_id]
    
    def get_category_by_id(self, category_id: int) -> Optional[Dict[str, Any]]:
        """
        Find a specific category by ID.
        This supports the detailed category comparison view.
        """
        data = self._read_data()
        categories = data.get("categories", [])
        return next((category for category in categories if category["id"] == category_id), None)
    
    # Relationship helper methods - these combine data from multiple collections
    # backend/app/services/data_service.py
    # Add this method or update your existing get_enriched_vendors_for_category method

    def get_enriched_vendors_for_category(self, category_id: int) -> List[Dict[str, Any]]:
        """
        Get vendor information enriched with bid details for a specific category.
        Maps your JSON structure to what the frontend expects.
        """
        data = self._read_data()
        
        # Find the category
        category = next((cat for cat in data.get("categories", []) if cat["id"] == category_id), None)
        if not category:
            return []
        
        # Get all vendors
        all_vendors = data.get("vendors", [])
        
        # Build enriched vendor list
        enriched_vendors = []
        
        for participation in category.get("vendorParticipation", []):
            vendor_id = participation["vendorId"]
            
            # Find the vendor details
            vendor = next((v for v in all_vendors if v["id"] == vendor_id), None)
            if not vendor:
                continue
                
            # Map your JSON structure to frontend expectations
            enriched_vendor = {
                # Basic vendor info - map companyName to name
                "id": vendor["id"],
                "name": vendor["companyName"],  # ← Map companyName to name
                
                # Flatten contact info
                "email": vendor["contactInfo"]["email"],
                "phone": vendor["contactInfo"]["phone"],
                "website": vendor["contactInfo"].get("website", ""),
                
                # Address - flatten or combine
                "address": f"{vendor['address']['street']}, {vendor['address']['city']}, {vendor['address']['state']} {vendor['address']['zipCode']}",
                
                # Bid information from vendorParticipation
                "bidAmount": participation["bidAmount"],
                "bidStatus": participation["bidStatus"],
                "bidDate": participation["bidDate"],
                "notes": participation.get("notes", ""),
                
                # Vendor details
                "specialties": vendor.get("specialties", []),
                "dateAdded": vendor.get("dateAdded"),
                "lastUpdated": vendor.get("lastUpdated"),
                
                # Add defaults for fields not in your JSON but expected by frontend
                "rating": 4.5,  # Default rating
                "completedProjects": 25,  # Default project count
                "deliveryTime": "4-6 weeks",  # Default delivery
                "warranty": "2 years",  # Default warranty
                "certifications": ["ISO 9001"],  # Default certifications
                
                # Timeline fields
                "inviteDate": participation.get("inviteDate", participation["bidDate"]),
                "lastContact": vendor.get("lastUpdated")
            }
            
            enriched_vendors.append(enriched_vendor)
        
        return enriched_vendors
    
    def calculate_project_metrics(self, project_id: int) -> Dict[str, Any]:
        """
        Calculate real-time project metrics from category data.
        This replaces manual percentage calculations with derived data.
        """
        categories = self.get_categories_for_project(project_id)
        
        if not categories:
            return {
                "totalMaterials": 0,
                "quotedMaterials": 0,
                "totalVendors": 0,
                "activeVendors": 0,
                "completionPercentage": 0
            }
        
        # Calculate totals from category data
        total_materials = sum(cat["totalItems"] for cat in categories)
        quoted_materials = sum(cat["quotedItems"] for cat in categories)
        
        # Count unique vendors across all categories
        all_vendor_ids = set()
        active_vendors = 0
        
        for category in categories:
            for participation in category.get("vendorParticipation", []):
                all_vendor_ids.add(participation["vendorId"])
                if participation["bidStatus"] == "submitted":
                    active_vendors += 1
        
        completion_percentage = round((quoted_materials / total_materials) * 100) if total_materials > 0 else 0
        
        return {
            "totalMaterials": total_materials,
            "quotedMaterials": quoted_materials,
            "totalVendors": len(all_vendor_ids),
            "activeVendors": active_vendors,
            "completionPercentage": completion_percentage
        }

    def create_new_project(self, project_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new project and add it to the JSON file.
        This is the core method for adding new projects to your system.
        """
        data = self._read_data()
        
        # Generate new project ID
        existing_ids = [project["id"] for project in data.get("projects", [])]
        new_id = max(existing_ids, default=0) + 1
        
        # Create the new project with all required fields
        new_project = {
            "id": new_id,
            "name": project_data.get("name", ""),
            "client": project_data.get("client", ""),
            "startDate": project_data.get("startDate", ""),
            "bidDeadline": project_data.get("bidDeadline", ""),
            "estimatedValue": project_data.get("estimatedValue", 0),
            "status": project_data.get("status", "early"),
            "description": project_data.get("description", ""),
            "location": {
                "address": project_data.get("address", ""),
                "city": project_data.get("city", ""),
                "state": project_data.get("state", ""),
                "zipCode": project_data.get("zipCode", "")
            },
            "clientContact": {
                "name": project_data.get("clientContactName", ""),
                "email": project_data.get("clientContactEmail", ""),
                "phone": project_data.get("clientContactPhone", "")
            },
            "documentIds": [],  # Start with empty documents
            "categoryIds": [],  # Start with empty categories
            "createdDate": datetime.now().strftime("%Y-%m-%d"),
            "lastUpdated": datetime.now().strftime("%Y-%m-%d")
        }
        
        # Add to projects array
        data.setdefault("projects", []).append(new_project)
        
        # Save to file
        if self._write_data(data):
            return new_project
        else:
            raise Exception("Failed to save new project")

    def update_project(self, project_id: int, updates: Dict[str, Any]) -> bool:
        """
        Update an existing project's information.
        This allows editing project details after creation.
        """
        data = self._read_data()
        
        projects = data.get("projects", [])
        project = next((p for p in projects if p["id"] == project_id), None)
        
        if not project:
            return False
        
        # Update basic fields
        updatable_fields = [
            "name", "client", "startDate", "bidDeadline", 
            "estimatedValue", "status", "description"
        ]
        
        for field in updatable_fields:
            if field in updates:
                project[field] = updates[field]
        
        # Update location if provided
        if any(field in updates for field in ["address", "city", "state", "zipCode"]):
            if "address" in updates:
                project["location"]["address"] = updates["address"]
            if "city" in updates:
                project["location"]["city"] = updates["city"]
            if "state" in updates:
                project["location"]["state"] = updates["state"]
            if "zipCode" in updates:
                project["location"]["zipCode"] = updates["zipCode"]
        
        # Update client contact if provided
        if any(field in updates for field in ["clientContactName", "clientContactEmail", "clientContactPhone"]):
            if "clientContactName" in updates:
                project["clientContact"]["name"] = updates["clientContactName"]
            if "clientContactEmail" in updates:
                project["clientContact"]["email"] = updates["clientContactEmail"]
            if "clientContactPhone" in updates:
                project["clientContact"]["phone"] = updates["clientContactPhone"]
        
        # Update timestamp
        project["lastUpdated"] = datetime.now().strftime("%Y-%m-%d")
        
        return self._write_data(data)

    def delete_project(self, project_id: int) -> bool:
        """
        Delete a project and all its associated categories.
        This removes the project entirely from the system.
        """
        data = self._read_data()
        
        # Remove project
        projects = data.get("projects", [])
        data["projects"] = [p for p in projects if p["id"] != project_id]
        
        # Remove associated categories
        categories = data.get("categories", [])
        data["categories"] = [c for c in categories if c["projectId"] != project_id]
        
        # Remove associated documents (optional - you might want to keep them)
        documents = data.get("documents", [])
        data["documents"] = [d for d in documents if d["projectId"] != project_id]
        
        return self._write_data(data)

    def add_category_to_project(self, project_id: int, category_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Add a new category to an existing project.
        This allows building out project structure after creation.
        """
        data = self._read_data()
        
        # Verify project exists
        project = next((p for p in data.get("projects", []) if p["id"] == project_id), None)
        if not project:
            raise Exception("Project not found")
        
        # Generate new category ID
        existing_ids = [category["id"] for category in data.get("categories", [])]
        new_id = max(existing_ids, default=300) + 1
        
        # Create new category
        new_category = {
            "id": new_id,
            "projectId": project_id,
            "name": category_data.get("name", ""),
            "description": category_data.get("description", ""),
            "totalItems": category_data.get("totalItems", 0),
            "quotedItems": 0,  # Start with 0 quoted items
            "status": "pending",  # Start as pending
            "vendorParticipation": [],  # Start with no vendors
            "specifications": category_data.get("specifications", ""),
            "estimatedValue": category_data.get("estimatedValue", 0),
            "deadlineDate": category_data.get("deadlineDate", "")
        }
        
        # Add to categories array
        data.setdefault("categories", []).append(new_category)
        
        # Update project's category IDs
        project.setdefault("categoryIds", []).append(new_id)
        project["lastUpdated"] = datetime.now().strftime("%Y-%m-%d")
        
        # Save to file
        if self._write_data(data):
            return new_category
        else:
            raise Exception("Failed to save new category")

    def get_project_templates(self) -> List[Dict[str, Any]]:
        """
        Get common project templates to speed up project creation.
        This provides pre-filled templates for common project types.
        """
        templates = [
            {
                "name": "Office Building",
                "description": "Multi-story office complex with retail and parking",
                "estimatedValue": 2500000,
                "status": "early",
                "commonCategories": [
                    {"name": "Structural Steel", "description": "Primary structural framework"},
                    {"name": "Concrete & Masonry", "description": "Foundation and structural concrete"},
                    {"name": "HVAC Systems", "description": "Heating, ventilation, and air conditioning"},
                    {"name": "Electrical", "description": "Electrical systems and wiring"},
                    {"name": "Plumbing", "description": "Water and waste systems"}
                ]
            },
            {
                "name": "Residential Development", 
                "description": "Multi-family residential complex with amenities",
                "estimatedValue": 1500000,
                "status": "early",
                "commonCategories": [
                    {"name": "Foundation", "description": "Concrete foundation systems"},
                    {"name": "Framing", "description": "Structural framing and roofing"},
                    {"name": "Siding & Roofing", "description": "Exterior materials"},
                    {"name": "Interior Finishes", "description": "Flooring, paint, and fixtures"},
                    {"name": "Landscaping", "description": "Site preparation and landscaping"}
                ]
            },
            {
                "name": "Warehouse/Industrial",
                "description": "Industrial warehouse or manufacturing facility", 
                "estimatedValue": 3000000,
                "status": "early",
                "commonCategories": [
                    {"name": "Pre-Engineered Building", "description": "Metal building systems"},
                    {"name": "Site Work", "description": "Grading, utilities, and paving"},
                    {"name": "Loading Docks", "description": "Dock equipment and doors"},
                    {"name": "Industrial Electrical", "description": "Heavy-duty electrical systems"},
                    {"name": "Fire Protection", "description": "Sprinkler and safety systems"}
                ]
            }
        ]
        
        return templates