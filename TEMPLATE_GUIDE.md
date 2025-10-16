# USDrop AI - Template Usage Guide

This document provides detailed instructions on how to use this project as a template for building your own admin dashboard.

## 🎯 Template Overview

This project is a comprehensive admin dashboard template that includes:
- Modern UI with shadcn/ui components
- Advanced data table with multiple views
- Sidebar navigation with breadcrumbs
- User management system
- Authentication and authorization
- Responsive design
- TypeScript support

## 🚀 Quick Start

### 1. Fork or Clone
```bash
# Clone the repository
git clone <your-repo-url>
cd usdrop-v2

# Or fork on GitHub and clone your fork
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment
```bash
# Copy the example environment file
cp env.example .env.local

# Edit .env.local with your Supabase credentials
```

### 4. Set Up Supabase
1. Create a new Supabase project
2. Run the SQL migrations from `docs/schema/auth.sql`
3. Set up Row Level Security policies
4. Update your environment variables

### 5. Start Development
```bash
npm run dev
```

## 🎨 Customization Guide

### Branding & Identity

#### Update App Name and Logo
1. **Sidebar Logo**: Edit `src/components/app-sidebar.tsx`
   ```tsx
   // Change the logo and branding
   <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
     <YourIcon className="size-4" />
   </div>
   <div className="grid flex-1 text-left text-sm leading-tight">
     <span className="truncate font-semibold">Your App Name</span>
     <span className="truncate text-xs">Your Tagline</span>
   </div>
   ```

2. **Page Titles**: Update `src/app/layout.tsx`
   ```tsx
   export const metadata: Metadata = {
     title: "Your App Name",
     description: "Your app description",
   };
   ```

#### Color Scheme
1. **Tailwind Config**: Edit `tailwind.config.ts`
   ```tsx
   theme: {
     extend: {
       colors: {
         primary: {
           // Your primary colors
         },
         // Add your custom colors
       }
     }
   }
   ```

2. **CSS Variables**: Update `src/styles/globals.css`
   ```css
   :root {
     --primary: your-primary-color;
     --primary-foreground: your-primary-foreground;
     /* Add your custom CSS variables */
   }
   ```

### Navigation Structure

#### Add New Menu Items
Edit `src/components/app-sidebar.tsx`:

```tsx
const mainMenuItems = [
  {
    title: "Your New Page",
    url: "/admin/your-page",
    icon: YourIcon,
    badge: null, // or a count
  },
  // ... existing items
];
```

#### Create New Pages
1. Create a new page in `src/app/admin/your-page/page.tsx`
2. Add the route to breadcrumb mapping in `src/components/admin-breadcrumb.tsx`
3. Update the sidebar menu items

### Data Management

#### Modify User Schema
1. **Database**: Update your Supabase schema
2. **Types**: Update TypeScript interfaces
3. **Components**: Modify data table columns
4. **API**: Update API routes

#### Customize Data Table
1. **Columns**: Edit `src/components/admin/data-table/columns.tsx`
2. **Filters**: Modify filter components
3. **Actions**: Update row actions
4. **Views**: Customize table, list, and kanban views

### Authentication & Authorization

#### User Roles
1. **Database**: Update role constraints in your schema
2. **Types**: Modify role types in TypeScript
3. **Middleware**: Update access control logic
4. **UI**: Adjust role-based UI elements

#### Permissions
1. **RLS Policies**: Update Row Level Security in Supabase
2. **API Routes**: Modify permission checks
3. **Components**: Add role-based rendering

## 📁 File Structure Guide

### Key Files to Modify

#### Core Layout
- `src/app/layout.tsx` - Root layout and metadata
- `src/components/app-sidebar.tsx` - Main navigation
- `src/components/admin-breadcrumb.tsx` - Breadcrumb navigation

#### Admin Pages
- `src/app/admin/page.tsx` - Main dashboard
- `src/app/admin/users/page.tsx` - User management
- `src/app/admin/analytics/page.tsx` - Analytics page
- `src/app/admin/settings/page.tsx` - Settings page

#### Data Management
- `src/components/admin/data-table/` - Data table components
- `src/app/api/admin/` - API routes
- `src/components/admin/` - Admin-specific components

#### Styling
- `src/styles/globals.css` - Global styles
- `tailwind.config.ts` - Tailwind configuration
- `src/components/ui/` - UI components

### Files to Keep As-Is
- `src/components/ui/` - shadcn/ui components (don't modify)
- `src/lib/utils.ts` - Utility functions
- `src/utils/supabase/` - Supabase client setup

## 🔧 Configuration Options

### Sidebar Configuration
```tsx
// In src/components/ui/sidebar.tsx
const SIDEBAR_WIDTH = "16rem" // Adjust sidebar width
const SIDEBAR_KEYBOARD_SHORTCUT = "b" // Change keyboard shortcut
const SIDEBAR_COOKIE_NAME = "sidebar_state" // Change cookie name
```

### Table Configuration
```tsx
// In data table components
const DEFAULT_PAGE_SIZE = 10 // Change default page size
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] // Modify page size options
```

### Theme Configuration
```tsx
// In tailwind.config.ts
module.exports = {
  darkMode: ["class"], // Enable dark mode
  theme: {
    extend: {
      // Your custom theme extensions
    }
  }
}
```

## 🎨 Design System

### Component Usage
This template uses shadcn/ui components. To add new components:

```bash
npx shadcn@latest add [component-name]
```

### Styling Guidelines
1. **Use Tailwind classes** for styling
2. **Follow the design system** established by shadcn/ui
3. **Maintain consistency** with existing components
4. **Use CSS variables** for theme customization

### Responsive Design
- **Mobile-first approach** with Tailwind breakpoints
- **Sidebar collapses** on mobile devices
- **Touch-friendly** interface elements
- **Optimized layouts** for different screen sizes

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Add environment variables
3. Deploy automatically

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Easy deployment with database
- **DigitalOcean**: App Platform support

### Environment Variables
Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Supabase Discord](https://discord.supabase.com)
- [shadcn/ui Discord](https://discord.gg/shadcn)

## 🤝 Contributing

If you improve this template:
1. Fork the repository
2. Make your improvements
3. Submit a pull request
4. Help others benefit from your enhancements

## 📄 License

This template is licensed under the MIT License. You can use it for:
- Personal projects
- Commercial projects
- Open source projects
- Educational purposes

## 🆘 Support

If you need help:
1. Check the documentation
2. Review the `.cursorrules` file
3. Create an issue in the repository
4. Ask questions in the community

---

**Happy Building! 🚀**

*This template provides a solid foundation for building modern admin dashboards. Customize it to fit your needs and create something amazing!*
