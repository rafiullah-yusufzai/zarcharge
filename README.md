# ⚡ Zarcharge - Instant Mobile Top-up for Afghanistan

<div align="center">
  <img src="https://via.placeholder.com/120x120?text=Zarcharge" alt="Zarcharge Logo" width="120" style="border-radius: 24px;">
  <br/>
  <p><strong>Fast. Secure. Reliable.</strong> Recharge Afghan mobile numbers instantly.</p>
  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
    <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
    <img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django">
    <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
  </p>
</div>

---

## 📱 Overview

Zarcharge is a modern mobile top-up application that allows users to instantly recharge mobile credit for Afghan telecom operators. Built with React + Vite on the frontend and Django REST Framework + PostgreSQL on the backend.

### Supported Networks
| Network | Provider Code | Prefixes |
|---------|--------------|----------|
| AWCC | AWAF | 70, 71, 72 |
| MTN | MTAF | 77 |
| Roshan | RHAF | 79 |
| Etisalat | ETAF | 78 |
| Salaam | LJAF | 76 |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.10 or higher)
- PostgreSQL (v14 or higher)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd zarcharge_app
Create virtual environment

bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
Install dependencies

bash
pip install -r requirements.txt
Create PostgreSQL database

bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE zarcharge_db;
CREATE USER zarcharge_user WITH PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE zarcharge_db TO zarcharge_user;
\q
Copy environment variables

bash
cp .env.example .env
# Edit .env with your database credentials
Run migrations

bash
python manage.py migrate
python manage.py createsuperuser
Sync products from Ding API

bash
python manage.py shell
python
from recharge.views import sync_operators
from django.http import HttpRequest
request = HttpRequest()
response = sync_operators(request)
print(response.data)  # Should show saved products count
Start backend server

bash
python manage.py runserver
Frontend Setup
Navigate to frontend directory

bash
cd zarcharge-frontend
Install dependencies

bash
npm install
Create environment file

bash
cp .env.example .env
Start development server

bash
npm run dev
Open your browser

Frontend: http://localhost:5173

Backend API: http://localhost:8000/api

📡 API Endpoints
Endpoint	Method	Description
/api/operators/	GET	List all operators/products
/api/sync-operators/	GET	Sync products from Ding API
/api/transactions/	POST	Create a new top-up transaction
/api/countries/	GET	Get supported countries
🛠️ Technologies Used
Frontend
React 18 - UI framework

Vite - Build tool

Tailwind CSS - Styling

React Router DOM - Navigation

Axios - API calls

Backend
Django 5.2 - Web framework

Django REST Framework - API development

PostgreSQL - Production database

psycopg2 - PostgreSQL adapter

Ding API - Top-up provider integration

📁 Project Structure
text
Zarcharge/
├── zarcharge_app/           # Django Backend
│   ├── recharge/            # Main app
│   │   ├── models.py        # Database models
│   │   ├── views.py         # API views
│   │   ├── urls.py          # URL routing
│   │   └── services/        # External services
│   ├── config/              # Django settings
│   ├── .env.example         # Environment template
│   ├── requirements.txt     # Python dependencies
│   └── manage.py
│
└── zarcharge-frontend/      # React Frontend
    ├── src/
    │   ├── components/      # Reusable components
    │   ├── pages/           # Page components
    │   ├── context/         # React Context
    │   ├── services/        # API services
    │   └── utils/           # Utility functions
    ├── package.json
    └── vite.config.js
🔧 Environment Variables
Backend (.env)
env
SECRET_KEY=your-secret-key
DEBUG=True
DB_NAME=zarcharge_db
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
DING_API_KEY=your-ding-api-key
Frontend (.env)
env
VITE_API_BASE_URL=http://localhost:8000/api
🎯 Usage Flow
Enter Phone Number - User enters Afghan mobile number

Operator Detection - System automatically detects operator

Select Package - Choose top-up amount or data/voice package

Confirm - Review and confirm transaction

Success - Instant delivery confirmation

🤝 Contributing
Fork the repository

Create feature branch (git checkout -b feature/amazing-feature)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing-feature)

Open Pull Request

📄 License
MIT License - see LICENSE file for details

🙏 Acknowledgments
Ding API - Top-up service provider

React - Frontend library

Django - Backend framework

PostgreSQL - Database

<div align="center"> Made with ❤️ for Afghanistan </div> ```