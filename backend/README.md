# ScoopSocials Backend

Production-ready Node.js/Express backend for the ScoopSocials social verification platform.

## 🚀 Quick Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Redis 6+

### 1. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

## 📋 Required External Services

### Twilio (SMS Verification)
1. Sign up at https://www.twilio.com/
2. Get Account SID, Auth Token, and Phone Number
3. Add to `.env`:
```
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### AWS S3 (File Storage)
1. Create AWS account and S3 bucket
2. Create IAM user with S3 permissions
3. Add to `.env`:
```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_bucket_name
AWS_REGION=us-east-1
```

### Stripe (Payments)
1. Create Stripe account
2. Get API keys from dashboard
3. Add to `.env`:
```
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### PostgreSQL Database
```
DATABASE_URL="postgresql://username:password@localhost:5432/scoopsocials"
```

### Redis Cache
```
REDIS_URL="redis://localhost:6379"
```

## 🔧 Configuration

### Environment Variables (.env)
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/scoopsocials"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
REFRESH_TOKEN_SECRET="your-refresh-token-secret"

# Server
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"

# SMS (Twilio)
TWILIO_ACCOUNT_SID="your-account-sid"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="your-phone-number"

# Email
EMAIL_HOST="smtp.gmail.com"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Redis
REDIS_URL="redis://localhost:6379"

# AWS S3
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_S3_BUCKET="your-bucket-name"

# Stripe
STRIPE_SECRET_KEY="sk_test_your-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
```

## 🏗️ Database Schema

The backend uses Prisma ORM with PostgreSQL. Key entities:

- **Users** - User accounts with trust scores and professional layers
- **Posts** - User reviews and content with categories
- **Events** - Social events with RSVP system
- **FriendConnections** - Friend relationships and requests
- **SocialAccounts** - Connected social media accounts
- **Flags** - Content and account flagging system
- **Notifications** - Real-time notifications
- **Subscriptions** - Payment and account tiers

## 📡 API Endpoints

### Authentication
- `POST /api/auth/send-verification` - Send SMS verification code
- `POST /api/auth/verify-phone` - Verify phone number
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login with phone
- `POST /api/auth/refresh` - Refresh JWT tokens
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/:id` - Get user by ID
- `POST /api/users/search` - Search users
- `GET /api/users/:id/trust-score` - Get trust score breakdown
- `GET /api/users/recommendations` - Get friend recommendations

### Posts & Events
- `GET /api/posts` - Get posts feed
- `POST /api/posts` - Create post
- `GET /api/events` - Get events
- `POST /api/events` - Create event

### Friends & Social
- `POST /api/friends/request` - Send friend request
- `POST /api/friends/respond` - Accept/decline request
- `GET /api/friends` - Get friends list

### Flags & Moderation
- `POST /api/flags` - Submit flag
- `GET /api/moderator/flags` - Get flags for review (moderators)
- `POST /api/moderator/flags/:id/action` - Take moderator action

## 🔐 Security Features

- JWT authentication with refresh tokens
- Phone number verification via SMS
- Rate limiting on all endpoints
- Input validation with Zod schemas
- SQL injection protection via Prisma
- XSS protection with helmet
- CORS configuration
- Redis-based session management

## 🎯 Trust Score System

Multi-factor trust calculation:
- Social Media Verification (20%)
- Community Network (20%)
- Platform Activity (15%)
- Content Quality (15%)
- Time Investment (10%)
- Comment Engagement (10%)
- Event Participation (5%)
- Validation Accuracy (5%)

## 🏢 Professional Account Features

- Dual-layer profile system
- Friend categorization (professional vs personal)
- Content filtering based on relationship
- Business analytics (Venue accounts)
- Enhanced event management

## 🚦 Flag Management System

- Category-based flagging
- Trust score-based daily limits
- Automatic priority assignment
- Moderator review workflow
- Appeal system

## 📱 Real-time Features

WebSocket support for:
- Live notifications
- Friend request alerts
- Event updates
- Trust score changes

## 🧪 Development

### Running Tests
```bash
npm test
```

### Database Operations
```bash
# View database in browser
npm run db:studio

# Reset database
npm run db:migrate -- --reset

# Generate new migration
npx prisma migrate dev --name description
```

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Docker Deployment
```bash
docker build -t scoopsocials-backend .
docker run -p 3001:3001 scoopsocials-backend
```

### Environment Variables for Production
Ensure all environment variables are properly set in your production environment, especially:
- `NODE_ENV=production`
- Strong JWT secrets
- Production database URL
- Real service API keys

## 📊 Monitoring

The backend includes:
- Winston logging
- Performance monitoring
- Error tracking
- Health check endpoint (`/health`)

## 🆘 Support

For issues:
1. Check logs in `/logs` directory
2. Verify environment variables
3. Ensure all external services are configured
4. Check database connectivity

## 🔄 API Integration with Frontend

The backend is designed to work seamlessly with the existing ScoopSocials frontend. Update your frontend API calls to point to `http://localhost:3001/api` (development) or your production URL.

Example frontend integration:
```javascript
// Replace fake data calls with real API calls
const response = await fetch('http://localhost:3001/api/users/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  }
});
```