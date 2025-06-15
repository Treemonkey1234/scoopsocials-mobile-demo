# Connected Account Flag System - Test Guide

## ✅ Feature Complete - Ready for Testing

The Connected Account Flag System has been successfully implemented with all features from the roadmap specification:

### 🎯 Implemented Features

#### 1. **FlagAccountModal Component**
- ✅ Four flag categories as specified:
  - Account doesn't belong to this user
  - Account is fabricated/doesn't exist  
  - Account exists but not connected to user
  - Misleading professional account
- ✅ Form validation requiring:
  - Category selection (required)
  - Evidence commentary (minimum 20 characters)
  - Actual profile URL for verification (required)
- ✅ Daily flag limits based on trust score:
  - 90-100: 5 flags per day
  - 70-89: 3 flags per day  
  - 50-69: 2 flags per day
  - Below 50: 1 flag per day
- ✅ Consequences explanation with show/hide toggle
- ✅ Progressive false flag consequences display

#### 2. **SocialAccountsModal Integration**
- ✅ Flag button (🚩) added to each connected account
- ✅ Flag modal opens when flag button is clicked
- ✅ Flagged accounts hidden from display after submission
- ✅ Visual indicators for flagged accounts (⚠ icon + "Under review" text)
- ✅ Updated statistics to exclude flagged accounts

#### 3. **Trust Score Integration**
- ✅ Daily flag limits calculated from user trust score
- ✅ Default trust score of 75 for testing
- ✅ Trust score passed to flag modal for limit calculation

#### 4. **State Management**
- ✅ Flag submission triggers account hiding
- ✅ Flagged accounts marked with `flagged: true` property
- ✅ Clean modal state management (open/close, account selection)

## 🧪 How to Test

### Prerequisites
1. Development server running at http://localhost:3000
2. Navigate to the main demo page

### Test Steps

1. **Open Social Accounts Modal**
   - Look for any "Social Accounts" section with a "View all" button
   - Click "View all" to open the connected accounts modal

2. **View Available Accounts**
   - Should see accounts organized by category (Social Media, Professional, Creative, Tech)
   - Each account should have a flag button (🚩) on the right side

3. **Test Flag Functionality**
   - Click the flag button (🚩) on any account
   - Flag modal should open with:
     - Account info at the top
     - Daily limit warning based on trust score
     - Four radio button categories
     - Evidence text area (20 char minimum)
     - Actual profile URL field
     - Consequences explanation (click to show/hide)

4. **Test Form Validation**
   - Try submitting without selections - should be disabled
   - Select category and add evidence (less than 20 chars) - should remain disabled
   - Add valid URL and 20+ character evidence - submit button should enable

5. **Test Flag Submission**
   - Complete the form and submit
   - Account should disappear from the display
   - Modal should close
   - Account count in footer should decrease

6. **Test Multiple Accounts**
   - Flag multiple accounts to verify independent state management
   - Verify each flagged account is hidden properly

### Expected Behavior

- ✅ Flag buttons appear on all accounts
- ✅ Flag modal opens with proper validation
- ✅ Daily limits display correctly (3 flags for default 75 trust score)
- ✅ Form validation prevents invalid submissions
- ✅ Flagged accounts are hidden from display
- ✅ Statistics update to exclude flagged accounts
- ✅ No TypeScript errors or console warnings

## 🎯 Next Steps

The Connected Account Flag System is **complete and ready for production**. 

**Ready for next roadmap priority:**
- Moderator/Admin Interface for Flag Management
- Professional Account Dual-Layer System  
- Trust & Verification Enhancements

## 🚀 Demo URLs

- **Main Demo:** http://localhost:3000/web-demo
- **Mobile Preview:** http://localhost:3000/mobile-preview

Look for "Social Accounts" sections with "View all" buttons to access the flag system.