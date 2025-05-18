# Backend Integration Guide

Welcome, backend developer! This project is set up to make it easy to connect to your backend API. Please follow the instructions below to integrate your endpoints and make the app fully functional.

## 1. Data Flow Overview

- **All data is currently loaded from static files in `/src/data/`**.
- **API abstraction functions** are in `/src/api/` (e.g., `fetchVenues`, `fetchRequests`).
- **Pages** use these API functions with React hooks (`useEffect`, `useState`).

## 2. Where to Integrate Your API

- **Replace the dummy data in `/src/api/venues.js` and `/src/api/requests.js`** with real API calls (e.g., using `fetch` or `axios`).
- The UI will automatically update to use your backend data.

### Example: Replace Dummy Data with API Call

```js
// src/api/venues.js
// import venues from "../data/venues";

export async function fetchVenues() {
  // TODO: Replace with your real API endpoint
  const response = await fetch("https://your-backend.com/api/venues");
  if (!response.ok) throw new Error("Failed to fetch venues");
  return response.json();
}
```

## 3. Data Structure

- **Venues** (see `/src/data/venues.js` for structure):
  ```js
  {
    name: "WVSU Cultural Center",
    description: "...",
    participants: 400,
    image: "url-or-path"
  }
  ```
- **Requests** (see `/src/data/requests.js` for structure):
  ```js
  {
    venue: "WVSU Cultural Center",
    image: "url-or-path",
    event: "Himig at Hiwaga 2025",
    type: "Seminar",
    date: "April 10, 2021 7:30 AM - April 11, 2021 5:30 PM"
  }
  ```

## 4. Notes

- **Image URLs:** You can return either a public URL or a relative path. If serving from backend, ensure CORS and static file serving are set up.
- **Error Handling:** The UI expects a resolved promise. Handle errors gracefully in your API functions.
- **Authentication:** If your API requires authentication, add the logic in the API abstraction files.

## 5. Next Steps

- Replace the dummy data in `/src/api/` with your real API endpoints.
- Test the UI to ensure data loads and displays correctly.
- If you change the data structure, update the UI components accordingly.

---

**If you have any questions, please contact the frontend team!**
