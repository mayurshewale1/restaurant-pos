# PostgreSQL Setup - Quick Start Guide

## ✅ Step 1: Install PostgreSQL

### Windows
1. Download from: https://www.postgresql.org/download/windows/
2. Run installer, remember the `postgres` user password
3. Default port: `5432`

### macOS
```bash
brew install postgresql
brew services start postgresql
```

### Linux
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## ✅ Step 2: Create Database

Open terminal/command prompt and run:

```bash
# Connect to PostgreSQL
psql -U postgres

# In PostgreSQL prompt:
CREATE DATABASE restaurant_management;

# Exit PostgreSQL
\q
```

---

## ✅ Step 3: Install Dependencies

```bash
cd server
npm install
```

This installs:
- `pg` - PostgreSQL client
- `sequelize` - ORM for PostgreSQL
- `sequelize-cli` - CLI tools

---

## ✅ Step 4: Configure Environment

1. Create `.env` file in `server/` folder:

```bash
# Windows (Command Prompt)
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

2. Edit `.env` file and add your PostgreSQL password:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurant_management
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
```

**Replace `your_postgres_password_here` with the password you set during PostgreSQL installation.**

---

## ✅ Step 5: Test Connection

```bash
npm run test:db
```

You should see:
```
✅ SUCCESS: Database connection test passed!
```

---

## ✅ Step 6: Start Server

```bash
npm run dev
```

You should see:
```
✅ Connected to PostgreSQL database
✅ Database models synchronized
Server running on port 5000
```

---

## 🎉 Done!

Your PostgreSQL setup is complete! The tables (`orders` and `order_items`) will be automatically created.

---

## Verify Tables Created

```bash
psql -U postgres -d restaurant_management

# List tables
\dt

# View orders structure
\d orders

# Exit
\q
```

---

## Troubleshooting

### ❌ Error: "password authentication failed"
- Check `.env` file - password must match PostgreSQL password
- Try resetting: `ALTER USER postgres PASSWORD 'newpassword';`

### ❌ Error: "database does not exist"
- Create it: `CREATE DATABASE restaurant_management;`

### ❌ Error: "connection refused"
- Check if PostgreSQL is running:
  - Windows: Check Services (search "services.msc")
  - macOS: `brew services list`
  - Linux: `sudo systemctl status postgresql`

### ❌ Error: "role does not exist"
- Use `postgres` user (default)
- Or create user: `CREATE USER your_user WITH PASSWORD 'password';`

---

## Need Help?

Check the detailed guide: `POSTGRESQL_SETUP.md`
