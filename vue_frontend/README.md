# ShopMall - Vue.js Frontend

A modern, minimalist shopping mall application built with Vue 3, TypeScript, and Pinia. Features a clean Ocean Professional theme with customer and admin interfaces.

## Features

### Customer Features
- **Product Catalog**: Browse and search products with category filtering
- **Product Details**: View detailed product information
- **Shopping Cart**: Add, update, and remove items from cart
- **Checkout**: Place orders with shipping address
- **Order History**: View past orders and their status
- **Authentication**: Register and login functionality

### Admin Features
- **Admin Dashboard**: Overview of products, orders, users, and revenue
- **Product Management**: Create, update, and delete products
- **Order Management**: View all orders and update order status
- **User Management**: View and manage system users

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

## Project Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the root directory:

```bash
# API base URL (adjust based on your backend)
VITE_API_BASE_URL=http://localhost:3001/api
```

For production, the deployment system will set `VITE_API_BASE_URL` to the appropriate backend URL.

### Development

```bash
# Run development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
# Type-check and build
npm run build
```

### Preview Production Build

```bash
# Preview production build locally
npm run preview
```

### Linting

```bash
# Lint and fix files
npm run lint

# Format code
npm run format
```

### Testing

```bash
# Run unit tests
npm run test:unit
```

## Project Structure

```
src/
├── api/              # API client and endpoints
│   └── client.ts     # Axios configuration and API methods
├── assets/           # Global styles
│   ├── base.css      # Theme variables and base styles
│   └── main.css      # Main application styles
├── components/       # Reusable Vue components
│   ├── CartItem.vue
│   ├── Navbar.vue
│   └── ProductCard.vue
├── router/           # Vue Router configuration
│   └── index.ts      # Routes and navigation guards
├── stores/           # Pinia stores
│   ├── auth.ts       # Authentication state
│   ├── cart.ts       # Shopping cart state
│   ├── orders.ts     # Orders state
│   ├── products.ts   # Products state
│   └── users.ts      # Users state (admin)
├── types/            # TypeScript type definitions
│   └── index.ts      # Shared types
├── views/            # Page components
│   ├── admin/        # Admin pages
│   │   ├── AdminDashboard.vue
│   │   ├── OrderManagement.vue
│   │   ├── ProductManagement.vue
│   │   └── UserManagement.vue
│   ├── CartView.vue
│   ├── CheckoutView.vue
│   ├── LoginView.vue
│   ├── OrderHistory.vue
│   ├── ProductCatalog.vue
│   └── ProductDetail.vue
├── App.vue           # Root component
└── main.ts           # Application entry point
```

## Design System

### Ocean Professional Theme

The application uses a minimalist Ocean Professional color scheme:

- **Primary**: #374151 (Dark Gray)
- **Secondary**: #9CA3AF (Medium Gray)
- **Success**: #10B981 (Green)
- **Error**: #EF4444 (Red)
- **Background**: #FFFFFF (White)
- **Surface**: #F9FAFB (Light Gray)
- **Text**: #111827 (Near Black)

### Design Principles

- **Minimalist**: Clean, uncluttered interfaces with generous whitespace
- **Responsive**: Mobile-first design that works on all screen sizes
- **Accessible**: Semantic HTML and ARIA labels
- **Consistent**: Unified design language across all pages

## API Integration

The frontend communicates with the backend via RESTful APIs. The base URL is configured through the `VITE_API_BASE_URL` environment variable.

### Authentication

- Authentication uses JWT tokens stored in localStorage
- Token is automatically included in API requests via Axios interceptor
- Unauthorized requests (401) trigger automatic logout and redirect to login

### API Endpoints

- **Auth**: `/users/login`, `/users/register`, `/users/me`
- **Products**: `/products`, `/products/:id`
- **Cart**: `/carts/me`, `/carts/items`
- **Orders**: `/orders`, `/orders/me`
- **Admin**: `/admin/products`, `/admin/orders`, `/admin/users`

## State Management

The application uses Pinia for state management with the following stores:

- **auth**: User authentication and profile
- **products**: Product catalog and details
- **cart**: Shopping cart items and totals
- **orders**: Order creation and history
- **users**: User management (admin only)

## Routing

The application uses Vue Router with navigation guards:

- **Authentication Guard**: Protects routes that require login
- **Admin Guard**: Restricts admin routes to users with ADMIN role
- **Login Redirect**: Redirects logged-in users away from login page

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, modify `vite.config.ts`:

```typescript
server: {
  port: 3001, // Change to desired port
  strictPort: false
}
```

### API Connection Issues

1. Verify backend is running
2. Check `VITE_API_BASE_URL` in `.env`
3. Ensure CORS is configured on backend

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Write meaningful commit messages
4. Test before committing

## License

This project is part of the online shopping mall system.
