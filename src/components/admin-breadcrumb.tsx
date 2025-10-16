"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

// Define the breadcrumb mapping
const breadcrumbMap: Record<string, { label: string; href?: string }> = {
  "/admin": { label: "Dashboard", href: "/admin" },
  "/admin/users": { label: "User Management", href: "/admin/users" },
  "/admin/analytics": { label: "Analytics", href: "/admin/analytics" },
  "/admin/reports": { label: "Reports", href: "/admin/reports" },
  "/admin/settings": { label: "System Settings", href: "/admin/settings" },
  "/admin/database": { label: "Database", href: "/admin/database" },
  "/admin/activity": { label: "Activity Logs", href: "/admin/activity" },
  "/admin/security": { label: "Security", href: "/admin/security" },
  "/admin/notifications": { label: "Notifications", href: "/admin/notifications" },
  "/admin/help": { label: "Help & Support", href: "/admin/help" },
  "/admin/profile": { label: "Profile Settings", href: "/admin/profile" },
}

export function AdminBreadcrumb() {
  const pathname = usePathname()
  
  // Generate breadcrumb items based on the current path
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbs = []
    
    // Always start with home
    breadcrumbs.push({
      label: "Home",
      href: "/",
      isLast: pathname === "/"
    })
    
    // Build breadcrumb path
    let currentPath = ""
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1
      
      const breadcrumbInfo = breadcrumbMap[currentPath]
      if (breadcrumbInfo) {
        breadcrumbs.push({
          label: breadcrumbInfo.label,
          href: isLast ? undefined : breadcrumbInfo.href,
          isLast
        })
      } else {
        // Fallback for unknown paths
        breadcrumbs.push({
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: isLast ? undefined : currentPath,
          isLast
        })
      }
    })
    
    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <div key={breadcrumb.label} className="flex items-center">
            <BreadcrumbItem>
              {breadcrumb.isLast ? (
                <BreadcrumbPage className="font-medium">
                  {index === 0 && <Home className="mr-2 h-4 w-4 inline" />}
                  {breadcrumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={breadcrumb.href || "/"}>
                    {index === 0 && <Home className="mr-2 h-4 w-4 inline" />}
                    {breadcrumb.label}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!breadcrumb.isLast && (
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
            )}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
