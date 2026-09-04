# AI Sales Assistant - Dashboard Data Setup Guide

## 🎯 Overview

This guide explains how to configure and use the three data fetching options for the Merchant Dashboard:

- **Option A**: Full real data from API (Production mode)
- **Option B**: Hybrid API with mock fallback (Development mode - **Recommended**)
- **Option C**: Mock data only (UI/UX demonstration mode)

---

## 📊 Data Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Dashboard                        │
│                  (Next.js + React Query)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Data Fetching Strategy
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    Option A      Option B      Option C
    (API Only)   (Hybrid)     (Mock Only)
         │             │             │
         │             │             │
    ┌────▼────┐   ┌───▼────┐   ┌───▼────┐
    │   API   │   │  API   │   │  Mock  │
    │ Backend │   │Backend │   │  Data  │
    └────┬────┘   └───┬────┘   └────────┘
         │             │
         │             │ Fallback
         │             │
    ┌────▼────┐   ┌───▼────┐
    │PostgreSQL│  │  Mock  │
    │ Database │  │  Data  │
    └──────────┘  └────────┘
```

---

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
# Install bcrypt for password hashing
cd apps/api
npm install bcrypt @types/bcrypt

# Generate Prisma client
npm run db:generate
```

### 2. Set Up Database

```bash
# Run database migrations
npm run db:migrate

# Seed with realistic test data
npm run db:seed
```

### 3. Configure Environment Variables

Edit `apps/api/.env`:
```env
NODE_ENV=development
PORT=5000
DATABASE_URL="postgresql://postgres:postgres_secure_password_2026@localhost:5432/ai_sales_assistant?schema=public"
CORS_ORIGIN="http://localhost:3000"
```

Edit `apps/web/.env`:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
NEXT_PUBLIC_STORE_ID="acme-retail"
NEXT_PUBLIC_DATA_SOURCE_MODE="hybrid"  # Options: "api", "hybrid", "mock"
```

### 4. Start the Servers

```bash
# In one terminal - Start API backend
cd apps/api
npm run dev

# In another terminal - Start frontend
cd apps/web
npm run dev
```

---

## ⚙️ Configuration Options

### Option A: Full Real Data (Production Mode)

**Use when**: You have a fully functional database and API backend

**Configuration**:
```env
# apps/web/.env
NEXT_PUBLIC_DATA_SOURCE_MODE="api"
```

**Behavior**:
- ✅ Uses real API data only
- ❌ No fallback to mock data
- ❌ Throws errors on API failures
- 🔄 Retries failed requests 3 times

**Best for**: Production environments with reliable database and API

---

### Option B: Hybrid API with Mock Fallback (Development Mode - **Recommended**)

**Use when**: Developing with real backend but want graceful fallback

**Configuration**:
```env
# apps/web/.env
NEXT_PUBLIC_DATA_SOURCE_MODE="hybrid"
```

**Behavior**:
- ✅ Tries real API first
- ✅ Falls back to mock data on API failure
- ✅ Automatic detection of data source
- 🔄 Retries failed requests once
- 📊 Logs data source in console

**Best for**: Development, testing, and staging environments

**Console Output**:
```
✅ Successfully fetched real data from /dashboard (Option A/B)
⚠️ API fetch failed for /dashboard, falling back to mock data (Option B)
🎭 Using mock data for /dashboard (Option C)
```

---

### Option C: Mock Data Only (UI/UX Demonstration Mode)

**Use when**: Demonstrating UI/UX without backend setup

**Configuration**:
```env
# apps/web/.env
NEXT_PUBLIC_DATA_SOURCE_MODE="mock"
```

**Behavior**:
- ✅ Uses mock data only
- ❌ No API calls made
- ✅ Instant data loading
- 🎭 Simulates network delay for realistic UX

**Best for**: UI/UX demonstrations, frontend development, presentations

---

## 📁 File Structure

### Backend API (`apps/api/`)
```
src/
├── config/
│   └── prisma.config.ts          # Database connection
├── repositories/
│   └── dashboard.repository.ts   # Data access layer
├── services/
│   └── dashboard.service.ts      # Business logic layer
├── controllers/
│   └── dashboard.controller.ts   # HTTP request handlers
├── routes/
│   └── dashboard.routes.ts        # API route definitions
└── server.ts                     # Express server setup

prisma/
├── schema.prisma                 # Database schema
└── seed.ts                       # Test data seeding
```

### Frontend Dashboard (`apps/web/`)
```
src/
├── lib/dashboard/
│   ├── config.ts                 # Data source configuration
│   ├── hooks.ts                  # React Query hooks
│   ├── mock-data.ts              # Mock data fallback
│   └── types.ts                  # TypeScript types
├── components/dashboard/
│   ├── layout/                   # Dashboard layout components
│   ├── widgets/                  # Dashboard widgets
│   ├── charts/                   # Chart components
│   └── shared/                   # Shared components
└── app/dashboard/page.tsx        # Dashboard page
```

---

## 🔌 API Endpoints

### Complete Dashboard Snapshot
```
GET /api/v1/dashboard
Headers: {
  "Content-Type": "application/json",
  "x-store-id": "acme-retail"
}
```

### Individual Components
```
GET /api/v1/dashboard/kpi          # KPI metrics
GET /api/v1/dashboard/revenue      # Revenue data
GET /api/v1/dashboard/orders       # Recent orders
GET /api/v1/dashboard/ai-metrics   # AI performance metrics
```

### Response Format
```json
{
  "success": true,
  "message": "Dashboard snapshot retrieved successfully",
  "data": {
    "merchantName": "Acme Retail",
    "kpis": [...],
    "revenue": [...],
    "orders": [...],
    // ... other dashboard data
  },
  "metadata": {
    "timestamp": "2026-08-30T00:00:00.000Z",
    "requestId": "req_123456",
    "executionMs": 156
  }
}
```

---

## 🧪 Testing Data Flow

### 1. Test Mock Data Mode (Option C)
```bash
# Set environment
export NEXT_PUBLIC_DATA_SOURCE_MODE="mock"

# Start frontend
npm run dev

# Visit http://localhost:3000/dashboard
# You should see: 🎭 Using mock data for /dashboard (Option C)
```

### 2. Test Hybrid Mode (Option B)
```bash
# Set environment
export NEXT_PUBLIC_DATA_SOURCE_MODE="hybrid"

# Start only frontend (no API)
npm run dev

# Visit http://localhost:3000/dashboard
# You should see: ⚠️ API fetch failed, falling back to mock data (Option B)

# Now start API backend
cd apps/api
npm run dev

# Refresh dashboard
# You should see: ✅ Successfully fetched real data from /dashboard (Option A/B)
```

### 3. Test Real API Mode (Option A)
```bash
# Set environment
export NEXT_PUBLIC_DATA_SOURCE_MODE="api"

# Start both API and frontend
# API will fail if backend is not running
```

---

## 📊 Database Schema Overview

### Core Models
- **User**: Authentication and user management
- **Store**: Multi-tenant store management
- **Product**: Product catalog with vector embeddings
- **Customer**: Customer profiles and purchase history
- **Order**: Order management and payment tracking
- **Session**: User session tracking with AI conversations
- **Campaign**: Marketing campaign management
- **Notification**: System notifications

### Key Features
- ✅ Multi-tenant architecture
- ✅ Vector embeddings for AI search
- ✅ AI conversation tracking
- ✅ Real-time session monitoring
- ✅ Payment integration ready
- ✅ Campaign management

---

## 🔧 Troubleshooting

### API Connection Issues
```bash
# Check if API is running
curl http://localhost:5000/health

# Check database connection
cd apps/api
npm run db:studio
```

### Database Issues
```bash
# Reset database
npm run db:migrate reset

# Re-seed data
npm run db:seed
```

### Frontend Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Production Deployment

### 1. Environment Variables
```env
# Production .env
NODE_ENV=production
DATABASE_URL="postgresql://user:password@production-host:5432/dbname"
JWT_SECRET="your-production-secret"
OPENAI_API_KEY="your-openai-key"
RAZORPAY_KEY_ID="your-razorpay-key"
```

### 2. Build Commands
```bash
# Build API
cd apps/api
npm run build

# Build Web
cd apps/web
npm run build
```

### 3. Production Configuration
```env
# Set to Option A for production
NEXT_PUBLIC_DATA_SOURCE_MODE="api"
```

---

## 📈 Performance Optimization

### Caching Strategy
- **Snapshot**: 30 seconds
- **KPI Metrics**: 30 seconds  
- **Revenue Data**: 60 seconds
- **Recent Orders**: 15 seconds
- **AI Metrics**: 45 seconds

### Retry Configuration
- **Option A**: 3 retries with exponential backoff
- **Option B**: 1 retry with 500ms delay
- **Option C**: No retries (mock data)

---

## 🎓 Best Practices

1. **Development**: Use Option B (hybrid) for graceful fallback
2. **Testing**: Use Option C (mock) for UI/UX testing
3. **Production**: Use Option A (api) for real data only
4. **Monitoring**: Check console logs for data source indicators
5. **Error Handling**: Always handle API errors gracefully
6. **Performance**: Use individual component hooks for granular loading

---

## 📞 Support

For issues or questions:
- Check console logs for data source information
- Verify API endpoint availability
- Ensure database is running and seeded
- Check environment variable configuration

---

## ✅ Verification Checklist

- [ ] Database schema updated and migrated
- [ ] Test data seeded successfully
- [ ] API endpoints responding correctly
- [ ] Frontend configured with correct mode
- [ ] Environment variables set properly
- [ ] Both API and frontend running
- [ ] Dashboard loads with data
- [ ] Console shows correct data source
- [ ] All dashboard components rendering
- [ ] Responsive design working

---

**Your Merchant Dashboard is now ready with full real data capabilities!** 🎉