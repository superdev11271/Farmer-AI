# References Feature

## Overview
The References feature allows users to manage prompt templates for the invoice automation system. Users can create, read, update, and delete prompt references that can be used for document processing.

## Features Added

### Backend API
- **GET /api/prompts** - Retrieve all prompts
- **GET /api/prompts/{id}** - Retrieve a specific prompt
- **POST /api/prompts** - Create a new prompt
- **PUT /api/prompts/{id}** - Update an existing prompt
- **DELETE /api/prompts/{id}** - Delete a prompt

### Frontend
- **References Page** - Full CRUD interface for managing prompts
- **Sidebar Navigation** - Added "References" item with BookOpen icon
- **Modal Interface** - Clean modal for creating/editing prompts
- **Responsive Design** - Works on both desktop and mobile

## Database Model
The Prompt model includes:
- `id` - Primary key
- `text` - The prompt text content
- `created_at` - Timestamp of creation

## Usage
1. Navigate to the References page from the sidebar
2. Click "Add Prompt" to create a new prompt
3. Use the edit/delete buttons to manage existing prompts
4. All changes are automatically saved to the database

## Technical Details
- Backend: Flask with SQLAlchemy
- Frontend: React with Tailwind CSS
- Authentication: JWT-based authentication required for all operations
- API Base URL: http://localhost:9004/api
