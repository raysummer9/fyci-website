'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  const quickLinks = [
    { name: 'About Us', href: '/who-we-are/about' },
    { name: 'Team', href: '/who-we-are/team' },
    { name: 'Publications', href: '/publications' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' }
  ];

  const programmeAreas = [
    { name: 'Gender Rights', href: '/programmes/gender-rights' },
    { name: 'Youth Agency', href: '/programmes/youth-agency' },
    { name: 'Political Participation', href: '/programmes/political-participation' },
    { name: 'Anti-Corruption', href: '/programmes/anti-corruption' }
  ];

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'YouTube', href: '#', icon: Youtube }
  ];

  return (
    <footer className="py-16 sm:py-20" style={{ backgroundColor: '#5920a4' }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-0">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 lg:gap-12"
        >
          {/* Company Info */}
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="col-span-2 md:col-span-1 lg:col-span-1"
          >
            <div className="mb-4">
              <Image
                src="/assets/fyci-logo3.png"
                alt="FYCI Logo"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
            <p className="text-white/90 mb-6 leading-relaxed">
              Empowering young people across Africa through creative initiatives, 
              leadership development, and community engagement.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-white/80" />
                <span className="text-white/80 text-sm">contact@fyci.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-white/80" />
                <span className="text-white/80 text-sm">LL4B Sunnyvale Estate, Abuja, Nigeria</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Programme Areas */}
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Programme Areas</h4>
            <ul className="space-y-3">
              {programmeAreas.map((programme) => (
                <li key={programme.name}>
                  <Link
                    href={programme.href}
                    className="text-white/80 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {programme.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social & Newsletter */}
          <motion.div
            variants={itemVariants}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-white mb-4">Stay Connected</h4>
            <p className="text-white/80 text-sm mb-6">
              Follow us on social media for updates and news.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="text-white/80 hover:text-white transition-colors duration-200"
                  >
                    <IconComponent size={20} />
                  </Link>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
          className="mt-12 pt-8 border-t border-white/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/70 text-sm">
              © {new Date().getFullYear()} FYCI. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
