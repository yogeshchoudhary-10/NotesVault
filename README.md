# 📓 NotesVault

NotesVault is a notes management system designed to make handwritten and digital notes easily searchable using OCR (Optical Character Recognition).

---

## 🔧 Project Structure

```
notes-vault/           # Frontend (React)
notesvault-backend/    # Backend (FastAPI)
```

---

## ✨ Getting Started

### 🖥️ Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd notes-vault
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

---

### 🧠 Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd notesvault-backend
   ```

2. (Recommended) Create a virtual environment:
   ```bash
   python -m venv .venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     .venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source .venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the `notesvault-backend` directory with your environment variables (e.g., database URI, JWT secrets, etc.).

6. Run the FastAPI backend:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

---

