# Frontend Mocks

This folder contains mock data files that act as a fake backend database for the React frontend. 

## When to use these mocks?
1. **Local Development**: When the backend server is down, or you don't have MongoDB running locally, you can use these mocks to still work on the UI components.
2. **Prototyping**: If you are building a new page (e.g., a Recommendations page) and the backend API hasn't been built yet, you can create a mock file here to simulate the data.

## How to "run" or use them?
Mocks do not need to be "run" from the terminal. Instead, you import them directly into your frontend API service files.

**Example: Simulating an API call in `src/services/jobsApi.js`**
Instead of using `axios.get('/api/jobs')`, you can return the mock data directly:

```javascript
import { mockJobs } from "../mocks/jobs.mock";

export const getJobs = async () => {
  // Simulate a 500ms network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return the mock data instead of calling the real backend
  return mockJobs;
};
```

When you start your React app using `npm run dev`, it will automatically consume this mock data!
