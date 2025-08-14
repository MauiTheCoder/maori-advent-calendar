# Mahuru Activation 2025
## Te Reo Māori Learning Platform

A comprehensive te reo Māori learning platform featuring 30 days of progressive language activation activities, built with Next.js and Firebase.

## 🌿 Features

- **Progressive Learning**: 30-day structured te reo Māori activation program
- **Multi-level Support**: Beginner, intermediate, and advanced activities
- **Real-time Progress**: Track learning progress and achievements
- **Authentication**: Secure user accounts with Firebase
- **Admin CMS**: Content management system for customization
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Te Wānanga o Aotearoa Partnership**: Authentic cultural content

## 🚀 Quick Start

**For the fastest setup, follow the [QUICK_START.md](QUICK_START.md) guide (15 minutes).**

### Prerequisites
- Node.js 18+
- A Google account (for Firebase)
- Git repository access

### 1. Clone and Install
```bash
git clone https://github.com/MauiTheCoder/maori-advent-calendar.git
cd maori-advent-calendar
bun install
```

### 2. Firebase Setup
```bash
# Interactive Firebase configuration
bun run firebase:setup

# Validate configuration
bun run firebase:validate
```

### 3. Start Development
```bash
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### 4. Initialize Admin
1. Go to [http://localhost:3000/admin/setup](http://localhost:3000/admin/setup)
2. Initialize the database
3. Create your admin account
4. Start customizing!

## 📚 Documentation

- **[QUICK_START.md](QUICK_START.md)** - 15-minute setup guide
- **[FIREBASE_PROJECT_SETUP.md](FIREBASE_PROJECT_SETUP.md)** - Detailed Firebase configuration
- **[FIREBASE_SETUP.md](FIREBASE_SETUP.md)** - Complete setup documentation

## 🛠️ Available Scripts

```bash
# Development
bun dev                    # Start development server
bun build                  # Build for production
bun start                  # Start production server

# Firebase Management
bun run firebase:setup     # Interactive Firebase setup
bun run firebase:validate  # Validate Firebase configuration
bun run firebase:check     # Quick validation check
bun run setup              # Complete setup (interactive + validation)

# Code Quality
bun run lint               # TypeScript checking and linting
bun run format             # Code formatting with Biome
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Firebase (Authentication, Firestore)
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Radix UI primitives
- **Deployment**: Netlify

### Project Structure
```
src/
├── app/                   # Next.js app directory
│   ├── admin/            # Admin dashboard pages
│   ├── activity/         # Learning activity pages
│   └── ...
├── components/           # Reusable UI components
│   ├── auth/            # Authentication components
│   ├── ui/              # Base UI components
│   └── ...
├── contexts/            # React context providers
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and Firebase config
└── types/               # TypeScript type definitions
```

## 🔧 Configuration

### Environment Variables
Create `.env.local` with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123:web:abc123
NEXT_PUBLIC_ADMIN_EMAILS=admin@example.com
NEXT_PUBLIC_SITE_URL=https://your-site.netlify.app
```

### Firebase Configuration
1. Create Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Configure security rules
5. Get web app configuration

See [FIREBASE_PROJECT_SETUP.md](FIREBASE_PROJECT_SETUP.md) for detailed instructions.

## 🚀 Deployment

### Netlify (Recommended)
```bash
# Set environment variables in Netlify dashboard
# Deploy via Git push
git push origin main

# Or use the deployment script
./scripts/deploy-to-netlify.sh
```

### Manual Deployment
1. Set all environment variables in your hosting platform
2. Build the application: `bun run build`
3. Deploy the `out` directory

## 🔐 Security

- Firebase Authentication for user management
- Firestore security rules for data protection
- Environment variable validation
- Admin permission system
- API key restrictions for production

## 🌐 Live Demo

**Production**: [https://maori-advent-calendar.netlify.app](https://maori-advent-calendar.netlify.app)

Test the admin system at `/admin/setup`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Run tests: `bun run lint`
5. Commit: `git commit -m "Add new feature"`
6. Push: `git push origin feature/new-feature`
7. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Te Wānanga o Aotearoa** for cultural guidance and content
- **Firebase** for backend infrastructure
- **Next.js** team for the excellent framework
- **Mahuru Challenge** participants and community

## 📞 Support

- **Documentation**: Check the guides in this repository
- **Issues**: [GitHub Issues](https://github.com/MauiTheCoder/maori-advent-calendar/issues)
- **Firebase Support**: [Firebase Documentation](https://firebase.google.com/docs)

---

**🌿 Kia ora! Welcome to the Mahuru Activation 2025 platform. Let's learn te reo Māori together!**
