# Guardaio Manual Testing Guide

Complete testing documentation for QA verification of the Guardaio deepfake detection platform.

---

## Table of Contents

1. [In-App QA Agent](#in-app-qa-agent)
2. [Manual Testing Procedures](#manual-testing-procedures)
3. [Test Categories](#test-categories)
4. [Environment Setup](#environment-setup)
5. [Reporting Issues](#reporting-issues)

---

## In-App QA Agent

Guardaio includes a powerful **automated QA Agent** accessible from the Admin Panel. This LLM-powered testing tool runs 25+ scenarios across multiple categories.

### Accessing the QA Agent

1. Navigate to `/admin`
2. Click the **"QA Agent"** tab in the navigation
3. The QA dashboard will load with configuration options

### QA Agent Features

| Feature | Description |
|---------|-------------|
| **Automated Test Suites** | Pre-configured scenarios for Core, Auth, Security, Accessibility, Performance, and E2E |
| **Configurable Categories** | Toggle which test categories to include |
| **Real-time Logging** | Verbose output showing each test step |
| **Progress Tracking** | Visual progress bar and status indicators |
| **Report Generation** | Summary statistics with pass/fail counts and recommendations |
| **Critical Issue Alerts** | Highlights security and core functionality failures |

### Configuration Options

Before running tests, configure which categories to include:

- ✅ **Include Accessibility** - WCAG compliance, keyboard nav, screen reader support
- ✅ **Include Security** - XSS, CSRF, RLS policies, input validation
- ✅ **Include Performance** - Load times, Core Web Vitals, API latency
- ✅ **Include E2E** - Full user journey tests
- ✅ **Include Metadata** - EXIF parsing, AI detection, anomaly tracking
- ✅ **Verbose Logging** - Show detailed step-by-step output

### Running the QA Agent

1. Configure desired test categories
2. Click **"Run QA Agent"** button
3. Watch real-time progress in the log panel
4. Review final report with:
   - Total tests run
   - Pass/fail counts
   - Coverage percentage
   - Critical issues list
   - Recommendations

### Interpreting Results

| Status | Icon | Meaning |
|--------|------|---------|
| Pending | ⏳ | Test not yet run |
| Running | 🔄 | Currently executing |
| Passed | ✅ | Test completed successfully |
| Failed | ❌ | Test found an issue |
| Skipped | ⏭️ | Test excluded by config |

---

## Manual Testing Procedures

While the QA Agent automates many tests, manual verification is essential for UX and edge cases.

### Pre-Testing Checklist

- [ ] Clear browser cache and cookies
- [ ] Test in incognito/private mode
- [ ] Have test accounts ready (admin + regular user)
- [ ] Prepare test files (images, audio, URLs)
- [ ] Note browser and device being used

---

## Test Categories

### 1. Core Functionality

#### 1.1 Image Upload & Analysis

**Steps:**
1. Navigate to homepage or `/analyzer`
2. Click upload area or drag-and-drop an image
3. Wait for analysis to complete
4. Verify results display

**Expected Results:**
- [ ] Upload progress indicator appears
- [ ] Analysis loading state shows (skeleton/spinner)
- [ ] Results show confidence score (0-100%)
- [ ] Findings list displays detected issues
- [ ] Status indicator (Authentic/Suspicious/AI-Generated)

**Test Files:**
- Use demo samples from the app
- Test with: JPEG, PNG, WebP formats
- Test with: Small (<100KB), Medium (1-5MB), Large (>10MB) files

#### 1.2 Audio Analysis

**Steps:**
1. Navigate to audio analyzer section
2. Upload audio file OR use microphone recording
3. Wait for processing
4. Review forensic results

**Expected Results:**
- [ ] Waveform visualization renders
- [ ] Spectral analysis displays
- [ ] Voice pattern detection works
- [ ] Results indicate synthetic vs natural audio

#### 1.3 URL Analysis

**Steps:**
1. Enter a valid URL in the URL analyzer
2. Submit for analysis
3. Wait for content extraction

**Expected Results:**
- [ ] URL validation works (rejects invalid URLs)
- [ ] Loading state displays
- [ ] Extracted media shown
- [ ] Analysis results for any detected images/videos

#### 1.4 Batch Processing

**Steps:**
1. Select multiple files (2-10)
2. Start batch analysis
3. Monitor progress

**Expected Results:**
- [ ] All files queued correctly
- [ ] Progress shown per file
- [ ] Summary report generated
- [ ] Export options available (PDF)

---

### 2. Authentication

#### 2.1 Sign Up Flow

**Steps:**
1. Navigate to `/auth`
2. Click "Sign Up" tab
3. Enter email and password
4. Submit form

**Expected Results:**
- [ ] Form validation works (invalid email, weak password)
- [ ] Success message displays
- [ ] Confirmation email sent (check inbox)
- [ ] Redirect after confirmation

#### 2.2 Sign In Flow

**Steps:**
1. Navigate to `/auth`
2. Enter valid credentials
3. Click "Sign In"

**Expected Results:**
- [ ] Loading state on button
- [ ] Successful redirect to dashboard/home
- [ ] User menu shows in navbar
- [ ] Session persists on refresh

#### 2.3 Social Login (Google/Apple)

**Steps:**
1. Click "Continue with Google" or "Continue with Apple"
2. Complete OAuth flow
3. Return to app

**Expected Results:**
- [ ] OAuth popup/redirect works
- [ ] Account created or linked
- [ ] Profile populated from provider
- [ ] Session established

#### 2.4 Sign Out

**Steps:**
1. Click user menu in navbar
2. Select "Sign Out"

**Expected Results:**
- [ ] Session cleared
- [ ] Redirect to home or auth page
- [ ] Protected routes no longer accessible

---

### 3. Admin Panel

#### 3.1 Access Control

**Steps:**
1. Ensure user has admin role in `user_roles` table
2. Navigate to `/admin`

**Expected Results:**
- [ ] Admin panel loads (demo mode allows bypass)
- [ ] All tabs accessible
- [ ] Stats cards display data

#### 3.2 Subscription Manager

**Steps:**
1. Click "Subscriptions" tab
2. Wait for data to load
3. Test search and filters

**Expected Results:**
- [ ] **Skeleton loading states appear** while fetching
- [ ] Stats cards show MRR, active subscribers, revenue
- [ ] Subscription table populates with Stripe data
- [ ] Search filters work correctly
- [ ] "View Details" dialog opens
- [ ] Refresh button fetches new data

**Skeleton Verification (see `/docs/testing-skeletons.md`):**
- [ ] 6 stat cards show skeleton placeholders
- [ ] Table shows 5 skeleton rows
- [ ] Skeletons animate (pulse effect)
- [ ] Smooth transition when data loads

#### 3.3 Content Manager

**Steps:**
1. Click "Content" tab
2. Edit text fields
3. Save changes

**Expected Results:**
- [ ] All editable fields load current values
- [ ] Changes save successfully
- [ ] Toast notification confirms save

#### 3.4 QA Agent (see above section)

---

### 4. Accessibility

#### 4.1 Keyboard Navigation

**Steps:**
1. Start at top of page
2. Press Tab repeatedly
3. Test Enter/Space on interactive elements

**Expected Results:**
- [ ] Focus visible on all elements
- [ ] Logical tab order
- [ ] Buttons/links activate with Enter
- [ ] Dropdowns work with arrow keys

#### 4.2 Screen Reader

**Steps:**
1. Enable VoiceOver (Mac) or NVDA (Windows)
2. Navigate through page

**Expected Results:**
- [ ] All images have alt text
- [ ] Form fields have labels
- [ ] Dynamic content announced
- [ ] Heading hierarchy correct (H1 → H2 → H3)

#### 4.3 Theme Toggle

**Steps:**
1. Click theme toggle in navbar
2. Switch between light/dark modes

**Expected Results:**
- [ ] Colors switch appropriately
- [ ] No flash of unstyled content
- [ ] Preference persists on refresh

#### 4.4 Accessibility Menu

**Steps:**
1. Open accessibility menu (icon in navbar)
2. Toggle each option

**Expected Results:**
- [ ] High contrast mode works
- [ ] Reduced motion disables animations
- [ ] Dyslexia font option toggles
- [ ] Focus mode overlay appears

---

### 5. Subscriptions & Payments

#### 5.1 Pricing Page

**Steps:**
1. Navigate to `/pricing` or pricing section
2. Review plan options

**Expected Results:**
- [ ] All tiers displayed
- [ ] Prices correct
- [ ] Feature lists accurate
- [ ] CTA buttons functional

#### 5.2 Checkout Flow

**Steps:**
1. Click "Subscribe" on a plan
2. Complete Stripe checkout (use test card 4242...)
3. Return to app

**Expected Results:**
- [ ] Redirects to Stripe checkout
- [ ] Payment processes
- [ ] Success redirect works
- [ ] Subscription status updates

#### 5.3 Customer Portal

**Steps:**
1. As subscribed user, click "Manage Subscription"
2. Access Stripe Customer Portal

**Expected Results:**
- [ ] Portal opens in new tab
- [ ] Can view invoices
- [ ] Can cancel/modify subscription

---

### 6. Performance

#### 6.1 Page Load

**Steps:**
1. Open DevTools → Network
2. Hard refresh page
3. Note load times

**Expected Results:**
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.8s

#### 6.2 Analysis Speed

**Steps:**
1. Upload test image
2. Time from upload to results

**Expected Results:**
- [ ] Small images: < 3 seconds
- [ ] Large images: < 10 seconds
- [ ] Progress indication throughout

---

### 7. Responsive Design

#### 7.1 Mobile (375px - 768px)

**Check:**
- [ ] Navigation collapses to hamburger menu
- [ ] Touch targets minimum 44x44px
- [ ] No horizontal scrolling
- [ ] Upload works on mobile

#### 7.2 Tablet (768px - 1024px)

**Check:**
- [ ] Layout adapts appropriately
- [ ] Cards stack or grid correctly
- [ ] Admin panel usable

#### 7.3 Desktop (1024px+)

**Check:**
- [ ] Full navigation visible
- [ ] Multi-column layouts work
- [ ] Large upload areas functional

---

## Environment Setup

### Test Accounts

| Role | Email | Purpose |
|------|-------|---------|
| Admin | angelreporters@gmail.com | Full admin access |
| User | testuser@example.com | Regular user testing |

### Test Files

Located in `/src/assets/`:
- `test-image-a.jpg` - Authentic photo
- `test-image-b.jpg` - AI-generated image

### Demo Samples

The app includes built-in demo samples accessible without upload for quick testing.

---

## Reporting Issues

When reporting bugs found during testing:

1. **Title**: Brief description of the issue
2. **Steps to Reproduce**: Numbered list of exact actions
3. **Expected Result**: What should happen
4. **Actual Result**: What actually happened
5. **Environment**: Browser, device, screen size
6. **Screenshots/Videos**: If applicable
7. **Console Errors**: Copy any errors from DevTools

### Severity Levels

| Level | Definition | Example |
|-------|------------|---------|
| **Critical** | App unusable, data loss | Analysis fails completely |
| **High** | Major feature broken | Login doesn't work |
| **Medium** | Feature impaired | Filter doesn't apply |
| **Low** | Minor/cosmetic | Typo, alignment off |

---

## Quick Reference

### Key URLs

| Page | URL |
|------|-----|
| Home | `/` |
| Analyzer | `/` (scroll to analyzer section) |
| Auth | `/auth` |
| Admin | `/admin` |
| Pricing | `/pricing` or homepage |
| History | `/history` |
| Dashboard | `/dashboard` |

### Keyboard Shortcuts

Press `?` to view in-app keyboard shortcuts help.

---

*Last Updated: February 2026*
*Version: 1.0*
