// src/components/Footer.jsx
/*
import {
  Mail,
  MapPin,
} from 'lucide-react';
 

import { SiInstagram, SiGroupme } from '@icons-pack/react-simple-icons';
*/
export default function Footer() {
  return (
    <footer className="bg-white dark:bg-flat-gold text-flat-gold dark:text-custom-black py-4 mt-auto border-t-2 border-flat-gold">
      <div className="container mx-4 ">
        <div className="flex px-1 gap-16">
          {/* Contact Us */}
          <div className="flex-shrink-0 min-w-0">
            <h3 className="text-xl font-semibold mb-4 whitespace-nowrap">Contact Us</h3>
            <div className="space-y-2">
              <p className="whitespace-nowrap">vsbc@vanderbilt.edu</p>
              <p className="whitespace-nowrap">Nashville, TN 37235</p>
            </div>
          </div>

          {/* Connect */}
          <div className="flex-shrink-0 min-w-0">
            <h3 className="text-xl font-semibold mb-4 whitespace-nowrap">Connect</h3>
            <div className="flex gap-4">
              <a target="_blank" rel="noopener noreferrer" href="https://groupme.com/join_group/103038683/9a9nPuLp" aria-label="GroupMe" className="text-white hover:text-blue-400 transition-colors">
                <img
                  src="/src/assets/GroupMeBlue.png"
                  alt="GroupMe"
                  aria-label="GroupMe logo white"
                  loading="lazy"
                  decoding="async"
                  className="w-6 h-6 hover:scale-110 transition-transform duration-300"
                />
              </a>
              <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/vanderbilt_sbc/" aria-label="Instagram" className="text-pink-400 hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6"
                  role="img"
                  aria-label="Instagram logo"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <title>Instagram</title>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/company/vanderbilt-sports-business-club" aria-label="LinkedIn" className="text-blue-600 hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-6 h-6"
                  role="img"
                  aria-label="LinkedIn logo"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <title>LinkedIn</title>
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Interest Forms */}
          <div className="flex-shrink-0 min-w-0">
            <h3 className="text-xl font-semibold mb-3 whitespace-nowrap">Interest Forms</h3>
            <div className="space-y-1">
              <a
                href="https://groupme.com/join_group/103038683/9a9nPuLp"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-md underline hover:text-blue-400 whitespace-nowrap"
              >
                Individuals
              </a>
              <a
                href="https://groupme.com/join_group/103038683/9a9nPuLp"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-md underline hover:text-blue-400 whitespace-nowrap"
              >
                Organizations
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

