'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, Users, Building, UserCheck, Heart, Shield, BookOpen, Calendar, FileText, Megaphone, Target, Users2, Vote, Scale } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredSubItem, setHoveredSubItem] = useState<string | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleSubmenu = (label: string) => {
    setOpenSubmenu(openSubmenu === label ? null : label);
  };

  const navLinks = [
    {
      label: 'Who We Are',
      href: '/who-we-are',
      submenu: [
        { href: '/who-we-are/about', label: 'About Us', icon: Users },
        { href: '/who-we-are/organisational-structure', label: 'Organisational Structure', icon: Building },
        { href: '/who-we-are/team', label: 'Team', icon: UserCheck },
      ]
    },
    {
      label: 'Programme Areas',
      href: '/programme-areas',
      submenu: [
        { href: '/gender-rights', label: 'Gender Rights', icon: Heart },
        { href: '/youth-agency', label: 'Youth Agency and Self Esteem', icon: Target },
        { href: '/youth-political-participation', label: 'Youth Political Participation', icon: Vote },
        { href: '/anti-corruption', label: 'Anti-Corruption', icon: Shield },
      ]
    },
    {
      label: 'Resource Hub',
      href: '/resource-hub',
      submenu: [
        { href: '/publications', label: 'Publications', icon: BookOpen },
        { href: '/events', label: 'Events', icon: Calendar },
        { href: '/blog', label: 'Blog', icon: FileText },
      ]
    },
    { href: '/get-involved', label: 'Get Involved' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50" style={{ backgroundColor: '#5920a4' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 pt-6 pb-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/assets/fyci-logo3.png"
              alt="Frontline Youth Creativity Initiative"
              width={800}
              height={400}
              className="w-48 h-48 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link, index) => (
              <div
                key={link.href || link.label}
                className="relative"
              >
                <button
                  onClick={() => setActiveDropdown(activeDropdown === link.label ? null : link.label)}
                  className="px-4 py-2 text-base font-bold text-white rounded-md flex items-center gap-1 cursor-pointer"
                >
                  {link.label}
                  {link.submenu && <ChevronDown size={16} />}
                </button>
                
                {link.submenu && activeDropdown === link.label && (
                  <div 
                    className="absolute top-full left-0 mt-1 bg-white rounded-lg py-6 z-50"
                    onMouseLeave={() => {
                      setActiveDropdown(null);
                      setHoveredSubItem(null);
                    }}
                  >
                    {(link.label === 'Programme Areas' || link.label === 'Resource Hub') ? (
                      // Mega menu for Programme Areas and Resource Hub
                      <div className={`flex ${link.label === 'Resource Hub' ? 'w-80' : 'w-[500px]'}`}>
                        <div className="flex-1 px-6">
                          <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                            {link.label === 'Programme Areas' ? 'Programmes' : 'Resources'}
                          </h3>
                          <div className="space-y-2">
                            {link.submenu.map((subLink) => {
                              return (
                                <Link
                                  key={subLink.href}
                                  href={subLink.href}
                                  className="block py-2 text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                                  onMouseEnter={() => setHoveredSubItem(subLink.label)}
                                >
                                  {subLink.label}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                        {link.label === 'Programme Areas' && (
                          <>
                            <div className="w-px bg-gray-100"></div>
                            <div className="flex-1 px-6">
                              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                                Explore
                              </h3>
                              <div className="space-y-3">
                                {hoveredSubItem && (
                                  <>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Latest Programme</h4>
                                      <div className="text-xs text-gray-600 mb-2">Programme Title</div>
                                      <div className="w-full h-20 bg-gray-200 rounded mb-3"></div>
                                      <Link href={`/programme-areas/${hoveredSubItem.toLowerCase().replace(/\s+/g, '-')}`} className="inline-block px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors cursor-pointer">
                                        Access Programme
                                      </Link>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <h4 className="font-semibold text-sm text-gray-900 mb-2">Latest Blog Post</h4>
                                      <div className="text-xs text-gray-600 mb-2">Blog post title related to {hoveredSubItem}</div>
                                      <Link href={`/blog/${hoveredSubItem.toLowerCase().replace(/\s+/g, '-')}`} className="text-xs text-purple-600 hover:text-purple-700 cursor-pointer">
                                        Read More →
                                      </Link>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      // Regular dropdown for Who We Are
                      <div className="w-64 px-6">
                        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                          About
                        </h3>
                        <div className="space-y-2">
                          {link.submenu.map((subLink) => {
                            return (
                              <Link
                                key={subLink.href}
                                href={subLink.href}
                                className="block py-2 text-sm font-bold text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                              >
                                {subLink.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <Link
              href="/donate"
              className="ml-4 px-8 py-2 text-base font-semibold bg-white hover:bg-gray-100 rounded-md transition-colors"
              style={{ color: '#5920a4' }}
            >
              Donate
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-white hover:text-purple-200 hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed top-0 left-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out md:hidden" style={{ backgroundColor: '#5920a4' }}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-start p-6 border-b border-white/20">
                <Image
                  src="/assets/fyci-logo3.png"
                  alt="Frontline Youth Creativity Initiative"
                  width={180}
                  height={180}
                  className="rounded-lg"
                />
              </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <div key={link.href || link.label}>
                    <button
                      onClick={() => toggleSubmenu(link.label)}
                      className="flex items-center justify-between w-full px-4 py-3 text-base font-bold text-white rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <span>{link.label}</span>
                      {link.submenu && (
                        <ChevronDown
                          size={20}
                          className={`transform transition-transform text-white ${
                            openSubmenu === link.label ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </button>
                    {link.submenu && openSubmenu === link.label && (
                      <div className="pl-4 space-y-1 mt-2">
                        {link.submenu.map((subLink) => {
                          const Icon = subLink.icon;
                          return (
                            <Link
                              key={subLink.href}
                              href={subLink.href}
                              className="flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-lg transition-colors text-white/90 hover:bg-white/10 hover:text-white"
                              onClick={() => setIsOpen(false)}
                            >
                              <Icon size={20} />
                              {subLink.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with Donate Button */}
            <div className="p-6 border-t border-white/20">
              <Link
                href="/donate"
                className="block w-full px-6 py-3 text-center text-base font-bold text-white bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Donate
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
