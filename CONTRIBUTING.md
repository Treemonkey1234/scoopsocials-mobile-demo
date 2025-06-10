# Contributing to ScoopSocials Mobile Demo

Thank you for your interest in contributing to ScoopSocials! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues
- Use the [GitHub Issues](https://github.com/Treemonkey1234/scoopsocials-mobile-demo/issues) to report bugs
- Search existing issues before creating a new one
- Include detailed steps to reproduce the issue
- Provide system information (OS, Node.js version, etc.)

### Submitting Changes
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write or update tests if applicable
5. Ensure code follows the project's style guidelines
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 🏗️ Development Setup

### Prerequisites
- Node.js 18+
- npm 8+
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development on macOS)

### Local Development
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/scoopsocials-mobile-demo.git
cd scoopsocials-mobile-demo

# Install dependencies
npm run install-all

# Start development servers
npm run web          # Web development
npm run mobile       # React Native Metro bundler
npm run mobile-android  # Android app
```

## 📱 Project Structure

```
scoopsocials-mobile-demo/
├── web/              # Next.js web demo
├── mobile/           # React Native mobile app
├── docs/             # Documentation
└── scripts/          # Build scripts
```

## 🎨 Code Style

### General Guidelines
- Use TypeScript for type safety
- Follow React and React Native best practices
- Write meaningful commit messages
- Add comments for complex logic
- Maintain consistent formatting

### Naming Conventions
- Components: PascalCase (`UserProfile.tsx`)
- Files: camelCase (`userService.ts`)
- Directories: kebab-case (`user-profile/`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)

## 🧪 Testing

- Write unit tests for utility functions
- Add integration tests for components
- Test on both iOS and Android for mobile changes
- Verify web responsive design

## 📦 Pull Request Guidelines

### Before Submitting
- [ ] Code builds without errors
- [ ] Tests pass (if applicable)
- [ ] Code follows style guidelines
- [ ] Documentation updated (if needed)
- [ ] Commits are properly formatted

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Tested on web
- [ ] Added/updated tests

## Screenshots
If applicable, add screenshots
```

## 🚀 Release Process

1. Version bump in package.json files
2. Update CHANGELOG.md
3. Create release notes
4. Tag release
5. Deploy to GitHub Pages

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🙋‍♂️ Questions?

- Create an issue for technical questions
- Join our community discussions
- Contact the maintainers

---

**Thank you for contributing to ScoopSocials!** 🎉