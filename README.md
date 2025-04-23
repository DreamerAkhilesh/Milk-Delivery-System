# Milk Delivery System

A full-stack web application for managing milk delivery subscriptions, products, and users.

## Features

- User authentication and profile management
- Product catalog with categories and search
- Subscription management for recurring milk deliveries
- Admin dashboard for inventory and user management
- Order tracking and history
- Secure payment integration (Razorpay/Stripe)
- Responsive design for desktop and mobile

## Tech Stack

### Frontend
- React.js with Vite
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Google Maps API for location services

### Backend
- Node.js with Express
- MongoDB with Mongoose for database
- JWT for authentication
- Multer for file uploads
- Nodemailer for email notifications
- Bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v20.x recommended)
- MongoDB database
- NPM or Yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/milk-delivery-system.git
cd milk-delivery-system
```

2. Setup Backend
```bash
cd Milk-Delivery-System/Backend
npm install
# Create .env.development file with required variables
npm run dev
```

3. Setup Frontend
```bash
cd ../Frontend
npm install
npm run dev
```

### Environment Variables

#### Backend (.env.development or .env.production)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=your_mongodb_url
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

#### Frontend (not required, configured in vite.config.js)

## Deployment

The application is configured for deployment on Render:
- Frontend: https://milk-delivery-frontend.onrender.com
- Backend: Uses node 20.x engine

## Project Structure

```
Milk-Delivery-System/
├── Backend/
│   ├── config/         # Database and app configuration
│   ├── controllers/    # Request handlers
│   ├── middlewares/    # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routers/        # API routes
│   ├── uploads/        # Product images storage
│   ├── utils/          # Helper functions
│   └── server.js       # Main application file
│
└── Frontend/
    ├── public/         # Static files
    ├── src/
    │   ├── assets/     # Images and static resources
    │   ├── components/ # React components
    │   ├── hooks/      # Custom hooks
    │   ├── pages/      # Page components
    │   ├── redux/      # Redux store and slices
    │   ├── services/   # API services
    │   ├── styles/     # CSS files
    │   └── utils/      # Utility functions
    └── index.html      # Entry HTML file
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons provided by Lucide React
- UI components using Radix UI primitives 