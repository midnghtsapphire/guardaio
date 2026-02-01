/**
 * DeepGuard Mobile Deployment Utilities
 * 
 * This module provides helper functions and configuration for deploying
 * the DeepGuard application to iOS App Store and Google Play Store.
 * 
 * @module mobile-deploy
 * @version 1.0.0
 */

// ============================================================================
// APP STORE METADATA
// ============================================================================

export const appStoreMetadata = {
  // Apple App Store
  ios: {
    appId: 'app.lovable.7cfb769f672d44b286db9ddcc712f9eb',
    bundleId: 'app.lovable.deepguard',
    appName: 'DeepGuard - AI Deepfake Detection',
    subtitle: 'Protect Yourself from Synthetic Media',
    description: `DeepGuard uses advanced AI to detect deepfake images, videos, and audio in real-time. Protect yourself and loved ones from AI-generated scams, virtual kidnapping, romance fraud, and synthetic media manipulation.

FEATURES:
• Real-time deepfake detection for images, videos, and audio
• Voice cloning detection for scam prevention
• URL/website verification
• Reverse image search
• Batch file analysis
• Detailed manipulation heatmaps
• PDF report generation
• Share analysis results

WHY DEEPGUARD:
In 2024, Americans lost over $12.5 billion to fraud, with deepfakes playing an increasing role. DeepGuard helps you:
- Verify suspicious photos and videos
- Detect AI-cloned voices in scam calls
- Protect elderly family members from romance scams
- Identify pig butchering and virtual kidnapping attempts

PRIVACY FIRST:
Your media is analyzed securely and never stored. DeepGuard is GDPR compliant and respects your privacy.`,
    keywords: [
      'deepfake',
      'detection',
      'ai',
      'synthetic media',
      'scam prevention',
      'voice cloning',
      'fake video',
      'fraud protection',
      'security',
      'privacy',
    ],
    category: 'Utilities',
    secondaryCategory: 'Photo & Video',
    ageRating: '12+',
    price: 'Free',
    inAppPurchases: true,
    screenshots: {
      iphone6_5: ['iPhone 6.5" screenshots'],
      iphone5_5: ['iPhone 5.5" screenshots'],
      ipad: ['iPad screenshots'],
    },
    supportUrl: 'https://deepguard.ai/help',
    marketingUrl: 'https://deepguard.ai',
    privacyUrl: 'https://deepguard.ai/privacy',
  },

  // Google Play Store
  android: {
    packageName: 'app.lovable.deepguard',
    appName: 'DeepGuard - AI Deepfake Detection',
    shortDescription: 'Detect deepfake images, videos & audio. Protect from AI scams.',
    fullDescription: `DeepGuard uses advanced AI to detect deepfake images, videos, and audio in real-time. Protect yourself and loved ones from AI-generated scams, virtual kidnapping, romance fraud, and synthetic media manipulation.

★ POWERFUL DETECTION
Real-time analysis of photos, videos, and audio files to identify AI-generated or manipulated content.

★ SCAM PROTECTION
Detect voice cloning attempts used in virtual kidnapping, grandparent scams, and business email compromise.

★ ROMANCE SCAM DEFENSE
Verify profile photos and video calls to protect against pig butchering and romance fraud.

★ COMPREHENSIVE ANALYSIS
• Image deepfake detection
• Video face swap identification
• Audio voice cloning detection
• URL/website verification
• Reverse image search
• Batch file processing

★ DETAILED REPORTS
Get manipulation heatmaps, confidence scores, and exportable PDF reports for each analysis.

★ PRIVACY FOCUSED
Your media is analyzed securely and never stored. GDPR compliant.

Download DeepGuard today and stay protected from synthetic media threats.`,
    category: 'Tools',
    contentRating: 'Everyone',
    targetAge: 'All ages',
    contactEmail: 'support@deepguard.ai',
    privacyPolicy: 'https://deepguard.ai/privacy',
    tags: [
      'deepfake',
      'ai detection',
      'scam protection',
      'security',
      'privacy',
      'fake video',
      'voice cloning',
    ],
  },
};

// ============================================================================
// BUILD CONFIGURATION
// ============================================================================

export const buildConfig = {
  // Version info (update before each release)
  version: '1.0.0',
  buildNumber: 1,
  
  // Android-specific
  android: {
    minSdkVersion: 22,
    targetSdkVersion: 34,
    compileSdkVersion: 34,
    versionCode: 1,
    versionName: '1.0.0',
    signingConfig: {
      keyAlias: 'deepguard',
      keystorePath: './android/app/deepguard.keystore',
    },
  },

  // iOS-specific
  ios: {
    deploymentTarget: '14.0',
    swiftVersion: '5.0',
    bundleVersion: '1',
    bundleShortVersion: '1.0.0',
    teamId: 'YOUR_TEAM_ID', // Replace with Apple Developer Team ID
    provisioningProfile: 'DeepGuard App Store',
  },
};

// ============================================================================
// DEPLOYMENT CHECKLIST
// ============================================================================

export const deploymentChecklist = {
  preBuild: [
    'Update version numbers in capacitor.config.ts',
    'Update version numbers in package.json',
    'Run npm run build to create production bundle',
    'Run npx cap sync to sync web assets',
    'Test on physical devices before submission',
  ],

  android: [
    'Generate signed APK/AAB: cd android && ./gradlew bundleRelease',
    'APK location: android/app/build/outputs/apk/release/',
    'AAB location: android/app/build/outputs/bundle/release/',
    'Create Google Play Developer account ($25 one-time)',
    'Upload AAB to Google Play Console',
    'Fill in store listing metadata',
    'Upload screenshots (phone, 7" tablet, 10" tablet)',
    'Upload feature graphic (1024x500)',
    'Upload app icon (512x512)',
    'Complete content rating questionnaire',
    'Set up pricing and distribution',
    'Submit for review (typically 1-3 days)',
  ],

  ios: [
    'Open Xcode: cd ios && open App.xcworkspace',
    'Select "Any iOS Device" as build target',
    'Product > Archive to create archive',
    'Window > Organizer to access archive',
    'Distribute App > App Store Connect',
    'Create App Store Connect record',
    'Upload screenshots for all device sizes',
    'Fill in app metadata and description',
    'Submit for App Review (typically 1-2 days)',
  ],

  postSubmission: [
    'Monitor review status in respective consoles',
    'Respond promptly to any review feedback',
    'Prepare release notes for each version',
    'Set up crash reporting (Firebase Crashlytics)',
    'Configure analytics (Firebase Analytics)',
    'Set up push notification certificates',
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if running in a Capacitor native context
 */
export function isNative(): boolean {
  return typeof (window as any).Capacitor !== 'undefined';
}

/**
 * Check if running on iOS
 */
export function isIOS(): boolean {
  return isNative() && (window as any).Capacitor?.getPlatform() === 'ios';
}

/**
 * Check if running on Android
 */
export function isAndroid(): boolean {
  return isNative() && (window as any).Capacitor?.getPlatform() === 'android';
}

/**
 * Get current platform
 */
export function getPlatform(): 'ios' | 'android' | 'web' {
  if (isIOS()) return 'ios';
  if (isAndroid()) return 'android';
  return 'web';
}

/**
 * Get safe area insets for notched devices
 */
export function getSafeAreaInsets(): { top: number; bottom: number; left: number; right: number } {
  const style = getComputedStyle(document.documentElement);
  return {
    top: parseInt(style.getPropertyValue('--sat') || '0', 10),
    bottom: parseInt(style.getPropertyValue('--sab') || '0', 10),
    left: parseInt(style.getPropertyValue('--sal') || '0', 10),
    right: parseInt(style.getPropertyValue('--sar') || '0', 10),
  };
}

// ============================================================================
// CLI COMMANDS REFERENCE
// ============================================================================

export const cliCommands = `
# ============================================================================
# DEEPGUARD MOBILE APP BUILD COMMANDS
# ============================================================================

# INITIAL SETUP (one time only)
# ----------------------------

# 1. Clone the repository
git clone <your-github-repo-url>
cd deepguard

# 2. Install dependencies
npm install

# 3. Add Capacitor platforms
npx cap add android
npx cap add ios

# 4. Build web assets
npm run build

# 5. Sync to native platforms
npx cap sync


# DEVELOPMENT
# -----------

# Run on Android emulator/device
npx cap run android

# Run on iOS simulator (Mac only)
npx cap run ios

# Open Android Studio
npx cap open android

# Open Xcode (Mac only)
npx cap open ios


# PRODUCTION BUILD - ANDROID
# --------------------------

# 1. Build web assets
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Build APK (debug)
cd android && ./gradlew assembleDebug
# APK at: android/app/build/outputs/apk/debug/app-debug.apk

# 4. Build APK (release - requires signing key)
cd android && ./gradlew assembleRelease
# APK at: android/app/build/outputs/apk/release/app-release.apk

# 5. Build AAB for Play Store (recommended)
cd android && ./gradlew bundleRelease
# AAB at: android/app/build/outputs/bundle/release/app-release.aab


# PRODUCTION BUILD - iOS
# ----------------------

# 1. Build web assets
npm run build

# 2. Sync to iOS
npx cap sync ios

# 3. Open Xcode
npx cap open ios

# 4. In Xcode:
#    - Select "Any iOS Device (arm64)" as target
#    - Product > Archive
#    - Window > Organizer
#    - Distribute App > App Store Connect


# USEFUL COMMANDS
# ---------------

# Update Capacitor dependencies
npx cap update

# Check Capacitor doctor
npx cap doctor

# List connected devices
npx cap list

# Copy web assets only (without full sync)
npx cap copy
`;

export default {
  appStoreMetadata,
  buildConfig,
  deploymentChecklist,
  cliCommands,
  isNative,
  isIOS,
  isAndroid,
  getPlatform,
  getSafeAreaInsets,
};
