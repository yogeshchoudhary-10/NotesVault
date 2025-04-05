from pydantic_settings import BaseSettings  # Changed import
from pydantic import Field  # For field validation
import os
from pathlib import Path
from typing import ClassVar
class Settings(BaseSettings):
    MONGODB_URL: str = Field(default="mongodb://localhost:27017")
    SECRET_KEY: str = Field(default="your-secret-key-here")
    ALGORITHM: str = Field(default="HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30)
    UPLOAD_DIR: ClassVar[Path] = Path("uploads")
    TESSERACT_CMD: str = Field(default="/usr/bin/tesseract", env="TESSERACT_CMD")
    # New configuration style for Pydantic v2
    model_config = {
        "env_file": ".env",
        "extra": "ignore"  # Ignore extra fields in .env
    }
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Create upload directory on startup
        self.UPLOAD_DIR.mkdir(exist_ok=True)

settings = Settings()