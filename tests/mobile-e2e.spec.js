const { test, expect } = require('@playwright/test');

test.describe('Mobile Viewport Perfection & Layout Verification', () => {

  test('Header is properly visible and does not overlap hero content', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const nav = page.locator('.f-nav');
    await expect(nav).toBeVisible();

    // Check nav does not exceed viewport width
    const navBox = await nav.boundingBox();
    const vp = page.viewportSize();
    expect(navBox.width).toBeLessThanOrEqual(vp.width + 1);

    // Check logo and hamburger are visible and within bounds
    const logo = page.locator('.f-nav-logo');
    await expect(logo).toBeVisible();
    const hamburger = page.locator('#f-hamburger');
    await expect(hamburger).toBeVisible();

    const hamburgerBox = await hamburger.boundingBox();
    expect(hamburgerBox.x + hamburgerBox.width).toBeLessThanOrEqual(vp.width + 1);

    // Check hero content starts cleanly below header
    const heroBadges = page.locator('.f-hero-badges');
    const badgesBox = await heroBadges.boundingBox();
    expect(badgesBox.y).toBeGreaterThanOrEqual(navBox.y + navBox.height - 5);
  });

  test('No horizontal page overflow on full page scroll', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const vp = page.viewportSize();

    // Check scroll width at top
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(scrollWidth).toBeLessThanOrEqual(vp.width);

    // Scroll through page to test all sections
    const heights = [200, 600, 1200, 2000, 3000, 4000];
    for (const y of heights) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(50);
      const currentScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(currentScrollWidth).toBeLessThanOrEqual(vp.width);
    }
  });

  test('Mobile drawer menu opens, covers screen properly, and closes cleanly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const hamburger = page.locator('#f-hamburger');
    const mobileMenu = page.locator('#f-mobile-menu');

    // Initially closed
    await expect(mobileMenu).not.toHaveClass(/is-open/);

    // Open menu
    await hamburger.click();
    await expect(mobileMenu).toHaveClass(/is-open/);
    await expect(mobileMenu).toBeVisible();

    // Verify menu covers full viewport width
    const menuBox = await mobileMenu.boundingBox();
    const vp = page.viewportSize();
    expect(menuBox.width).toBeGreaterThanOrEqual(vp.width - 2);

    // Close using close button
    const closeBtn = page.locator('#f-mobile-close');
    await closeBtn.click();
    await expect(mobileMenu).not.toHaveClass(/is-open/);
  });

  test('Clicking CTA button opens design modal cleanly', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const heroCta = page.locator('.f-hero-actions button[data-open-modal="true"]');
    await heroCta.click();

    const modalOverlay = page.locator('#f-modal-overlay');
    await expect(modalOverlay).toBeVisible();
    await expect(modalOverlay).toHaveClass(/is-open/);

    // Close modal
    const modalClose = page.locator('#f-modal-close');
    await modalClose.click();
    await expect(modalOverlay).not.toHaveClass(/is-open/);
  });

  test('Footer and floating WhatsApp links point to +91 63849 98100', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const waFloat = page.locator('.f-whatsapp-float');
    await expect(waFloat).toHaveAttribute('href', /wa\.me\/916384998100/);

    const footerPhone = page.locator('a[href^="tel:"]');
    await expect(footerPhone.first()).toHaveAttribute('href', 'tel:+916384998100');
  });

});
