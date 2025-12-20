# Firebase Environment Variables for Vercel

## ✅ Checklist: Add These to Vercel

Copy and paste each variable into Vercel's Environment Variables page:

### Variable 1: API Key
```
Key:   NEXT_PUBLIC_FIREBASE_API_KEY
Value: AIzaSyBq8ReTTsAwK95h79VGuTBAUk9T3qN-XiU
```

### Variable 2: Auth Domain
```
Key:   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: car-smart-park.firebaseapp.com
```

### Variable 3: Project ID
```
Key:   NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: car-smart-park
```

### Variable 4: Storage Bucket
```
Key:   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: car-smart-park.firebasestorage.app
```

### Variable 5: Messaging Sender ID
```
Key:   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: 26831404794
```

### Variable 6: App ID
```
Key:   NEXT_PUBLIC_FIREBASE_APP_ID
Value: 1:26831404794:web:d7d0ae1d7f94bd17869343
```

---

## 📋 Quick Reference (All Variables)

For easy copy-paste:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBq8ReTTsAwK95h79VGuTBAUk9T3qN-XiU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=car-smart-park.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=car-smart-park
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=car-smart-park.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=26831404794
NEXT_PUBLIC_FIREBASE_APP_ID=1:26831404794:web:d7d0ae1d7f94bd17869343
```

---

## 🎯 Steps to Add in Vercel

You're currently on: https://vercel.com/husam05s-projects/car-smart-park/settings/environment-variables

1. **For each variable above:**
   - Click "Add New" or "Add" button
   - Paste the **Key** (e.g., `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - Paste the **Value** (e.g., `AIzaSyBq8ReTTsAwK95h79VGuTBAUk9T3qN-XiU`)
   - Select **Production** (or all environments)
   - Click **Save**

2. **After adding all 6 variables:**
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**
   - Wait 2-3 minutes

3. **Test the deployment:**
   - Visit https://car-smart-park.vercel.app/
   - Open Console (F12)
   - Start simulation
   - Check for Firebase connection messages

---

## ✅ Verification

After redeployment, you should see:
- ✅ Console shows "Connected to Firebase" instead of "Local Simulation Mode"
- ✅ Data persists in Firebase Firestore
- ✅ Real-time updates across devices

---

## 🔐 Security Note

These environment variables are safe to expose in the browser because:
- They're prefixed with `NEXT_PUBLIC_` (client-side variables)
- Firebase security is handled by Firestore Security Rules
- The API key is not a secret - it identifies your Firebase project

However, you should:
- ✅ Set up Firestore Security Rules (already configured in `firestore.rules`)
- ✅ Enable Firebase Authentication if needed
- ✅ Monitor Firebase usage in the Firebase Console
