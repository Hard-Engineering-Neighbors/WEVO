# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Project Features

- **Authentication**: Uses Supabase for authentication with email/password and 2FA (OTP via email).
- **Protected Routing**: Users cannot access dashboard, venues, or requests unless logged in. When logged in, users cannot access login, 2FA, or landing pages (even with browser navigation).
- **Session Security**: Logging out clears all session data and prevents access to protected pages until re-authenticated.
- **Login Flow**: Credentials are checked before sending a 2FA code. Users are locked out for 1 minute after 7 failed login attempts.
- **Modern UI**: Built with React, Tailwind CSS, and Lucide icons.

## Routing and Navigation

- All protected routes are wrapped in a `PrivateRoute` component.
- Navigation is enforced using both React Router's `<Navigate replace />` and browser history manipulation to prevent back/forward access to restricted pages.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

**For backend/API integration instructions, see `README_BACKEND.md`.**
