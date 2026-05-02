# 🔒 Security Documentation

## Current Security Features

### 1. **Authentication & Authorization**
- ✅ JWT-based authentication with 7-day expiration
- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ Role-based access control (user/admin)
- ✅ Protected routes with middleware (`authenticate`, `requireAdmin`)

### 2. **Rate Limiting**
- ✅ General API: 100 requests per 15 minutes per IP
- ✅ Auth endpoints: 10 requests per 15 minutes per IP
- ✅ Prevents brute force attacks and API abuse

### 3. **Security Headers (Helmet.js)**
- ✅ Content Security Policy (CSP)
- ✅ X-DNS-Prefetch-Control
- ✅ X-Frame-Options (clickjacking protection)
- ✅ X-Powered-By hidden
- ✅ Strict-Transport-Security (HSTS)
- ✅ X-Content-Type-Options
- ✅ Referrer-Policy

### 4. **NoSQL Injection Protection**
- ✅ `express-mongo-sanitize` - removes `$` and `.` operators
- ✅ Mongoose schema validation
- ✅ Logs sanitized attempts

### 5. **HTTP Parameter Pollution (HPP)**
- ✅ `hpp` middleware prevents parameter pollution attacks
- ✅ Whitelist for legitimate array parameters

### 6. **Input Validation & Sanitization**
- ✅ XSS prevention via HTML escaping
- ✅ Email normalization
- ✅ Password strength requirements (6+ chars, 1 letter, 1 number)
- ✅ Request body size limit (10KB)
- ✅ Trim whitespace from inputs

### 7. **CORS Configuration**
- ✅ Restricted to specific origin (FRONTEND_URL)
- ✅ Credentials enabled for cookies/auth headers
- ✅ Limited HTTP methods
- ✅ Specific allowed headers

### 8. **Error Handling**
- ✅ No stack traces in production
- ✅ Generic error messages to prevent info leakage
- ✅ Detailed logging on server

### 9. **Payment Security**
- ✅ **Server-Side Price Calculation**: Secure endpoints calculate totals from trusted product catalog
- ✅ **Cart Validation**: Inventory checked before payment processing
- ✅ **Legacy Endpoint Restriction**: Endpoints accepting frontend amounts are **disabled in production**

#### Secure Payment Endpoints (Production Safe)
These endpoints calculate order totals server-side from the trusted product catalog:
- `POST /create-checkout-session` - Stripe checkout with server-calculated amount
- `POST /braintree/checkout-with-cart` - Braintree checkout with server-calculated amount
- `POST /confirm-payment` - Payment validation before order creation

#### ⚠️ Development-Only Legacy Endpoints
These endpoints accept amounts from the frontend (security risk) and are **automatically disabled in production**:
- `POST /create-payment-intent` - ⚠️ Accepts amount from frontend
- `POST /braintree/checkout` - ⚠️ Accepts amount from frontend

The legacy endpoints are restricted to `NODE_ENV !== "production"` to prevent price tampering attacks.

---

## 🚨 Production Security Checklist

### HTTPS (CRITICAL)
**Current:** HTTP only (localhost development)
**Required for Production:**

```javascript
// Option 1: Use a reverse proxy (Nginx, Apache)
// Nginx config:
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:4242;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

// Option 2: Direct HTTPS in Node.js (not recommended for production)
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('path/to/key.pem'),
  cert: fs.readFileSync('path/to/cert.pem')
};

https.createServer(options, app).listen(443);
```

### Environment Variables (.env)
```bash
# Required for Production
NODE_ENV=production
JWT_SECRET=your-super-secret-random-string-min-32-chars
FRONTEND_URL=https://yourdomain.com
MONGODB_URI=mongodb+srv://...
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=super-secure-password

# Stripe (use live keys in production)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Optional but recommended
TRUST_PROXY=true  # If behind reverse proxy
```

### Additional Production Hardening

1. **Cookie Security** (if using cookies instead of localStorage)
   ```javascript
   res.cookie('token', token, {
     httpOnly: true,
     secure: true,      // HTTPS only
     sameSite: 'strict',
     maxAge: 7 * 24 * 60 * 60 * 1000
   });
   ```

2. **Database Security**
   - ✅ Use MongoDB Atlas with IP whitelist
   - ✅ Enable MongoDB authentication
   - ✅ Use strong database passwords
   - ✅ Regular database backups

3. **Additional Headers**
   Consider adding in production:
   ```javascript
   app.use((req, res, next) => {
     res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
     res.setHeader('X-Download-Options', 'noopen');
     res.setHeader('Surrogate-Control', 'no-store');
     res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
     res.setHeader('Pragma', 'no-cache');
     res.setHeader('Expires', '0');
     next();
   });
   ```

4. **Monitoring & Logging**
   - Use services like Sentry for error tracking
   - Enable request logging (e.g., morgan with winston)
   - Set up alerts for suspicious activity

5. **Regular Updates**
   ```bash
   npm audit
   npm update
   ```

---

## 🔍 Security Testing

### Test Rate Limiting
```bash
curl -X POST http://localhost:4242/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}'
# Repeat 10+ times - should get "Too many requests"
```

### Test NoSQL Injection
```bash
curl -X POST http://localhost:4242/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": {"$gt": ""}, "password": "test"}'
# Should be sanitized and fail safely
```

### Test XSS Prevention
```bash
curl -X POST http://localhost:4242/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123","name":"<script>alert(1)</script>"}'
# Script tags should be escaped
```

---

## 📊 Security Headers Verification

Run this to verify headers:
```bash
curl -I http://localhost:4242/health
```

Expected headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy: ...`
- `X-DNS-Prefetch-Control: off`

---

## 🛡️ Vulnerability Status

| Vulnerability | Status | Protection |
|--------------|--------|------------|
| Brute Force | ✅ Mitigated | Rate limiting |
| NoSQL Injection | ✅ Mitigated | mongo-sanitize + validation |
| XSS | ✅ Mitigated | Helmet CSP + input escaping |
| Clickjacking | ✅ Mitigated | X-Frame-Options |
| HPP | ✅ Mitigated | hpp middleware |
| Information Leakage | ✅ Mitigated | Error handling + helmet |
| Payment Tampering | ✅ Mitigated | Server-side calculation, legacy endpoints disabled in prod |
| CSRF | ⚠️ Low Risk | JWT in localStorage (stateless) |
| MITM | ❌ Requires HTTPS | **Enable HTTPS in production** |

---

## 📝 Last Updated
May 2026

## 🔄 Next Steps for Production
1. [ ] Enable HTTPS with valid SSL certificate
2. [ ] Set up reverse proxy (Nginx)
3. [ ] Configure MongoDB Atlas with auth
4. [ ] Set up monitoring (Sentry, LogRocket)
5. [ ] Regular security audits (`npm audit`)
6. [ ] Backup strategy for database
