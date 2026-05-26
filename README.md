# 🔐 VulnTracker v3.0

## Setup (3 steps)

### 1. Supabase
- Go to supabase.com → New project
- SQL Editor → Paste schema.sql → Run

### 2. Backend
```
cd server
copy .env.example .env
# Fill in .env with your Supabase keys
npm install
npm run dev
```

### 3. Frontend
```
cd client
npm install
npm run dev
```

Open: http://localhost:3000

## .env values
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your-publishable-key
SUPABASE_SERVICE_KEY=your-secret-key
JWT_SECRET=any-random-string-here
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=gmail-app-password
PORT=5000
CLIENT_URL=http://localhost:3000
```
