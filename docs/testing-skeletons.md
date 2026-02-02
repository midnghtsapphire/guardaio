# Testing Skeleton Loading States

This guide explains how to verify skeleton loading states work correctly in the Subscription Manager.

## What Are Skeletons?

Skeletons are placeholder UI elements that display animated gray shapes while data is loading. They:
- Show users where content will appear
- Reduce perceived wait time
- Prevent layout shift when data arrives

## Testing the Subscription Manager Skeletons

### Prerequisites
1. Admin account with role assigned (e.g., angelreporters@gmail.com)
2. Stripe integration connected with STRIPE_SECRET_KEY configured

### Step-by-Step Testing

#### Step 1: Log In
1. Navigate to the app homepage
2. Click "Sign In" in the navbar
3. Enter your admin credentials
4. Wait for successful authentication

#### Step 2: Navigate to Admin Panel
1. Go to `/admin` in the URL bar, OR
2. Click "Admin" link in the footer (Resources column)

#### Step 3: Open Subscriptions Tab
1. In the Admin panel, locate the tab navigation
2. Click on "Subscriptions" tab

#### Step 4: Observe Skeleton States

**Stats Cards Skeletons:**
- You should see 6 stat cards at the top
- Each card shows a `Skeleton` placeholder for the main number while loading
- Example: "Active Subscribers" shows a gray animated box instead of the count

**Table Row Skeletons:**
- The subscriptions table shows 5 placeholder rows
- Each row displays skeletons for:
  - Customer name and email (2 lines)
  - Plan badge (rounded pill shape)
  - Status badge (rounded pill shape)
  - Amount text
  - Date text
  - Action buttons (2 small squares)

#### Step 5: Verify Transition
1. Once data loads, skeletons should smoothly disappear
2. Real subscription data replaces the placeholders
3. No layout shift should occur (content appears in same positions)

### Testing Tips

**Simulate Slow Loading:**
To see skeletons for longer, you can:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Set throttling to "Slow 3G"
4. Refresh the page

**Force Re-fetch:**
1. Click the "Refresh" button in the Subscription Manager header
2. Skeletons should briefly appear while new data loads

### Expected Behavior

| State | Stats Cards | Table |
|-------|-------------|-------|
| Loading (no data yet) | Skeleton boxes for numbers | 5 skeleton rows |
| Loading (with cached data) | Real numbers shown | Real rows shown |
| Loaded | Real numbers | Real subscription rows |
| Error | Toast notification | Empty or error state |

### Skeleton Components Used

```tsx
// Stats card skeleton
<Skeleton className="h-10 w-16" />

// Table row skeletons
<Skeleton className="h-4 w-32" />  // Customer name
<Skeleton className="h-3 w-40" />  // Email
<Skeleton className="h-6 w-16 rounded-full" />  // Plan badge
<Skeleton className="h-6 w-20 rounded-full" />  // Status badge
<Skeleton className="h-4 w-20" />  // Amount
<Skeleton className="h-4 w-24" />  // Date
<Skeleton className="h-8 w-8 rounded" />  // Action buttons
```

### Troubleshooting

**Skeletons don't appear:**
- Data may be loading too fast (check network speed)
- Check if `isLoading` state is being set correctly

**Skeletons never disappear:**
- Check console for API errors
- Verify STRIPE_SECRET_KEY is configured
- Ensure user has admin role

**Layout shifts when data loads:**
- Skeleton dimensions should match real content
- Adjust skeleton widths if needed
