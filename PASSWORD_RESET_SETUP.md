# Password Reset Functionality

This document explains the password reset functionality implemented in the WEVO application using Supabase's built-in authentication system.

> **Note:** This implementation is configured for the deployed application and uses the `/set-password` route as expected by the existing Supabase configuration.

## Overview

The password reset functionality consists of two main pages:
1. **Forgot Password Page** (`/forgot-password`) - Allows users to request a password reset
2. **Set Password Page** (`/set-password`) - Allows users to set a new password

## How It Works

### 1. Request Password Reset
- User enters their email on the forgot password page
- System sends a password reset email using Supabase's `resetPasswordForEmail()` method
- Email contains a secure link with tokens to reset the password

### 2. Reset Password
- User clicks the link in their email
- They are redirected to `/set-password` with tokens in the URL
- System validates the tokens and establishes a session
- User can then set a new password
- After successful reset, user is signed out and redirected to login

## Files Modified/Created

### New Files
- `src/api/auth.js` - Centralized authentication API functions

### Modified Files
- `src/pages/ForgotPasswordPage.jsx` - Updated to use Supabase password reset
- `src/pages/ResetPasswordPage.jsx` - Updated to handle token validation and password update (serves `/set-password` route)

## Environment Configuration

Make sure your Supabase project has the following configured:

### Required Environment Variables
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Dashboard Configuration

1. **Email Templates** (Optional customization):
   - Go to Authentication > Email Templates in Supabase Dashboard
   - Customize the "Reset Password" template if needed
   - Default template will work fine

2. **Site URL Configuration**:
   - Go to Authentication > URL Configuration
   - Add your production domain to Site URL
   - Add `yourdomain.com/set-password` to Redirect URLs

3. **Email Authentication**:
   - Ensure email authentication is enabled
   - SMTP should be configured (Supabase provides default SMTP)

## Usage

### For Users
1. Go to login page
2. Click "Forgot Password?" link
3. Enter email address
4. Check email for reset link
5. Click the link and set new password

### For Developers
```javascript
import { sendPasswordResetEmail, updateUserPassword } from '../api/auth';

// Send reset email
const result = await sendPasswordResetEmail(email);

// Update password (during reset flow)
const updateResult = await updateUserPassword(newPassword);
```

## Security Features

- Uses Supabase's secure token-based reset system
- Tokens expire automatically
- User is signed out after password reset
- Email verification required
- Password validation (minimum 6 characters)

## Testing

1. **Local Testing**:
   - Ensure `redirectTo` URL matches your local development URL
   - Check browser console for any errors
   - Test with a real email address

2. **Production Testing**:
   - Update redirect URLs in Supabase dashboard
   - Test with production domain
   - Verify email delivery

## Troubleshooting

### Common Issues

1. **Email not received**:
   - Check spam folder
   - Verify email exists in your user database
   - Check Supabase SMTP configuration

2. **Invalid token error**:
   - Token may have expired
   - URL may be malformed
   - User might have already reset password

3. **Redirect issues**:
   - Check URL configuration in Supabase dashboard
   - Verify `redirectTo` parameter in code

### Error Messages
- "Invalid or expired password reset link" - Token issues
- "Passwords do not match" - Frontend validation
- "Password must be at least 6 characters" - Length validation

## API Reference

### `sendPasswordResetEmail(email)`
Sends password reset email to user.

**Parameters:**
- `email` (string) - User's email address

**Returns:**
- `{success: boolean, error?: string}`

### `updateUserPassword(newPassword)`
Updates user's password during reset flow.

**Parameters:**
- `newPassword` (string) - New password

**Returns:**
- `{success: boolean, error?: string}`

### `setPasswordResetSession(accessToken, refreshToken)`
Establishes session from reset tokens.

**Parameters:**
- `accessToken` (string) - Access token from URL
- `refreshToken` (string) - Refresh token from URL

**Returns:**
- `{success: boolean, session?: object, error?: string}`