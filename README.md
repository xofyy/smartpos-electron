# SmartPOS Lite 🚀

**SmartPOS Lite** is a modern, offline-capable Point of Sale (POS) application designed for small retail businesses. Built with **Electron**, **React**, and **SQLite**, it offers a fast, reliable, and user-friendly experience for managing products and processing sales.

![SmartPOS Lite](resources/icon.png)

## ✨ Key Features

### 📦 Product Management
- **Inventory Control**: Add, edit, and delete products with ease.
- **Real-time Search**: Instantly find products by name or barcode.
- **Stock Tracking**: Automatic stock reduction after sales.
- **Barcode Support**: Seamless integration with USB/Serial barcode scanners.

### 💰 Sales Interface
- **Fast Checkout**: Optimized for speed with keyboard shortcuts and scanner support.
- **Cart System**: Dynamic cart with quantity adjustments and item removal.
- **Payment Options**: Support for Cash and Credit Card transactions.

### ⚙️ Hardware & Settings
- **Hardware Integration**:
  - **Barcode Scanners**: HID (Keyboard mode) and Serial Port support.
  - **POS Devices**: Serial port communication for POS hardware.
- **Customization**:
  - **Theme**: Toggle between Dark 🌙 and Light ☀️ modes.
  - **Language**: Full support for Turkish 🇹🇷 and English 🇺🇸.
  - **Currency**: Customizable currency symbol (₺, $, €, etc.).
- **Data Safety**:
  - **Backup & Restore**: One-click database backup.
  - **Factory Reset**: Quickly reset the application to default settings.

### 🛠️ Tech Stack
- **Core**: [Electron](https://www.electronjs.org/) (v33)
- **Frontend**: [React](https://react.dev/) (v19), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [SQLite](https://www.sqlite.org/) (via `better-sqlite3`)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Build Tool**: [Electron Vite](https://electron-vite.org/)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/xofyy/smartpos-electron.git
    cd smartpos-electron
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Start Development Server**
    ```bash
    npm run dev
    ```

## 📦 Building for Production

To create an optimized installer for your operating system:

### Windows
```bash
npm run build:win
```
*Output: `dist/SmartPOS.Lite-Setup-x.x.x.exe`*

### macOS
```bash
npm run build:mac
```

### Linux
```bash
npm run build:linux
```

## 🔄 Auto-Updates
SmartPOS Lite includes a built-in auto-update system.
- **Check for Updates**: Go to *Settings > General* to check for new versions.
- **Automatic**: The app checks for updates on startup and notifies you if a new version is available.

## 📄 License
This project is licensed under the MIT License.

---
*Developed with ❤️ by the SmartPOS Team.*
