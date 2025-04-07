# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, notes  # Import your routers
from config import settings
from auth import oauth2_scheme
from fastapi.openapi.utils import get_openapi

from fastapi.staticfiles import StaticFiles

from starlette.requests import Request
import logging



# Create FastAPI application
app = FastAPI(
    title="NotesVault API",
    description="Backend for notes management system with OCR capabilities",
    version="1.0.0",
    openapi_url="/api/v1/openapi.json",
    
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://solid-computing-machine-x5rq6rwpwjqphvxpj-3000.app.github.dev", 
         # Your exact frontend URL
        "http://localhost:3000"  # For local testing
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"]  # Important for auth headers
)
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logging.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logging.info(f"Response status: {response.status_code}")
    return response







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