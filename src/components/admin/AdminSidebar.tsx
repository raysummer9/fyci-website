'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  Map, 
  FileText, 
  BookOpen, 
  Users, 
  LogOut,
  MessageSquare,
  ClipboardList,
  Upload as UploadIcon
} from 'lucide-react'

interface SidebarProps {
  userEmail?: string
}

const navigation = [
  {
    name: 'Overview',
    href: '/admin/dashboard',
    icon: BarChart3,
  },
  {
    name: 'Programme Areas',
    href: '/admin/programme-areas',
    icon: Map,
  },
  {
    name: 'Blogs',
    href: '/admin/blogs',
    icon: FileText,
  },
  {
    name: 'Comments',
    href: '/admin/comments',
    icon: MessageSquare,
  },
  {
    name: 'Applications',
    href: '/admin/applications',
    icon: ClipboardList,
  },
  {
    name: 'Publications',
    href: '/admin/publications',
    icon: BookOpen,
  },
  {
    name: 'Uploads',
    href: '/admin/uploads',
    icon: UploadIcon,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: Users,
  },
]

export default function AdminSidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo/Header */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <h1 className="text-lg font-semibold text-gray-900">
          FYCI Admin
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className="w-full justify-start gap-3 h-10"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

      {/* User info and logout */}
      <div className="border-t border-gray-200 p-4">
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-900">Signed in as</p>
          <p className="text-sm text-gray-500">{userEmail}</p>
        </div>
        <form action="/admin/auth/signout" method="post">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  )
}
