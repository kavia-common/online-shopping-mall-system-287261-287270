# Quick Start Guide

## Prerequisites
- Node.js v18+ installed
- Backend API running at `https://vscode-internal-28250-beta.beta01.cloud.kavia.ai:3001`

## Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Environment is already configured in .env
# No changes needed for development

# 3. Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Default Test Accounts

Contact your backend administrator for test account credentials, or register a new account:
- Navigate to `/login`
- Click "Sign Up"
- Fill in username, email, and password

## Development Commands

```bash
# Run development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run tests
npm run test:unit

# Type check
npm run type-check
```

## Quick Feature Tour

### Customer Features

1. **Browse Products**
   - Visit homepage (`/`)
   - Use search bar to find products
   - Filter by category

2. **Add to Cart**
   - Click on any product card
   - View product details
   - Click "Add to Cart"

3. **Checkout**
   - Navigate to cart (`/cart`)
   - Review items
   - Click "Proceed to Checkout"
   - Enter shipping address
   - Place order

4. **View Orders**
   - Navigate to "Orders" in navbar
   - View order history and status

### Admin Features

1. **Access Admin Panel**
   - Login with admin account
   - Click "Admin" in navbar

2. **Manage Products**
   - Go to Admin Dashboard
   - Click "Manage Products"
   - Add, edit, or delete products

3. **Manage Orders**
   - Click "Manage Orders"
   - Update order status

4. **Manage Users**
   - Click "Manage Users"
   - View all registered users

## Project Structure Overview

```
src/
├── api/          # Backend API communication
├── components/   # Reusable Vue components
├── stores/       # Pinia state management
├── router/       # Vue Router configuration
├── views/        # Page components
├── types/        # TypeScript definitions
└── assets/       # Styles and static assets
```

## Key Files

- `src/api/client.ts` - API configuration and endpoints
- `src/router/index.ts` - Route definitions and guards
- `src/stores/*.ts` - State management stores
- `.env` - Environment variables

## Common Tasks

### Adding a New Product (Admin)
1. Login as admin
2. Go to Admin → Manage Products
3. Click "+ Add Product"
4. Fill in product details
5. Click "Create"

### Processing an Order (Admin)
1. Go to Admin → Manage Orders
2. Find the order
3. Select new status from dropdown
4. Status updates automatically

### Updating User Profile
Currently not implemented - use backend API directly

## Troubleshooting

### Port Already in Use
Change port in `vite.config.ts`:
```typescript
server: {
  port: 3001
}
```

### API Not Connecting
1. Check backend is running
2. Verify `.env` has correct `VITE_API_BASE_URL`
3. Check browser console for errors

### Build Errors
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Support

For issues or questions:
1. Check `README.md` for detailed documentation
2. Review `IMPLEMENTATION.md` for technical details
3. Inspect browser console for error messages

## Next Steps

1. ✅ Application is ready to use
2. ✅ All features implemented
3. ✅ Connected to backend API
4. ✅ Ready for testing and deployment

Happy coding! 🚀
