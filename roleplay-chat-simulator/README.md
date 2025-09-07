# 🎭 Roleplay Chat Simulator

A sophisticated React-based chat application that provides immersive conversations with AI-powered fictional characters featuring dynamic emotional visual feedback, professional-grade text-to-speech, and character-specific sound effects.

## ✨ Features

### 🎯 Core Features
- **6 Unique Characters**: Gandalf, Sherlock Holmes, AI Robot, Knight, Alien DJ, and Mystical Sorceress
- **Dynamic Emotions**: Characters express emotions through facial expressions and voice inflections
- **Professional TTS**: ElevenLabs integration for high-quality, character-specific voice synthesis
- **Smart Audio**: Only speaks text within *asterisks* or very short responses
- **Immersive Sound Effects**: Character-specific typing and notification sounds
- **Responsive Design**: Fully optimized for desktop and mobile devices

### 🧠 AI Integration
- **Google Gemini Flash 1.5**: Advanced AI responses with personality-driven conversations
- **Emotion Detection**: Automatic emotion recognition from AI responses
- **Character Consistency**: Each character maintains unique speaking patterns and personality traits
- **Context Awareness**: Conversations maintain context and emotional continuity

### 🎨 Visual Experience
- **Character-Specific Themes**: Unique color schemes and fonts for each character
- **Dynamic Character Images**: 6 emotional states per character (neutral, happy, thinking, sad, waving, surprised)
- **Smooth Animations**: Polished transitions and hover effects
- **Accessibility**: WCAG 2.1 compliant with screen reader support

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Google Gemini API key
- ElevenLabs API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd roleplay-chat-simulator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔑 API Keys Setup

### Google Gemini Flash 1.5 API
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `VITE_GEMINI_API_KEY`

### ElevenLabs API
1. Sign up at [ElevenLabs](https://elevenlabs.io/)
2. Go to your Profile → API Keys
3. Generate a new API key
4. Add it to your `.env` file as `VITE_ELEVENLABS_API_KEY`

**Note**: ElevenLabs offers 10,000 characters per month on the free tier.

## 🎮 How to Use

### Character Selection
1. Choose from 6 unique characters on the home page
2. Preview different emotional states by hovering over character cards
3. Click "Start Conversation" to begin chatting

### Chat Interface
1. Type your message in the input field
2. Characters respond with personality-driven AI responses
3. Watch character images change based on emotions
4. Listen to selective text-to-speech for *asterisk-wrapped* content
5. Enjoy immersive sound effects during interactions

### Audio Controls
- Click the speaker icon in the chat header to access audio settings
- Toggle TTS on/off and adjust volume
- Control sound effects independently
- Monitor API usage in real-time

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── chat/              # Chat-specific components
│   ├── character/         # Character selection components
│   └── audio/             # Audio control components
├── pages/                 # Main application pages
├── hooks/                 # Custom React hooks
├── context/               # React Context providers
├── services/              # API integration services
├── data/                  # Character data and configurations
└── utils/                 # Utility functions
```

## 🎭 Characters

### 🧙‍♂️ Gandalf the Grey
- **Theme**: Mystical Gold
- **Personality**: Wise wizard with poetic speech
- **Voice**: Deep, mystical tone
- **Specialties**: Ancient wisdom, magical advice

### 🕵️‍♂️ Sherlock Holmes  
- **Theme**: Victorian Blue
- **Personality**: Brilliant detective with sharp deduction
- **Voice**: Sophisticated British accent
- **Specialties**: Mystery solving, logical analysis

### 🤖 AI-7 Assistant
- **Theme**: Cyber Green
- **Personality**: Curious robot learning about humans
- **Voice**: Synthetic, robotic tone
- **Specialties**: Technology, logic, human behavior analysis

### ⚔️ Sir Galahad
- **Theme**: Noble Silver
- **Personality**: Honorable medieval knight
- **Voice**: Strong, noble tone
- **Specialties**: Chivalry, honor, quests

### 👽 Zyx the Cosmic DJ
- **Theme**: Cosmic Purple  
- **Personality**: Funky alien with musical wisdom
- **Voice**: Otherworldly, energetic
- **Specialties**: Music, space, universal vibes

### 🔮 Luna Starweaver
- **Theme**: Ethereal Pink
- **Personality**: Mystical sorceress with starlight magic
- **Voice**: Ethereal, enchanting
- **Specialties**: Magic, celestial wisdom, spells

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Variables
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_ELEVENLABS_API_KEY=your_elevenlabs_api_key
```

### Adding New Characters
1. Add character data to `src/data/characters.js`
2. Create character images (6 emotional states)
3. Configure voice ID and settings
4. Add character-specific sound effects (optional)

## 🎨 Customization

### Character Themes
Each character has customizable:
- Primary color scheme
- Background gradients  
- Typography (fonts)
- Sound effects
- Voice settings

### Audio Settings
- TTS voice parameters (stability, similarity, style)
- Character-specific sound effects
- Volume controls for TTS and effects separately
- Usage monitoring and limits

## 📱 Mobile Support

The application is fully responsive with:
- Touch-optimized character selection
- Mobile-friendly chat interface
- Responsive character image positioning
- Touch gesture support
- Mobile browser audio compatibility

## 🔒 Security & Privacy

- API keys stored securely in environment variables
- No sensitive data logged or stored
- Client-side only - no backend required
- HTTPS-only API communications
- Input validation and sanitization

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in site settings

### Manual Build
```bash
npm run build
# Upload dist/ folder to your web server
```

## 🐛 Troubleshooting

### Common Issues

**Characters not loading**
- Check that image files exist in `public/images/characters/`
- Verify image paths in character data match actual files

**TTS not working**
- Ensure ElevenLabs API key is valid
- Check browser audio permissions
- Try clicking page to enable audio context

**Sound effects not playing**
- Verify sound files exist in `public/sounds/`
- Check browser audio permissions
- Enable sound effects in audio controls

**API errors**
- Verify API keys are correctly set in `.env`
- Check API usage limits
- Ensure internet connection is stable

### Browser Compatibility
- Chrome 80+ (recommended)
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Follow existing code style and patterns
- Add PropTypes for new components
- Include error handling for API calls
- Test on multiple browsers and devices
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini**: Advanced AI language model
- **ElevenLabs**: Professional text-to-speech synthesis
- **React**: UI framework
- **Tailwind CSS**: Styling framework
- **Vite**: Build tool and development server

## 📞 Support

If you encounter issues or have questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure all API keys are properly configured
4. Try using a different browser or device

---

**Built with ❤️ using React, Vite, and modern web technologies**

*Experience the future of AI-powered character interactions with professional audio and dynamic visual feedback!*