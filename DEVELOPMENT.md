# HopeFund Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Git installed
- Modern web browser
- Firebase account (for backend features)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/IRONalways17/Money-Collection-Web-APP.git
   cd Money-Collection-Web-APP
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start local development server**
   ```bash
   npm start
   ```
   
   The app will be available at `http://127.0.0.1:3000`

4. **For production build**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
Money-Collection-Web-APP/
├── public/                 # Frontend assets
│   ├── index.html         # Homepage
│   ├── causes.html        # Campaigns listing
│   ├── about.html         # About page
│   ├── contact.html       # Contact form
│   ├── thank-you.html     # Post-donation page
│   ├── css/               # Stylesheets
│   │   ├── main.css       # Design system
│   │   ├── components.css # UI components
│   │   └── responsive.css # Mobile responsiveness
│   ├── js/                # JavaScript modules
│   │   ├── config.js      # Firebase configuration
│   │   ├── utils.js       # Utility functions
│   │   ├── components.js  # UI components
│   │   └── *.js          # Page-specific scripts
│   └── images/            # Assets and icons
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Pages deployment
├── firebase.json          # Firebase configuration
├── firestore.rules        # Database security rules
└── package.json           # Dependencies and scripts
```

## 🎨 Design System

### Colors
- Primary: `#2EC4B6` (Teal)
- Secondary: `#E63946` (Red)
- Success: `#06D6A0` (Green)
- Warning: `#FFB400` (Amber)
- Dark: `#011627` (Navy)
- Light: `#F8F9FA` (Off-white)

### Typography
- Font: Inter (Google Fonts)
- Heading sizes: 2.5rem, 2rem, 1.5rem, 1.25rem
- Body: 1rem (16px base)

### Spacing
- Base unit: 1rem (16px)
- Scale: 0.5, 1, 1.5, 2, 3, 4, 6, 8rem

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Enable Authentication
4. Configure hosting
5. Update `public/js/config.js` with your Firebase config

### Google Pay Setup
1. Get Google Pay API credentials
2. Update the merchantId in payment configuration
3. Test with Google Pay sandbox environment

## 🚀 Deployment

### Automatic Deployment
- Push to `main` branch triggers GitHub Actions
- Automatically deploys to GitHub Pages
- Live at: https://ironalways17.github.io/Money-Collection-Web-APP/

### Manual Deployment
```bash
# Build for production
npm run build

# Deploy to Firebase (optional)
firebase deploy
```

## 🧪 Testing

### Local Testing
```bash
# Start development server
npm start

# Test different devices
# Open browser dev tools and toggle device simulation
```

### Browser Testing
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Responsive Breakpoints

- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader optimized
- High contrast support
- Focus indicators

## 🔒 Security

- Firebase security rules configured
- Input validation and sanitization
- HTTPS only in production
- CSP headers recommended

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support

For questions or issues:
- Open a GitHub issue
- Contact: [Your email]
- Documentation: See README.md

---

Made with ❤️ by Aaryan Choudhary
