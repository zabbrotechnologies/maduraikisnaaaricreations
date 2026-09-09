/**
 * AARI WORKS — PREMIUM AARI EMBROIDERY WEBSITE
 * Main Application Configuration & Initialization (main.js)
 */

'use strict';

// --------------------------------------------------------------------------
// Global Atelier Business Configuration
// --------------------------------------------------------------------------
window.ATELIER_CONFIG = {
  brandName: 'Madurai Kisna Aari Works',
  tagline: 'Haute Couture Bridal Atelier',
  whatsappNumber: '919842102938',
  phoneDisplay: '+91 (0) 452 234 8990 / +91 98421 02938',
  email: 'concierge@maduraikisna.com',
  address: 'East Veli Street, Near Meenakshi Amman Temple Environs, Madurai, Tamil Nadu 625001',
  hours: 'Monday to Saturday: 10:00 AM – 8:30 PM IST | Sunday: By Appointment',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com'
};

// --------------------------------------------------------------------------
// DOM Initialization Event Handler
// --------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  console.log(`[Atelier App] Initialized: ${window.ATELIER_CONFIG.brandName}`);
});
