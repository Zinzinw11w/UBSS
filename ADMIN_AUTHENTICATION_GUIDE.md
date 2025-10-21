# Admin Authentication System Implementation

## Overview
This document describes the implementation of a robust authentication system for the Admin Panel, featuring password authentication and Time-based One-Time Password (TOTP) 2FA using authenticator apps like Google Authenticator or Authy.

## Features Implemented

### 1. Password Authentication
- Secure login form with username and password
- Password hashing using SHA-256
- Session token generation
- Protected admin routes

### 2. Two-Factor Authentication (2FA)
- TOTP secret key generation using `otplib`
- QR code generation for easy setup
- Manual secret key entry as backup
- Recovery codes for account recovery
- Encrypted storage of sensitive data

### 3. Security Features
- Encrypted storage of 2FA secrets and recovery codes
- Session-based authentication
- Automatic logout on invalid sessions
- Recovery code consumption (one-time use)

## File Structure

### Components
- `src/components/AdminLogin.js` - Main login component with 2FA flow
- `src/components/ProtectedAdminRoute.js` - Route protection wrapper
- `src/components/CreateAdminUser.js` - Initial admin user creation utility

### Services
- `src/services/database.js` - Admin authentication functions added

### Routes
- `/admin/login` - Admin login page
- `/admin/create` - Create initial admin user
- `/admin` - Protected admin panel

## Database Schema

### Admins Collection
```javascript
{
  username: string,           // Admin username
  email: string,              // Admin email
  password: string,           // SHA-256 hashed password
  role: 'admin',             // User role
  twoFactorEnabled: boolean,  // 2FA status
  twoFactorSecret: string,    // Encrypted TOTP secret
  recoveryCodes: string[],   // Encrypted recovery codes
  createdAt: timestamp,      // Account creation time
  lastLogin: timestamp,      // Last login time
  isActive: boolean          // Account status
}
```

## Authentication Flow

### 1. Initial Setup
1. Navigate to `/admin/create`
2. Create initial admin user with default credentials
3. Login at `/admin/login` with created credentials

### 2. First Login (No 2FA)
1. Enter username and password
2. System verifies credentials
3. If 2FA not enabled, login directly to admin panel

### 3. 2FA Setup (First Time)
1. After password verification, system detects no 2FA
2. Admin can choose to setup 2FA
3. System generates TOTP secret and QR code
4. Admin scans QR code with authenticator app
5. Admin enters 6-digit code to verify setup
6. System enables 2FA and provides recovery codes

### 4. Subsequent Logins (With 2FA)
1. Enter username and password
2. System verifies credentials
3. If 2FA enabled, prompt for 6-digit code
4. Admin enters code from authenticator app
5. System verifies TOTP code
6. If valid, login to admin panel

### 5. Recovery Process
1. If admin loses device, can use recovery codes
2. Enter one of the provided recovery codes
3. System verifies and consumes the code
4. Admin gains access to admin panel

## Security Considerations

### Encryption
- All sensitive data (2FA secrets, recovery codes) are encrypted using AES encryption
- Encryption key should be set in environment variables (`REACT_APP_ENCRYPTION_KEY`)

### Password Security
- Passwords are hashed using SHA-256
- Consider upgrading to bcrypt for production use

### Session Management
- Session tokens are generated using crypto-random values
- Tokens are stored in localStorage (consider upgrading to httpOnly cookies)

### Recovery Codes
- Recovery codes are single-use and consumed after verification
- 10 recovery codes are generated initially
- Codes should be stored securely by the admin

## Usage Instructions

### For Administrators

#### Initial Setup
1. Navigate to `http://localhost:3000/admin/create`
2. Create the initial admin user
3. Note the default credentials provided
4. Navigate to `http://localhost:3000/admin/login`
5. Login with the created credentials

#### Setting Up 2FA
1. After first login, you'll be prompted to setup 2FA
2. Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
3. Enter the 6-digit code from your app
4. Save the recovery codes in a secure location
5. 2FA is now enabled for your account

#### Daily Login Process
1. Go to `http://localhost:3000/admin/login`
2. Enter your username and password
3. Enter the 6-digit code from your authenticator app
4. Access the admin panel

#### If You Lose Your Device
1. Use one of your recovery codes during login
2. The used recovery code will be consumed
3. Consider setting up 2FA again with a new device

### For Developers

#### Environment Variables
Set the following environment variable for encryption:
```bash
REACT_APP_ENCRYPTION_KEY=your-secure-encryption-key-here
```

#### Firestore Rules
The Firestore rules have been updated to allow admin access:
- Admin collection is protected by role-based access
- Admins can access all collections for management purposes

#### Adding New Admin Users
Use the `createAdminUser` function in `database.js`:
```javascript
import { createAdminUser } from './services/database';

const newAdmin = await createAdminUser(
  'newadmin',      // username
  'securepass',    // password
  'admin@domain.com' // email
);
```

## Dependencies Added
- `otplib` - TOTP implementation
- `qrcode.react` - QR code generation
- `crypto-js` - Encryption utilities

## Testing the Implementation

### Test Cases
1. **Initial Admin Creation**: Verify admin user can be created
2. **Password Authentication**: Test login with correct/incorrect passwords
3. **2FA Setup**: Verify QR code generation and TOTP verification
4. **2FA Login**: Test login flow with 2FA enabled
5. **Recovery Codes**: Test recovery code usage
6. **Session Management**: Test automatic logout on invalid sessions
7. **Route Protection**: Verify admin routes are protected

### Manual Testing Steps
1. Create admin user at `/admin/create`
2. Login at `/admin/login`
3. Setup 2FA if prompted
4. Test subsequent logins with 2FA
5. Test recovery code usage
6. Verify admin panel access

## Production Considerations

### Security Enhancements
1. **Upgrade Password Hashing**: Use bcrypt instead of SHA-256
2. **Session Management**: Implement server-side session storage
3. **Rate Limiting**: Add login attempt rate limiting
4. **Audit Logging**: Log all admin actions
5. **Environment Variables**: Use secure environment variable management

### Monitoring
1. **Failed Login Attempts**: Monitor and alert on suspicious activity
2. **2FA Usage**: Track 2FA adoption rates
3. **Recovery Code Usage**: Monitor recovery code consumption

### Backup and Recovery
1. **Admin Account Recovery**: Implement process for admin account recovery
2. **Database Backups**: Regular backups of admin data
3. **Disaster Recovery**: Plan for admin access during system outages

## Troubleshooting

### Common Issues
1. **QR Code Not Scanning**: Verify authenticator app compatibility
2. **TOTP Code Invalid**: Check device time synchronization
3. **Recovery Codes Not Working**: Verify codes haven't been used
4. **Session Expired**: Clear localStorage and login again

### Debug Information
- Check browser console for authentication errors
- Verify Firestore rules are properly deployed
- Ensure environment variables are set correctly

## Conclusion

The admin authentication system provides robust security with password authentication and TOTP 2FA. The implementation follows security best practices and provides a user-friendly experience for administrators while maintaining high security standards.

For production deployment, consider the security enhancements mentioned above and implement proper monitoring and logging systems.
