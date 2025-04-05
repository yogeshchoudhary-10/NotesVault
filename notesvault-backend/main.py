# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, notes  # Import your routers
from config import settings
from auth import oauth2_scheme
from fastapi.openapi.utils import get_openapi
# Create FastAPI application
app = FastAPI(
    title="NotesVault API",
    description="Backend for notes management system with OCR capabilities",
    version="1.0.0",
    openapi_url="/api/v1/openapi.json",
    
)

# Configure CORS (Cross-Origin Resource Sharing)
# Adjust these settings for production!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (update for production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    # Get base OpenAPI schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    
    # Add security scheme without overwriting existing components
    security_scheme = {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT"
    }
    
    # Merge existing components with new security scheme
    components = openapi_schema.get("components", {})
    components.setdefault("securitySchemes", {})["JWT"] = security_scheme
    openapi_schema["components"] = components
    
    # Add security requirements to operations
    for path in openapi_schema["paths"].values():
        for method in path.values():
            if "security" not in method:
                method["security"] = [{"JWT": []}]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi
# Include your routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])

# Root endpoint for health check
@app.get("/", tags=["Health Check"])
async def root():
    return {
        "message": "NotesVault API is running",
        "status": "healthy",
        "version": app.version
    }