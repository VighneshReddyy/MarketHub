# MarketHub

A full-stack marketplace web application built with **Next.js 16**, **React 19**, **Tailwind CSS**, and **MySQL / TiDB Cloud**.

Users can list items for sale, browse and purchase listings, set price alerts, leave reviews, and receive notifications. An admin panel provides full platform management.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | MySQL / TiDB Cloud |
| ORM/Driver | mysql2 |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |
| Deployment | Vercel |

---

## Features

- **Auth** — Register, login, and admin login with cookie-based sessions
- **Marketplace** — Browse, search, and purchase listings
- **Sell** — List items with category, condition, price, and description
- **Price Alerts** — Get notified when matching items are listed
- **Manage** — View your active listings and purchase history
- **Notifications** — In-app notification feed
- **Reviews** — Star ratings and written reviews between users
- **Admin Panel** — Manage users, items, categories, reports, and reviews

---

## Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later
- A **MySQL** database (local MySQL or a free [TiDB Cloud](https://tidbcloud.com) cluster)

---

### 1. Clone the repository

```bash
git clone https://github.com/VighneshReddyy/MarketHub.git
cd MarketHub/frontend
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Set up the database

Create a MySQL database named `marketplace` and run your schema to create the tables:

```
Users, Items, Categories, Orders, Reviews, Alerts, Notifications, Reports, AdminLogs
```

If you're using **TiDB Cloud** (recommended for free hosting):

1. Sign up at [tidbcloud.com](https://tidbcloud.com)
2. Create a free Serverless cluster
3. Copy the connection credentials from the dashboard

---

### 4. Configure environment variables

Create a `.env` file in the `frontend/` directory:

```env
# Local MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=marketplace
DB_SSL=false
```

**If using TiDB Cloud**, use these instead:

```env
DB_HOST=gateway01.ap-southeast-1.prod.aws.tidbcloud.com
DB_PORT=4000
DB_USER=your_username.root
DB_PASSWORD=your_password
DB_NAME=marketplace
DB_SSL=true
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

---

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. Set the **Root Directory** to `frontend`
4. Add all environment variables from your `.env` file in the Vercel dashboard
5. Deploy

> **Important:** When using TiDB Cloud on Vercel, set `DB_SSL=true`. The code explicitly applies `minVersion: "TLSv1.2"` when this is set, which is required for TiDB Cloud connections.

---

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Login/Register page
│   │   ├── dashboard/            # User-facing pages
│   │   │   ├── buy/              # Browse marketplace
│   │   │   ├── sell/             # Create a listing
│   │   │   ├── manage/           # My listings & purchases
│   │   │   ├── alerts/           # Price alert management
│   │   │   ├── notifications/    # Notification feed
│   │   │   └── ratings/          # Reviews on your profile
│   │   ├── admin/                # Admin panel
│   │   ├── api/                  # API routes
│   │   │   ├── auth/             # Login / register
│   │   │   └── admin/            # Admin CRUD operations
│   │   └── actions/              # Server actions
│   ├── components/ui/            # Reusable UI components
│   └── lib/
│       ├── db.ts                 # MySQL connection pool
│       └── utils.ts              # Utility helpers
├── public/                       # Static assets
├── .env                          # Local environment variables (not committed)
├── next.config.ts
├── tailwind.config (via postcss)
└── package.json
```

---

## Environment Variables Reference

| Variable | Description | Example |
|---|---|---|
| `DB_HOST` | Database hostname | `localhost` |
| `DB_PORT` | Database port | `3306` (MySQL) / `4000` (TiDB) |
| `DB_USER` | Database username | `root` |
| `DB_PASSWORD` | Database password | `yourpassword` |
| `DB_NAME` | Database name | `marketplace` |
| `DB_SSL` | Enable TLS (required for TiDB Cloud) | `true` / `false` |

---

## License

MIT
