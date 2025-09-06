# Invoice Automation System

A modern, beautiful invoice automation system built with Flask backend and React frontend. This system provides a comprehensive solution for processing, managing, and analyzing invoice documents with a focus on beautiful UI/UX and powerful functionality.

## 🚀 Features

### Authentication System
- **User Registration & Login**: Secure JWT-based authentication
- **Password Security**: Bcrypt password hashing
- **Protected Routes**: Role-based access control

### Beautiful Dashboard
- **Modern UI Design**: Clean, responsive interface with Tailwind CSS
- **Interactive Charts**: Line and bar charts using Recharts
- **Statistics Cards**: Real-time metrics and KPIs
- **Recent Activity Table**: Latest invoice processing status
- **Quick Actions**: Easy access to common tasks

### Document Categorization System
- **Category Management**: Create, edit, and delete document categories
- **Subcategory Support**: Add multiple subcategories to each category
- **User-Specific Categories**: Each user manages their own categorization
- **CSV Export**: Export category structure for external use
- **Flexible Structure**: Adaptable to any document classification needs

### Invoice Management (Coming Soon)
- **PDF Upload & Processing**: AI-powered invoice extraction
- **Data Validation**: Automated error checking and validation
- **Export Functionality**: Excel/CSV export capabilities
- **Search & Filter**: Advanced search and filtering options

## 🛠️ Tech Stack

### Backend
- **Flask**: Python web framework
- **SQLAlchemy**: Database ORM
- **JWT**: JSON Web Token authentication
- **Bcrypt**: Password hashing
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: Modern React with hooks
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Recharts**: Beautiful chart components
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **Lucide React**: Beautiful icons
- **React Hot Toast**: Toast notifications

## 📁 Project Structure

```
├── backend/
│   ├── app.py              # Main Flask application
│   ├── config.env          # Environment variables
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── index.html          # HTML template
│   ├── public/
│   │   └── vite.svg        # Vite icon
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # Node dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   └── postcss.config.js   # PostCSS configuration
└── README.md               # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables**
   ```bash
   # Copy config.env.example to config.env and update values
   cp config.env.example config.env
   ```

5. **Run the Flask server**
   ```bash
   python app.py
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server with Vite**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`

## 🔐 Authentication

The system uses JWT tokens for secure authentication:

- **Registration**: `/api/auth/register` - Create new user account
- **Login**: `/api/auth/login` - Authenticate user
- **Profile**: `/api/auth/profile` - Get user information (protected)
- **Dashboard**: `/api/dashboard/stats` - Get dashboard statistics (protected)

## 📋 Document Categories API

### Category Management
- **GET** `/api/settings/categories` - Get all categories for current user
- **POST** `/api/settings/categories` - Create new category
- **PUT** `/api/settings/categories/{id}` - Update existing category
- **DELETE** `/api/settings/categories/{id}` - Delete category and all subcategories

### Subcategory Management
- **POST** `/api/settings/subcategories` - Create new subcategory
- **PUT** `/api/settings/subcategories/{id}` - Update existing subcategory
- **DELETE** `/api/settings/subcategories/{id}` - Delete subcategory

## 🎨 UI Components

### Design System
- **Color Palette**: Professional blue and gray theme
- **Typography**: Inter font family for excellent readability
- **Shadows**: Subtle shadows for depth and hierarchy
- **Animations**: Smooth transitions and hover effects

### Responsive Design
- **Mobile First**: Optimized for all screen sizes
- **Sidebar Navigation**: Collapsible sidebar for mobile
- **Grid Layouts**: Responsive grid systems
- **Touch Friendly**: Optimized for touch devices

## 📊 Dashboard Features

### Statistics Cards
- Total Invoices count
- Pending Invoices
- Processed Invoices
- Total Amount with trend indicators

### Interactive Charts
- **Monthly Invoice Trend**: Line chart showing invoice volume
- **Monthly Amount Trend**: Bar chart showing financial data
- **Real-time Updates**: Live data refresh capabilities

### Recent Activity Table
- Invoice details and status
- Vendor information
- Processing dates
- Action buttons for each invoice

### Quick Actions
- **Document Categories**: Configure document classification system
- **View Reports**: Generate and view detailed reports

## 📁 Document Categorization System

### Features
- **Hierarchical Structure**: Categories with multiple subcategories
- **User Isolation**: Each user manages their own categories
- **Real-time Editing**: Inline editing for quick updates
- **CSV Export**: Download category structure for external use
- **Validation**: Required field validation and error handling

### Use Cases
- **Invoice Classification**: Automatically categorize invoices by type
- **Document Organization**: Structure documents by business function
- **Export Generation**: Generate 12 Excel files with multiple sheets
- **Flexible Configuration**: Adapt to any business categorization needs

## 🔮 Future Enhancements

### Phase 2: Document Processing
- PDF upload and parsing
- OCR text extraction
- Automatic categorization based on content
- Data validation and correction
- Batch processing capabilities

### Phase 3: Advanced Analytics
- Custom report generation
- Data export functionality
- Advanced filtering and search
- User role management

### Phase 4: Integration
- Email integration
- API endpoints for external systems
- Webhook support
- Multi-tenant architecture

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 📝 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "securepassword123"
}
```

#### POST /api/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword123"
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Dashboard Endpoints

#### GET /api/dashboard/stats
Get dashboard statistics (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Category Management Endpoints

#### GET /api/settings/categories
Get all categories for current user (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

#### POST /api/settings/categories
Create new category (requires authentication).

**Request Body:**
```json
{
  "name": "Financial Documents",
  "description": "All financial related documents"
}
```

#### PUT /api/settings/categories/{id}
Update existing category (requires authentication).

**Request Body:**
```json
{
  "name": "Updated Category Name",
  "description": "Updated description"
}
```

#### DELETE /api/settings/categories/{id}
Delete category and all subcategories (requires authentication).

### Subcategory Management Endpoints

#### POST /api/settings/subcategories
Create new subcategory (requires authentication).

**Request Body:**
```json
{
  "name": "Invoices",
  "description": "Customer and vendor invoices",
  "category_id": 1
}
```

#### PUT /api/settings/subcategories/{id}
Update existing subcategory (requires authentication).

**Request Body:**
```json
{
  "name": "Updated Subcategory Name",
  "description": "Updated description"
}
```

#### DELETE /api/settings/subcategories/{id}
Delete subcategory (requires authentication).

## 🚀 Performance Benefits with Vite

- **Lightning Fast**: Instant server start and hot module replacement
- **Optimized Builds**: Faster production builds with better tree-shaking
- **Modern Development**: ES modules and native browser features
- **Better DX**: Improved developer experience with faster feedback loops

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/invoice-automation/issues) page
2. Create a new issue with detailed description
3. Contact the development team

## 🙏 Acknowledgments

- **Vite** for the lightning-fast build tool and dev server
- **Tailwind CSS** for the beautiful utility-first CSS framework
- **Recharts** for the amazing chart components
- **Lucide** for the beautiful icon set
- **Flask** community for the excellent Python web framework

---

**Built with ❤️ for modern invoice automation** 