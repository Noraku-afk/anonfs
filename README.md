# Confidential File Sharing System

A secure file sharing application with AES-256 encryption, User Authentication, and granular sharing permissions.

## Tech Stack
- **Backend:** Django, Django REST Framework, PostgreSQL
- **Frontend:** React (Vite), Axios
- **Security:** AES-256 Encryption (CBC Mode), JWT Authentication

## Prerequisites
- Python 3.8+
- Node.js & npm
- PostgreSQL

## Setup Instructions

### 1. Database Setup
Create a PostgreSQL database (if not already created):
```bash
createdb anonfs_db
```
Ensure your database credentials are correct in `backend/.env`.

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt (or manually install dependencies)
# Dependencies: django djangorestframework psycopg2-binary pycryptodome django-cors-headers djangorestframework-simplejwt python-dotenv

python manage.py migrate
python manage.py runserver
```
Backend will run at http://localhost:8000

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will run at http://localhost:5173

## Features
1. **Register/Login:** Create an account to start secure sharing.
2. **Dashboard:** View your files and files shared with you.
3. **Upload:** Files are encrypted *before* storage using AES-256.
4. **Share:** Share files via email. Only the owner can share.
5. **Download:** Files are decrypted on-the-fly for authorized users only.

## Security Details
- **Encryption:** Files are encrypted using AES-256 in CBC mode. A unique IV is generated for each file and stored prepended to the ciphertext.
- **Keys:** The encryption key is stored in the `.env` file (AES_KEY). In production, use a Key Management System.
- **Access Control:** All API endpoints are protected with JWT. File access is strictly checked against ownership or explicit permission entries in the database.
