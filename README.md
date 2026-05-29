<div align="center">
  <img src="https://img.shields.io/badge/version-3.0.0-00D4FF?style=for-the-badge&logoColor=white" alt="Version"/>
  <img src="https://img.shields.io/badge/license-MIT-00FF88?style=for-the-badge" alt="License"/>
  <img src="https://img.shields.io/badge/react-18.x-61DAFB?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/express-4.x-000000?style=for-the-badge&logo=express" alt="Express"/>
  <img src="https://img.shields.io/badge/supabase-FEAE2B?style=for-the-badge&logo=supabase" alt="Supabase"/>
</div>

<br/>

<div align="center">
  <h1>🔐 VulnTracker v3.0</h1>
  <p><strong>Real-time Vulnerability Intelligence & CVE Monitoring Platform</strong></p>
  <p>Track, scan, and monitor security vulnerabilities across your entire tech stack — all in one place.</p>
</div>

<br/>

---

## ✨ Features

<div align="center">
  <table>
    <tr>
      <td align="center" width="25%">
        <h3>📋 Stack Manager</h3>
        <p>Add & track your tech stack with version info</p>
      </td>
      <td align="center" width="25%">
        <h3>🔍 CVE Scanner</h3>
        <p>Real-time NVD database queries — no API key needed</p>
      </td>
      <td align="center" width="25%">
        <h3>🌐 URL Scanner</h3>
        <p>Detect tech stack from any URL & scan for CVEs</p>
      </td>
      <td align="center" width="25%">
        <h3>📊 Risk Scoring</h3>
        <p>Dynamic risk scores based on CVE severity</p>
      </td>
    </tr>
    <tr>
      <td align="center">
        <h3>🔔 Smart Alerts</h3>
        <p>Email & Slack notifications for critical CVEs</p>
      </td>
      <td align="center">
        <h3>⏰ Scheduled Scanning</h3>
        <p>Hourly/daily/weekly automated vulnerability checks</p>
      </td>
      <td align="center">
        <h3>🏢 Team Management</h3>
        <p>Organizations with role-based member access</p>
      </td>
      <td align="center">
        <h3>📈 CVE Timeline</h3>
        <p>Visual history of vulnerability trends over time</p>
      </td>
    </tr>
    <tr>
      <td align="center">
        <h3>📤 Export Reports</h3>
        <p>Download CSV & JSON vulnerability reports</p>
      </td>
      <td align="center">
        <h3>📎 Security Badge</h3>
        <p>Dynamic badge for your GitHub README</p>
      </td>
      <td align="center">
        <h3>📁 Auto-Detect</h3>
        <p>Upload package.json / requirements.txt</p>
      </td>
      <td align="center">
        <h3>🌙 Dark/Light Theme</h3>
        <p>Built-in theme switcher with cyber aesthetic</p>
      </td>
    </tr>
  </table>
</div>

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    🖥️ Client (React + Vite)                │
│  Port 3000 · Tailwind CSS · React Router · Lucide Icons    │
└──────────────────────┬─────────────────────────────────────┘
                       │  /api/* (proxied by Vite)
                       ▼
┌────────────────────────────────────────────────────────────┐
│                   ⚙️ Server (Express.js)                   │
│  Port 5000 · JWT Auth · Nodemailer · node-cron · node-fetch│
└──────────┬─────────────────────────────────────┬───────────┘
           │                                     │
           ▼                                     ▼
┌─────────────────────┐              ┌──────────────────────┐
│    🗄️ Supabase DB   │              │  🌐 NVD API (NIST)   │
│  PostgreSQL · Auth   │              │  CVE Database Query  │
│  Row-Level Security  │              │  (free, no key)      │
└─────────────────────┘              └──────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+
- **npm** v9+
- A **Supabase** account (free tier works)

### 1️⃣ Database Setup

| Step | Action |
|------|--------|
| 1 | Go to [supabase.com](https://supabase.com) → **New Project** |
| 2 | Navigate to **SQL Editor** |
| 3 | Copy contents from `database/schema.sql` → **Paste** → **Run** |

### 2️⃣ Backend Setup

```bash
# Navigate to server directory
cd server

# Create environment config
copy .env.example .env        # Windows
# cp .env.example .env        # macOS/Linux

# Edit .env with your Supabase keys

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3️⃣ Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4️⃣ Access the App

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔧 Environment Variables

| Variable | Description | Required |
|----------|-------------|:--------:|
| `SUPABASE_URL` | Your Supabase project URL | ✅ |
| `SUPABASE_ANON_KEY` | Supabase publishable anon key | ✅ |
| `SUPABASE_SERVICE_KEY` | Supabase service role secret key | ✅ |
| `JWT_SECRET` | Random string for token signing | ✅ |
| `EMAIL_USER` | Gmail address for email alerts | ❌ |
| `EMAIL_PASS` | Gmail app password | ❌ |
| `PORT` | Server port (default: `5000`) | ❌ |
| `CLIENT_URL` | Frontend URL (default: `http://localhost:3000`) | ❌ |

---

## 📡 API Routes

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|:----:|
| **Authentication** | | | |
| `/api/auth/register` | POST | Register new user | ❌ |
| `/api/auth/login` | POST | Login user | ❌ |
| `/api/auth/me` | GET | Get current user | ✅ |
| `/api/auth/change-password` | POST | Change password | ✅ |
| **Stack Management** | | | |
| `/api/stack` | GET | List all technologies | ✅ |
| `/api/stack` | POST | Add technology | ✅ |
| `/api/stack/:id` | PUT | Update technology | ✅ |
| `/api/stack/:id` | DELETE | Remove technology | ✅ |
| **CVE Scanning** | | | |
| `/api/cve/scan` | POST | Run CVE scan | ✅ |
| `/api/cve/results` | GET | Get scan results | ✅ |
| `/api/cve/stats` | GET | Get CVE statistics | ✅ |
| `/api/cve/:id/read` | PATCH | Mark alert as read | ✅ |
| `/api/cve/read-all` | PATCH | Mark all as read | ✅ |
| **Projects** | | | |
| `/api/projects` | GET/POST | List/Create projects | ✅ |
| `/api/projects/:id` | PUT/DELETE | Update/Delete project | ✅ |
| `/api/projects/risk-score` | GET | Get risk score | ✅ |
| **URL Scanner** | | | |
| `/api/urlscan` | POST | Scan website URL | ✅ |
| **Export** | | | |
| `/api/export/csv` | GET | Download CSV report | ✅ |
| `/api/export/json` | GET | Download JSON report | ✅ |
| `/api/export/history` | GET | Get scan history | ✅ |
| **Settings** | | | |
| `/api/settings` | GET/POST | Get/Save settings | ✅ |
| `/api/settings/parse-file` | POST | Parse dependency file | ✅ |
| **Team** | | | |
| `/api/team` | GET | Get user's organizations | ✅ |
| `/api/team/create` | POST | Create organization | ✅ |
| `/api/team/invite` | POST | Invite member | ✅ |
| `/api/team/:id` | DELETE | Delete organization | ✅ |
| `/api/team/:id/members` | GET | List members | ✅ |
| `/api/team/:id/members/:uid` | DELETE | Remove member | ✅ |
| **Badge** | | | |
| `/api/badge/:userId` | GET | Get security badge SVG | ❌ |
| **Health** | | | |
| `/api/health` | GET | Health check | ❌ |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Utility-first styling |
| **React Router v6** | Client-side routing |
| **Axios** | HTTP client |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| **Express.js** | Web server framework |
| **Supabase JS** | PostgreSQL client & Auth |
| **JSON Web Token** | Authentication |
| **bcryptjs** | Password hashing |
| **node-cron** | Scheduled tasks |
| **Nodemailer** | Email notifications |
| **node-fetch** | NVD API requests |

### Database (Supabase/PostgreSQL)
| Table | Purpose |
|-------|---------|
| `users` | User accounts |
| `user_stacks` | Technology stack items |
| `cve_alerts` | Vulnerability alerts |
| `projects` | User projects |
| `scan_history` | Scan result records |
| `scan_settings` | User preferences |
| `organizations` | Teams/orgs |
| `org_members` | Org membership & roles |

---

## 📸 Security Badge

VulnTracker comes with a **dynamic security badge** you can embed in your GitHub README to show your project's current vulnerability score:

```markdown
[![VulnTracker](https://your-server.com/api/badge/USER_ID)](https://your-app-url/dashboard)
```

The badge updates automatically after every scan and reflects your current risk score.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. Open a **Pull Request**

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/08theabhi">Abhishek H N</a></p>
  <p>
    <a href="https://github.com/08theabhi/vulnTracker/issues">Report Bug</a>
    ·
    <a href="https://github.com/08theabhi/vulnTracker/issues">Request Feature</a>
  </p>
</div>
