# WEVO App

WEVO App is a modern web application built with React and Vite. It features user authentication, protected routing, and a clean user interface. This project provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Features

- **Authentication**: Uses Supabase for authentication with email/password and 2FA (OTP via email).
- **Protected Routing**: Users cannot access dashboard, venues, or requests unless logged in.
- **Session Security**: Logging out clears all session data and prevents access to protected pages until re-authenticated.
- **Login Flow**: Credentials are checked before sending a 2FA code.
- **Modern UI**: Built with React, Tailwind CSS, and Lucide icons.
- **Data Handling**: Demonstrates loading data from static files and provides a clear path for backend API integration.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router
- **Backend Integration**: Supabase (for authentication)
- **Linting**: ESLint
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (latest LTS version recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd wevoapp
    ```
3.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

This will start the Vite development server, typically at `http://localhost:5173`.

### Building for Production

```bash
npm run build
# or
yarn build
```

This command builds the application for production in the `dist` folder.

## Available Scripts

In the project directory, you can run:

- `npm run dev` or `yarn dev`: Runs the app in development mode.
- `npm run build` or `yarn build`: Builds the app for production.
- `npm run lint` or `yarn lint`: Lints the project files using ESLint.
- `npm run preview` or `yarn preview`: Serves the production build locally for preview.

## Backend Integration

This project is set up for easy integration with a backend API.

- **Data Flow**: Currently, all data is loaded from static files located in `/src/data/`.
- **API Abstraction**: Functions for API calls (e.g., `fetchVenues`, `fetchRequests`) are located in `/src/api/`.
- **Integration Points**: To connect your backend, replace the dummy data logic in `/src/api/venues.js` and `/src/api/requests.js` with your actual API calls (e.g., using `fetch` or `axios`). The UI will then automatically use your backend data.

### Example: Replacing Dummy Data with an API Call

```javascript
// src/api/venues.js
// import venues from "../data/venues"; // Remove or comment out this line

export async function fetchVenues() {
  // TODO: Replace with your real API endpoint
  const response = await fetch("https://your-backend.com/api/venues");
  if (!response.ok) throw new Error("Failed to fetch venues");
  return response.json();
}
```

### Data Structure Examples

- **Venues** (refer to `/src/data/venues.js` for the expected structure):
  ```javascript
  {
    name: "WVSU Cultural Center",
    description: "A spacious venue suitable for large events.",
    participants: 400,
    image: "url-or-path-to-image"
  }
  ```
- **Requests** (refer to `/src/data/requests.js` for the expected structure):
  ```javascript
  {
    venue: "WVSU Cultural Center",
    image: "url-or-path-to-image",
    event: "Himig at Hiwaga 2025",
    type: "Seminar",
    date: "April 10, 2021 7:30 AM - April 11, 2021 5:30 PM"
  }
  ```

**Notes for Backend Integration:**

- **Image URLs**: You can return either a public URL or a relative path. If serving images from your backend, ensure CORS and static file serving are correctly configured.
- **Error Handling**: The UI expects API functions to return a resolved promise with data or throw an error if the fetch fails. Implement graceful error handling in your API integration functions.
- **Authentication**: If your API requires authentication, incorporate the necessary logic (e.g., sending tokens) within the API abstraction files.

For more detailed backend instructions, see `README_BACKEND.md`.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.
(Consider adding guidelines for code style, commit messages, etc.)

## License

This project is currently unlicensed. Please add a license file (e.g., MIT, Apache 2.0) if you intend to share or distribute this code.
