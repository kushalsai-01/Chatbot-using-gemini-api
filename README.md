# 🤖 Gemini Chatbot

A modern, production-ready AI chatbot powered by **Google Gemini**, built with **React**, **FastAPI**, and **PostgreSQL**.

![screenshot placeholder](https://via.placeholder.com/900x500?text=Gemini+Chatbot+Screenshot)

---

## 🏗️ Architecture

```
┌──────────────┐        ┌──────────────────┐        ┌──────────────┐
│              │  POST   │                  │  SDK   │              │
│  React App   │───────►│  FastAPI Backend  │───────►│  Gemini API  │
│  (Vercel)    │◄───────│  (HF Spaces)     │◄───────│  (Google)    │
│              │  JSON   │                  │  text  │              │
└──────────────┘        └────────┬─────────┘        └──────────────┘
                                 │
                          read / write
                                 │
                        ┌────────▼─────────┐
                        │   PostgreSQL DB   │
                        │   (Supabase)      │
                        └──────────────────┘
```

**Flow:** User sends a message → React frontend calls `/chat` → FastAPI fetches the last 12 messages from Postgres, sends them + the new message to Gemini, stores both user & assistant messages, and returns the reply.

---

## ✨ Features

| Feature                     | Details                                          |
| --------------------------- | ------------------------------------------------ |
| AI Chat                     | Google Gemini 1.5 Flash                          |
| Markdown Rendering          | Full GFM with tables, lists, blockquotes         |
| Syntax-Highlighted Code     | 100+ languages via Prism, with copy button       |
| Dark / Light Mode           | Toggleable, persisted in localStorage            |
| Session Management          | UUID-based, no login required                    |
| Persistent History          | Messages stored per-session in PostgreSQL         |
| Responsive Design           | Mobile-first with collapsible sidebar             |
| Typing Indicator            | Animated dots while awaiting response            |
| Error Handling              | Graceful error bubbles for any failure           |

---

## 🛠️ Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React 18, Vite, TailwindCSS 3      |
| Backend    | FastAPI, SQLAlchemy, Pydantic       |
| Database   | PostgreSQL (Supabase)               |
| AI Model   | Google Gemini 1.5 Flash             |
| Deployment | Vercel (FE) + Hugging Face Spaces (BE) |

---

## 📁 Project Structure

```
chatbot-gemini/
├── frontend/
│   ├── src/
│   │   ├── components/     # MessageBubble, ChatWindow, InputBar, Sidebar, TypingIndicator
│   │   ├── pages/          # Home
│   │   ├── api/            # Axios chat client
│   │   ├── utils/          # Session ID manager
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── main.py             # FastAPI app
│   ├── database.py         # SQLAlchemy engine
│   ├── models.py           # ORM models
│   ├── schemas.py          # Pydantic models
│   ├── routes/chat.py      # /chat endpoint
│   ├── services/
│   │   ├── gemini.py       # Gemini API client
│   │   └── history.py      # DB read/write
│   ├── Dockerfile
│   └── requirements.txt
├── database/
│   └── schema.sql
└── README.md
```

---

## 🚀 Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL database (or free Supabase project)
- Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

### 1. Database Setup

Create a Supabase project (or local Postgres), then run the schema:

```sql
-- Paste contents of database/schema.sql into the Supabase SQL Editor
```

### 2. Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt

# Create .env from template and fill in your values
cp .env.example .env

# Run
uvicorn main:app --reload --port 8000
```

### 3. Frontend

```bash
cd frontend
npm install

# Create .env from template
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:8000

npm run dev
```

The app opens at **http://localhost:5173**.

---

## 🌍 Deployment

### Database — Supabase

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Open **SQL Editor** → paste and run `database/schema.sql`
3. Go to **Project Settings → Database** → copy the **Connection String (URI)**
4. This becomes your `DATABASE_URL`

### Backend — Hugging Face Spaces

1. Create a new Space at [huggingface.co/spaces](https://huggingface.co/spaces)
   - **SDK:** Docker
2. Push the contents of `backend/` to the Space repo
3. Add **Secrets** in Space Settings:

| Secret            | Value                                |
| ----------------- | ------------------------------------ |
| `GEMINI_API_KEY`  | Your Gemini API key                  |
| `DATABASE_URL`    | Supabase connection URI              |
| `ALLOWED_ORIGINS` | Your Vercel frontend URL             |

The backend will be available at `https://<user>-<space>.hf.space`.

### Frontend — Vercel

1. Push repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **Import Project**
3. Set **Root Directory** to `frontend`
4. Add **Environment Variable**:

| Variable             | Value                                  |
| -------------------- | -------------------------------------- |
| `VITE_API_BASE_URL`  | `https://<user>-<space>.hf.space`      |

5. Deploy — Vercel auto-detects Vite

---

## 🔑 Environment Variables Reference

### Backend (`backend/.env`)

| Variable          | Description                          | Example                                       |
| ----------------- | ------------------------------------ | --------------------------------------------- |
| `GEMINI_API_KEY`  | Google Gemini API key                | `AIzaSy...`                                   |
| `DATABASE_URL`    | PostgreSQL connection URI            | `postgresql://user:pass@host:5432/dbname`     |
| `ALLOWED_ORIGINS` | Comma-separated allowed CORS origins | `https://my-app.vercel.app,http://localhost:5173` |

### Frontend (`frontend/.env`)

| Variable             | Description           | Example                              |
| -------------------- | --------------------- | ------------------------------------ |
| `VITE_API_BASE_URL`  | Backend API base URL  | `https://user-chatbot.hf.space`     |

---

## 📡 API Endpoints

### `POST /chat`

Send a message and receive an AI response.

**Request:**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "message": "Explain quantum computing"
}
```

**Response:**
```json
{
  "response": "Quantum computing is a type of computation ...",
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### `GET /health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok"
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
