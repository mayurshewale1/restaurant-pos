# PostgreSQL Setup Guide

## Step 1: Install PostgreSQL

### Windows
1. Download PostgreSQL from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Run the installer
3. Remember the password you set for the `postgres` user
4. Default port is `5432`

### macOS
```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

---

## Step 2: Create Database

### Option A: Using psql (Command Line)
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE restaurant_management;

# Create user (optional, or use postgres user)
CREATE USER restaurant_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE restaurant_management TO restaurant_user;

# Exit
\q
```

### Option B: Using pgAdmin (GUI)
1. Open pgAdmin
2. Right-click on "Databases" → "Create" → "Database"
3. Name: `restaurant_management`
4. Click "Save"

---

## Step 3: Install Node.js Dependencies

```bash
cd server
npm install
```

This will install:
- `pg` - PostgreSQL client
- `sequelize` - ORM for PostgreSQL
- `sequelize-cli` - CLI tools

---

## Step 4: Configure Environment Variables

1. Copy the example env file:
```bash
cp .env.example .env
```

2. Edit `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=restaurant_management
DB_USER=postgres
DB_PASSWORD=your_actual_password
```

---

## Step 5: Test Connection

Run the server:
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

## Step 6: Verify Tables Created

### Using psql:
```bash
psql -U postgres -d restaurant_management

# List tables
\dt

# View orders table structure
\d orders

# View order_items table structure
\d order_items

# Exit
\q
```

### Using pgAdmin:
1. Open pgAdmin
2. Navigate to: restaurant_management → Schemas → public → Tables
3. You should see: `orders` and `order_items`

---

## Cloud Hosting (Optional)

### Supabase (Recommended - Free Tier)
1. Go to [supabase.com](https://supabase.com)
2. Sign up and create a new project
3. Go to Settings → Database
4. Copy the connection string
5. Update `.env`:
```env
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
```

### DigitalOcean
1. Create Managed Database → PostgreSQL
2. Get connection details
3. Update `.env` with host, port, database, user, password

### AWS RDS
1. Create RDS PostgreSQL instance
2. Get endpoint from AWS Console
3. Update `.env`

---

## Troubleshooting

### Error: "password authentication failed"
- Check your `.env` file password matches PostgreSQL password
- Reset PostgreSQL password: `ALTER USER postgres PASSWORD 'newpassword';`

### Error: "database does not exist"
- Create database: `CREATE DATABASE restaurant_management;`

### Error: "connection refused"
- Check PostgreSQL is running: `pg_isready` or check services
- Check port (default: 5432)
- Check firewall settings

### Error: "role does not exist"
- Create user or use `postgres` user
- Grant privileges: `GRANT ALL PRIVILEGES ON DATABASE restaurant_management TO your_user;`

---

## Next Steps

Once connected, you can:
1. ✅ Start using the API
2. ✅ Models will auto-create tables (development)
3. ✅ For production, use migrations instead of sync

---

## Production Best Practices

1. **Don't use DB_SYNC in production**
2. **Use migrations** (`npx sequelize-cli migration:generate`)
3. **Set up connection pooling** (already configured)
4. **Enable SSL** for cloud databases
5. **Backup regularly**

---

## Need Help?

If you encounter issues:
1. Check `.env` file is correct
2. Verify PostgreSQL is running
3. Test connection: `psql -U postgres -d restaurant_management`
4. Check server logs for specific errors
