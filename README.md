# AEID (A.E.I.D.) – QR Digital Identity App

AEID (short for **Automated Encrypted Identity**) is a privacy-first, mobile-based identity system designed to streamline digital verification through QR codes. Users can securely upload documents, get AI and KYC-verified, and generate a tamper-proof digital ID stored on their device and backed by decentralized ID logic.

---

## 🚀 Features
- Upload and locally store verification documents
- AI and KYC identity verification (Gemini 1.5 + demo KYC API)
- Generate a DID (Decentralized Identity)
- Create and display a QR code for identity sharing
- 2FA security (Face ID, OTP)
- Offline-first architecture with encrypted storage support

---

## 🧱 Tech Stack

### ✅ Frontend
- React Native (Expo)
- Expo Router
- TypeScript
- EAS Build

### 📦 Storage
- Firebase (Firestore for user info)
- QR Code
- Encrypted Local Storage (optional)

### 🔐 Verification & Identity
- AI Verification (Gemini 1.5)
- KYC Verification (demo-ready)
- DID Generation
- 2FA (Face ID, OTP)

---

## 📲 Build Instructions

### Android:
```bash
npx eas build -p android --profile preview
```

### iOS:
```bash
npx eas build -p ios
```
*Apple Developer Account required for iOS builds*

---

## 📁 Folder Structure (Simplified)
```
.expo/
.vscode/
app/
assets/
node_modules/
scripts/
.gitignore
app.json
eas.json
expo-env.d.ts
package-lock.json
package.json
README.md
tsconfig.json

```

---

## 📩 Contact / Collaboration
Want to contribute or integrate AEID into your fintech product? Reach out!

---

Made with ❤️ using Expo by Team Monarch.