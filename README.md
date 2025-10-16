# USDrop AI - Admin Dashboard Template

A modern, feature-rich admin dashboard built with Next.js 15, Supabase, and shadcn/ui. This project serves as a comprehensive template for building scalable admin interfaces with advanced data management capabilities.

## 🚀 Features

### Core Functionality
- **🔐 Authentication & Authorization**: Supabase Auth with role-based access control
- **👥 User Management**: Complete CRUD operations with advanced data table
- **📊 Analytics Dashboard**: Real-time metrics and statistics
- **🎨 Modern UI**: Built with shadcn/ui components and Tailwind CSS
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### Advanced Data Table
- **📋 Multiple Views**: Table, List, and Kanban views with drag-and-drop
- **🔍 Advanced Filtering**: Search, role filters, and date range selection
- **📄 Pagination**: Server-side pagination with customizable page sizes
- **📤 Export Functionality**: CSV export with PDF support planned
- **🎯 Row Actions**: Inline edit/delete with confirmation modals
- **👤 User Details**: Quick view and detailed modals with tabs

### Sidebar Navigation
- **📱 Collapsible Sidebar**: Toggles between full and icon-only view
- **🧭 Breadcrumb Navigation**: Dynamic breadcrumbs with home icon
- **🔔 Notification Badges**: Real-time counts for various sections
- **👤 User Profile Menu**: Dropdown with profile settings and sign out

### Developer Experience
- **⚡ Next.js 15**: Latest features with App Router and Server Components
- **🎯 TypeScript**: Full type safety throughout the application
- **🔧 ESLint & Prettier**: Code quality and formatting
- **📦 Component Library**: Reusable shadcn/ui components
- **🎨 Tailwind CSS**: Utility-first styling with custom design tokens

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern component library
- **Lucide React** - Beautiful icons
- **TanStack Table** - Headless table library
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend & Database
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Database with Row Level Security
- **Supabase Auth** - Authentication and authorization
- **Supabase Realtime** - Real-time subscriptions

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Turbopack** - Fast bundler
- **Git** - Version control

## 📁 Project Structure

```
usdrop-v2/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── auth/              # Authentication pages
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout with sidebar
│   ├── components/            # Reusable components
│   │   ├── admin/             # Admin-specific components
│   │   ├── ui/                # shadcn/ui components
│   │   └── app-sidebar.tsx    # Main sidebar component
│   ├── contexts/              # React contexts
│   ├── lib/                   # Utility functions
│   ├── styles/                # Global styles
│   └── utils/                 # Helper utilities
├── docs/                      # Documentation
├── .cursorrules              # Project-specific rules
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd usdrop-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the SQL migrations in `docs/schema/auth.sql`
   - Set up Row Level Security policies

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage as a Template

This project is designed to be used as a template for building admin dashboards. Here's how to customize it:

### 1. Branding & Styling
- Update the sidebar logo and branding in `src/components/app-sidebar.tsx`
- Modify color scheme in `tailwind.config.ts`
- Customize the theme in `src/styles/globals.css`

### 2. Navigation Structure
- Add/remove menu items in `src/components/app-sidebar.tsx`
- Update breadcrumb mapping in `src/components/admin-breadcrumb.tsx`
- Create new pages in `src/app/admin/`

### 3. Data Management
- Modify the user schema in your Supabase database
- Update the data table columns in `src/components/admin/data-table/columns.tsx`
- Customize the API routes in `src/app/api/admin/`

### 4. Authentication
- Adjust role-based access control in middleware
- Modify user roles and permissions
- Update the authentication flow as needed

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE profile (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  role_id TEXT NOT NULL CHECK (role_id IN ('admin', 'owner', 'client')),
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security
- Users can only view their own profile
- Admins can view all profiles
- Service role bypasses RLS for admin operations

## 🔧 Configuration

### Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Custom configurations
NEXT_PUBLIC_APP_NAME=USDrop AI
NEXT_PUBLIC_APP_DESCRIPTION=AI-powered dropshipping intelligence platform
```

### Customization Options
- **Sidebar Width**: Modify `SIDEBAR_WIDTH` in `src/components/ui/sidebar.tsx`
- **Keyboard Shortcuts**: Change `SIDEBAR_KEYBOARD_SHORTCUT` for sidebar toggle
- **Cookie Persistence**: Adjust `SIDEBAR_COOKIE_NAME` for sidebar state

## 🎨 Component Library

This project uses shadcn/ui components. To add new components:

```bash
npx shadcn@latest add [component-name]
```

### Available Components
- Button, Card, Input, Label
- Dialog, Dropdown Menu, Sheet
- Table, Badge, Avatar
- Sidebar, Breadcrumb, Toggle Group
- Calendar, Date Picker
- Toast, Alert Dialog
- And many more...

## 📱 Responsive Design

The dashboard is fully responsive with:
- **Desktop**: Full sidebar with labels
- **Tablet**: Collapsible sidebar
- **Mobile**: Slide-out sidebar with touch-friendly controls

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **Role-based Access**: Admin, Owner, Client roles
- **Service Role**: Secure admin operations
- **Input Validation**: Zod schema validation
- **CSRF Protection**: Built-in Next.js protection

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Easy deployment with database
- **DigitalOcean**: App Platform support

## 📈 Performance

- **Server Components**: Reduced client-side JavaScript
- **Image Optimization**: Next.js automatic optimization
- **Code Splitting**: Automatic route-based splitting
- **Caching**: Built-in Next.js caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful component library
- **Supabase** - Backend-as-a-Service platform
- **Next.js** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Lucide** - Icon library

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation in the `docs/` folder
- Review the `.cursorrules` file for project guidelines

---

**Built with ❤️ using modern web technologies**

*This template provides a solid foundation for building scalable admin dashboards. Customize it to fit your specific needs and requirements.*