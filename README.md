# StreamFusion 🎬🎧

A full-stack Netflix + Spotify-inspired streaming platform with video playback and a custom music engine built using React, Django, and MongoDB.

## Stack

- Frontend: React, Vite, Tailwind CSS, Axios, React Router
- Backend: Django, Django REST Framework, Simple JWT, MongoEngine, CORS Headers
- Database: MongoDB for app data, SQLite for built-in Django admin/session tables
- Auth: JWT access and refresh tokens

## Features

- User signup and login
- Password hashing with Django hashers
- Protected frontend routes
- Netflix-style homepage with featured banner and category rows
- Search by movie title
- Favorites / My List
- Video player page with HTML5 video
- Continue Watching progress sync
- Pagination-ready movie endpoint
- Seed command for sample movies

## Project Structure

```text
netflix-clone/
|-- backend/
|   |-- manage.py
|   |-- requirements.txt
|   |-- netflix_backend/
|   `-- movies/
|-- frontend/
|   |-- package.json
|   `-- src/
`-- README.md
```

## Backend Setup

1. Open a terminal in the project root.
2. Create and activate a virtual environment:

```powershell
cd backend
C:\Users\Geethika\AppData\Local\Programs\Python\Python312\python.exe -m venv .venv
.venv\Scripts\activate
```

3. Install dependencies:

```powershell
pip install -r requirements.txt
```

4. Create your environment file:

```powershell
Copy-Item .env.example .env
```

5. Update `backend/.env` values as needed:

```env
SECRET_KEY=change-me
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
MONGODB_URI=mongodb://127.0.0.1:27017/netflix_clone
MONGODB_DB=netflix_clone
CORS_ALLOWED_ORIGINS=http://localhost:5173
ACCESS_TOKEN_LIFETIME_MINUTES=60
REFRESH_TOKEN_LIFETIME_DAYS=7
```

6. Run Django migrations for the built-in Django apps:

```powershell
python manage.py migrate
```

7. Seed sample movies:

```powershell
python manage.py seed_movies
```

8. Start the backend server:

```powershell
python manage.py runserver
```

Backend will run at `http://127.0.0.1:8000`.

## Frontend Setup

1. Open a second terminal.
2. Move into the frontend:

```powershell
cd frontend
```

3. Install dependencies:

```powershell
npm install
```

4. Create your frontend environment file:

```powershell
Copy-Item .env.example .env
```

5. Start the Vite dev server:

```powershell
npm run dev
```

Frontend will run at `http://localhost:5173`.

## MongoDB Compass Guide

1. Open MongoDB Compass.
2. Click `Add new connection`.
3. Paste the same URI used in `backend/.env`, for example:

```text
mongodb://127.0.0.1:27017/netflix_clone
```

4. Click `Connect`.
5. Open the `netflix_clone` database.
6. You should see collections like:
   - `users`
   - `movies`
   - `favorites`
   - `continue_watching`

If the database is empty, run:

```powershell
cd backend
python manage.py seed_movies
```

## Main API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`
- `GET /api/movies`
- `GET /api/movies/:id`
- `POST /api/favorites`
- `GET /api/favorites`
- `DELETE /api/favorites/:movieId`
- `POST /api/continue-watching`

## Example API Usage

### Register

```json
{
  "full_name": "Demo User",
  "email": "demo@example.com",
  "password": "Password123"
}
```

### Login

```json
{
  "email": "demo@example.com",
  "password": "Password123"
}
```

### Create Favorite

```json
{
  "movie_id": "PUT_MOVIE_ID_HERE"
}
```

## Run Both Servers

Backend:

```powershell
cd backend
.venv\Scripts\activate
python manage.py runserver
```

Frontend:

```powershell
cd frontend
npm run dev
```

## Notes

- This project stores video URLs only. It does not upload or host video files.
- MongoDB stores the app documents for users, movies, favorites, and continue-watching entries.
- SQLite is used only for Django's built-in framework tables like admin, auth metadata, and sessions.
- The movie admin CRUD UI is not wired into native Django admin because the app uses MongoEngine documents rather than Django ORM models.
- You can seed sample data quickly with `python manage.py seed_movies`.
