# Environment Setup Guide

## Frontend Environment Variables

To use environment variables instead of hardcoded URLs, create a `.env` file in the `frontend` directory with the following content:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:9004
```

## How to Create the .env File

### Option 1: Using Command Line
```bash
cd frontend
echo VITE_API_BASE_URL=http://localhost:9004 > .env
```

### Option 2: Manual Creation
1. Navigate to the `frontend` directory
2. Create a new file named `.env`
3. Add the following content:
   ```
   VITE_API_BASE_URL=http://localhost:9004
   ```

## Environment Variables Explained

- `VITE_API_BASE_URL`: The base URL for your backend API
  - Development: `http://localhost:9004`
  - Production: `https://your-api-domain.com`
  - Staging: `https://staging-api-domain.com`

## Important Notes

1. **Vite Prefix**: Environment variables in Vite must be prefixed with `VITE_` to be accessible in the frontend code.

2. **Fallback**: If the environment variable is not set, the application will fall back to `http://localhost:9004`.

3. **Security**: Never commit `.env` files to version control. Add `.env` to your `.gitignore` file.

4. **Restart Required**: After creating or modifying the `.env` file, restart your development server.

## Files Updated

The following files have been updated to use environment variables:

- `frontend/src/config/api.js` - API configuration with environment variable support
- `frontend/src/pages/References.jsx` - Updated to use API config
- `frontend/src/contexts/AuthContext.jsx` - Updated to use API config

## Usage

Once the `.env` file is created, the application will automatically use the configured API URL instead of hardcoded values.
