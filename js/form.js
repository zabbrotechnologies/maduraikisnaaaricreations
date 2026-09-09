/**
 * AARI WORKS — PREMIUM AARI EMBROIDERY WEBSITE
 * Interactive Enquiry Form & WhatsApp Builder (form.js)
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  let selectedService = 'Bridal Blouse Embroidery';
  const serviceChips = document.querySelectorAll('.service-chip');
  const enquiryForm = document.getElementById('whatsapp-enquiry-form');
  const fittingForm = document.getElementById('studio-fitting-form');

  // --------------------------------------------------------------------------
  // 1. Service Chip Selection Handler
  // --------------------------------------------------------------------------
  serviceChips.forEach(chip => {
    chip.addEventListener('click', function () {
      serviceChips.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      selectedService = this.getAttribute('data-value') || this.textContent.trim();
    });
  });

  // --------------------------------------------------------------------------
  // 2. Client-Side Input Validation Utilities
  // --------------------------------------------------------------------------
  const validateEmail = (email) => {
    if (!email) return true; // Optional unless required
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    if (!phone) return false;
    // Basic phone validation for at least 10 digits
    const cleaned = String(phone).replace(/\D/g, '');
    return cleaned.length >= 10;
  };

  const showError = (inputElement, message) => {
    const errorEl = inputElement.parentElement.querySelector('.error-message');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add('visible');
    }
    inputElement.classList.add('input-error');
  };

  const clearError = (inputElement) => {
    const errorEl = inputElement.parentElement.querySelector('.error-message');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.classList.remove('visible');
    }
    inputElement.classList.remove('input-error');
  };

  // --------------------------------------------------------------------------
  // 3. Interactive WhatsApp Enquiry Builder Submit
  // --------------------------------------------------------------------------
  window.sendWhatsAppEnquiry = function (e) {
    if (e) e.preventDefault();

    const occasionSelect = document.getElementById('enquiry-occasion');
    const dateInput = document.getElementById('enquiry-date');
    const notesInput = document.getElementById('enquiry-notes');

    const occasion = occasionSelect ? occasionSelect.value : 'Wedding / Muhurtham';
    const eventDate = dateInput && dateInput.value ? dateInput.value : 'Not fixed yet';
    const notes = notesInput && notesInput.value ? notesInput.value.trim() : 'I would like to consult on designs, color matching, and quotation.';

    const phoneNum = window.ATELIER_CONFIG?.whatsappNumber || '919842102938';

    const formattedMessage =
      `*New Atelier Enquiry — ${window.ATELIER_CONFIG?.brandName || 'Madurai Kisna Aari Works'}*%0A%0A` +
      `*Service Required:* ${encodeURIComponent(selectedService)}%0A` +
      `*Occasion:* ${encodeURIComponent(occasion)}%0A` +
      `*Target Event Date:* ${encodeURIComponent(eventDate)}%0A` +
      `*Design & Saree Notes:* ${encodeURIComponent(notes)}%0A%0A` +
      `Please connect me with your Master Designer for a 1:1 consultation and quotation.`;

    const whatsappUrl = `https://wa.me/${phoneNum}?text=${formattedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', window.sendWhatsAppEnquiry);
  }

  // --------------------------------------------------------------------------
  // 4. Studio Fitting Reservation Form Submit
  // --------------------------------------------------------------------------
  if (fittingForm) {
    fittingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = fittingForm.querySelector('input[type="text"]');
      const phoneInput = fittingForm.querySelector('input[type="tel"]');
      const dateInput = fittingForm.querySelector('input[type="date"]');

      let isValid = true;

      if (nameInput && !nameInput.value.trim()) {
        showError(nameInput, 'Please enter your name.');
        isValid = false;
      } else if (nameInput) {
        clearError(nameInput);
      }

      if (phoneInput && !validatePhone(phoneInput.value)) {
        showError(phoneInput, 'Please enter a valid 10-digit phone number.');
        isValid = false;
      } else if (phoneInput) {
        clearError(phoneInput);
      }

      if (!isValid) return;

      // Display Success Confirmation
      alert(`Thank you, ${nameInput.value.trim()}! Your private studio fitting request has been received. Our Studio Manager will call you shortly to confirm your time slot.`);
      fittingForm.reset();
    });
  }

  // --------------------------------------------------------------------------
  // Stitch Contact Form — sends WhatsApp message
  // --------------------------------------------------------------------------
  const stitchForm = document.getElementById('stitch-contact-form');
  if (stitchForm) {
    stitchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('sc-name').value.trim();
      const phone = document.getElementById('sc-phone').value.trim();
      const message = document.getElementById('sc-message').value.trim();
      if (!name || !phone) return;
      const waText = encodeURIComponent(`Hello Madurai Kisna Aari Works!\n\nName: ${name}\nPhone: ${phone}\nMessage: ${message || '(no message)'}`);
      window.open(`https://wa.me/919842102938?text=${waText}`, '_blank', 'noopener,noreferrer');
      stitchForm.reset();
    });
  }
});
