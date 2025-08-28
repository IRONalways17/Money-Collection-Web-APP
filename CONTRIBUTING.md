# Contributing to HopeFund

We're excited that you're interested in contributing to HopeFund! This guide will help you get started.

## 🤝 How to Contribute

### 1. Fork & Clone
```bash
# Fork the repository on GitHub, then:
git clone https://github.com/YOUR_USERNAME/Money-Collection-Web-APP.git
cd Money-Collection-Web-APP
```

### 2. Set Up Development Environment
```bash
# Install dependencies
npm install

# Start development server
npm start
```

### 3. Create a Branch
```bash
# Create a new branch for your feature
git checkout -b feature/your-feature-name
```

### 4. Make Changes
- Write clean, readable code
- Follow existing code style and conventions
- Test your changes thoroughly
- Add comments where necessary

### 5. Test Your Changes
```bash
# Start local server and test manually
npm start

# Check responsive design on different screen sizes
# Test form submissions and interactions
# Verify accessibility with screen readers
```

### 6. Commit Your Changes
```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "✨ Add new donation tracking feature

- Added real-time donation progress bars
- Implemented donor count display
- Updated responsive design for mobile
- Added accessibility labels"
```

### 7. Push and Create Pull Request
```bash
# Push to your fork
git push origin feature/your-feature-name

# Then create a Pull Request on GitHub
```

## 📝 Code Style Guidelines

### HTML
- Use semantic HTML5 elements
- Include proper ARIA labels for accessibility
- Maintain consistent indentation (2 spaces)
- Add descriptive alt text for images

### CSS
- Use CSS custom properties for theming
- Follow BEM naming convention for classes
- Write mobile-first responsive styles
- Group related properties together

### JavaScript
- Use ES6+ features (const/let, arrow functions, modules)
- Write descriptive variable and function names
- Add JSDoc comments for complex functions
- Handle errors gracefully with try/catch

### File Structure
- Keep files organized in logical directories
- Use descriptive file names
- Separate concerns (styles, scripts, content)

## 🎯 What We're Looking For

### High Priority
- 🐛 Bug fixes and error handling improvements
- ♿ Accessibility enhancements
- 📱 Mobile responsiveness improvements
- 🔒 Security enhancements
- ⚡ Performance optimizations

### Medium Priority
- ✨ New features for donor experience
- 🎨 UI/UX improvements
- 📊 Analytics and tracking features
- 🌐 Internationalization (i18n)

### Low Priority
- 📝 Documentation improvements
- 🧪 Test coverage
- 🔧 Developer tooling
- 🎭 Animations and micro-interactions

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows the style guidelines
- [ ] Self-review of the code completed
- [ ] Changes tested on multiple devices/browsers
- [ ] No console errors or warnings
- [ ] Responsive design verified
- [ ] Accessibility checked with screen reader

### PR Description Template
```markdown
## 📝 Description
Brief description of what this PR does.

## 🎯 Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that causes existing functionality to change)
- [ ] Documentation update

## 🧪 Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested on Safari/Edge
- [ ] Tested on mobile devices
- [ ] Accessibility tested

## 📱 Screenshots
If applicable, add screenshots to help explain your changes.

## 🔗 Related Issues
Fixes #(issue number)
```

## 🚀 Development Tips

### Local Testing
```bash
# Test on different screen sizes
# Use browser dev tools device simulation

# Check for console errors
# Open browser dev console

# Test form submissions
# Try different input combinations

# Verify accessibility
# Use NVDA/JAWS screen reader
# Navigate with keyboard only
```

### Common Issues
- **Images not loading**: Check file paths and extensions
- **Styles not applying**: Verify CSS file links and syntax
- **JavaScript errors**: Check browser console for details
- **Responsive issues**: Test on actual devices when possible

## 🎨 Design Resources

### Colors (CSS Custom Properties)
```css
--primary-color: #2EC4B6;    /* Teal */
--secondary-color: #E63946;  /* Red */
--success-color: #06D6A0;    /* Green */
--warning-color: #FFB400;    /* Amber */
--dark-color: #011627;       /* Navy */
--light-color: #F8F9FA;      /* Off-white */
```

### Typography
- Font: Inter (already loaded from Google Fonts)
- Use rem units for consistent scaling
- Maintain good contrast ratios (4.5:1 minimum)

### Icons
- Use SVG icons for crisp display
- Ensure icons have proper alt text or aria-labels
- Keep file sizes optimized

## ❓ Questions?

- 💬 Open a GitHub Discussion for general questions
- 🐛 Create an Issue for bug reports
- 💡 Create an Issue for feature requests
- 📧 Email for security-related concerns

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- GitHub contributors graph
- Release notes for significant contributions

Thank you for contributing to HopeFund! Together, we're making donations more accessible and impactful. 🌟
