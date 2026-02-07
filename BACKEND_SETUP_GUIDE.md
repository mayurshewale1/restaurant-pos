# Restaurant Management System - Backend Setup Guide

## ✅ Current Status

- ✅ Supabase PostgreSQL database configured (pooler + new password)
- ✅ Backend code updated to support `DATABASE_URL` and SSL
- ✅ `.env` file configured for local development (pooler)
- ✅ `.env.production` created for VPS deployment
- ⏳ Ready for testing and deployment

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Test Database Connection
```bash
node test-pg-cjs.js
```

Expected output:
```
Testing Postgres connection...
Connection source: DATABASE_URL
Using: { connectionString: 'postgresql:<REDACTED>@aws-..., ssl: true }
✅ Connected. DB time: 2026-02-06T...
```

### 3. Start Backend Server
```bash
npm start
```

Expected output:
```
✅ Connected to PostgreSQL database
✅ Database models synchronized
Server running on port 5000
```

### 4. Test API Endpoint
```bash
curl http://localhost:5000/api
# Should return: {"success":true,"data":[]}
```

---

## 📋 Backend File Structure

```
server/
├── .env                       # Local dev env (uses pooler)
├── .env.production           # Production VPS env (DO NOT COMMIT)
├── .gitignore                # Should exclude .env*, node_modules
├── package.json              # Dependencies & scripts
├── src/
│   ├── index.js             # Server entry point
│   ├── app.js               # Express app
│   ├── utils/
│   │   └── db.js            # Database (Sequelize) config
│   ├── models/              # Models (Order, Menu, Staff, etc.)
│   ├── controllers/         # API controllers
│   ├── routes/              # API routes
│   └── middleware/          # Error handling, etc.
├── test-db.js               # Old Sequelize test (for reference)
└── test-pg-cjs.js           # New Postgres test (CommonJS)
```

---

## 🔧 Configuration Files

### `.env` (Local Development)
- Uses Supabase **pooler** (IPv4-friendly)
- Database: `postgres`
- User: `postgres`
- Password: `CP0EmprK0iVE9UHa`
- SSL: enabled
- NODE_ENV: development
- Update `FRONTEND_URL` if your frontend runs on different port

### `.env.production` (VPS)
- Same as `.env` but with:
  - `NODE_ENV=production`
  - `PORT=6000` (adjust to VPS port)
  - `FRONTEND_URL=https://pos.hotelbattasesukhsagar.in`
- **KEEP THIS FILE SECURE** - do not commit to git

### `server/src/utils/db.js`
- Now supports `DATABASE_URL` as primary connection method
- Falls back to `DB_HOST/DB_NAME/DB_USER/DB_PASSWORD` for local dev
- Automatically enables SSL when `DB_SSL=true`
- Supports Supabase direct host and pooler

---

## 🛠️ Common Issues & Fixes

### ❌ "Tenant or user not found"
- **Cause**: Wrong credentials or pooler host
- **Fix**: Verify password in `.env` matches Supabase (currently `CP0EmprK0iVE9UHa`)

### ❌ "getaddrinfo ENOTFOUND"
- **Cause**: Machine can't resolve IPv6 Supabase host
- **Fix**: Already fixed - using pooler (IPv4) in `.env`

### ❌ "database "restaurant_management" does not exist"
- **Cause**: Using wrong DB name for Supabase
- **Fix**: Supabase uses `postgres` by default, not `restaurant_management` - already fixed

### ❌ Port already in use (5000)
- **Fix**: Change `PORT` in `.env` or kill process using port 5000

---

## 📦 Environment Variables Explained

| Variable | Local Dev | Production | Description |
|----------|-----------|------------|-------------|
| `DATABASE_URL` | pooler URL | pooler URL | Full connection string |
| `DB_SSL` | `true` | `true` | Enable SSL for Supabase |
| `NODE_ENV` | `development` | `production` | Affects logging & sync |
| `PORT` | `5000` | `6000` | Server port |
| `FRONTEND_URL` | `http://localhost:3000` | `https://pos.hotelbattasesukhsagar.in` | CORS origin |
| `DB_SYNC` | `false` | `false` | Auto-sync models (use migrations instead) |

---

## 🚀 Deployment to Hostinger VPS

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Backend ready for VPS deployment"
git push origin main
```

### Step 2: SSH into VPS
```bash
ssh root@YOUR_VPS_IP
# or
ssh username@YOUR_VPS_IP
```

### Step 3: Clone Repository
```bash
cd /home
git clone https://github.com/YOUR_USERNAME/Restaurant-Management.git
cd Restaurant-Management/server
```

### Step 4: Install Node.js (if not present)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

node --version  # verify
npm --version
```

### Step 5: Install Dependencies
```bash
npm install --production
```

### Step 6: Create `.env.production` on VPS
```bash
nano .env.production
```

Copy the content from local `.env.production` and paste it. Save (Ctrl+X → Y → Enter).

### Step 7: Test Connection on VPS
```bash
node test-pg-cjs.js
```

Expected: ✅ Connected message

### Step 8: Install & Start with PM2
```bash
# Install PM2 globally
npm install -g pm2

# Start app
pm2 start src/index.js --name "restaurant-api" -c ".env.production"

# Save PM2 config
pm2 startup
pm2 save

# Check status
pm2 status
pm2 logs  # View logs
```

### Step 9: Setup Nginx Reverse Proxy
```bash
# Install Nginx
apt install -y nginx

# Create config
sudo nano /etc/nginx/sites-available/restaurant-api
```

Paste this:
```nginx
server {
    listen 80;
    server_name pos.hotelbattasesukhsagar.in www.pos.hotelbattasesukhsagar.in;

    location / {
        proxy_pass http://localhost:6000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable & test:
```bash
sudo ln -s /etc/nginx/sites-available/restaurant-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 10: Setup SSL with Let's Encrypt
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d pos.hotelbattasesukhsagar.in

# Auto-renew (built-in)
certbot renew --dry-run
```

Test: Visit `https://pos.hotelbattasesukhsagar.in/api` → should show API response

---

## 🔐 Security Checklist

- [ ] `.env` not committed to git (in `.gitignore`)
- [ ] `.env.production` only on VPS, not in repo
- [ ] Supabase password never hardcoded in source (only in .env)
- [ ] API CORS restricted to your frontend domain
- [ ] Nginx SSL enabled (Let's Encrypt cert)
- [ ] Database password changed after project creation
- [ ] VPS firewall allows only ports 80, 443, 22 (SSH)

---

## 📊 Database

**Hosted on**: Supabase (managed PostgreSQL)
**Tables**: menus, staff, inventory, orders, order_items
**User**: postgres
**Database**: postgres
**Connection**: pooler (aws-1-ap-south-1.pooler.supabase.com:6543)

To access database console:
1. Supabase Dashboard → SQL Editor
2. Or use `psql` CLI: `psql -h ... -U postgres -d postgres`

---

## 📞 Useful Commands

```bash
# Check PM2 apps
pm2 list

# View real-time logs
pm2 logs restaurant-api

# Restart app
pm2 restart restaurant-api

# Stop app
pm2 stop restaurant-api

# Update code & restart
cd /home/Restaurant-Management/server
git pull origin main
npm install --production
pm2 restart restaurant-api

# Check server uptime
pm2 show restaurant-api

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## ✅ Deployment Checklist

- [ ] Backend code pushed to GitHub
- [ ] `.gitignore` excludes `.env*` and `node_modules`
- [ ] `npm start` works locally
- [ ] API endpoints respond locally
- [ ] Frontend API URL updated (next step)
- [ ] Code cloned on VPS
- [ ] Dependencies installed on VPS
- [ ] `.env.production` created on VPS
- [ ] Connection test passes on VPS
- [ ] PM2 started successfully
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] API accessible via domain

---

## 🎯 Next Steps

1. **Test locally**: Run `npm start` and verify API works
2. **Update Frontend**: Point `REACT_APP_API_URL=https://pos.hotelbattasesukhsagar.in/api`
3. **Deploy Backend**: Follow VPS deployment steps above
4. **Deploy Frontend**: Build & upload to Vercel/Netlify
5. **Test Full Stack**: Log in via frontend, test orders, etc.

---

## 📚 References

- [Supabase Docs](https://supabase.com/docs)
- [Sequelize Docs](https://sequelize.org)
- [Nginx Docs](https://nginx.org)
- [PM2 Docs](https://pm2.keymetrics.io/)
- [Let's Encrypt / Certbot](https://certbot.eff.org/)
