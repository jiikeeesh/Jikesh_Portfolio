"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 relative z-50">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold hover:text-blue-600 dark:hover:text-blue-400">
          Jikesh
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-6">
          <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">
            About
          </Link>
          <Link href="/projects" className="hover:text-blue-600 dark:hover:text-blue-400">
            Projects
          </Link>
          <Link href="/store" className="hover:text-blue-600 dark:hover:text-blue-400">
            Store
          </Link>
          <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400">
            Contact
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle Navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-lg py-4 px-6 flex flex-col gap-4 z-50">
          <Link 
            href="/about" 
            className="block text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link 
            href="/projects" 
            className="block text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
          <Link 
            href="/store" 
            className="block text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            Store
          </Link>
          <Link 
            href="/contact" 
            className="block text-lg font-medium hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}
