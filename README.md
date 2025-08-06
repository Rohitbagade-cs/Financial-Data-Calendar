# Market Calendar Dashboard

A modern, interactive financial data visualization application built with React, TypeScript, and Vite. This dashboard provides a calendar-based interface for viewing and analyzing financial market data including price movements, volatility, and volume metrics.

<img width="1755" height="902" alt="image" src="https://github.com/user-attachments/assets/25c81a1c-c482-4778-b19a-c3c5f66ce09a" />


## ✨ Features

### 📊 Interactive Financial Calendar
- **Calendar View**: Visualize financial data in an intuitive calendar format
- **Multiple Time Frames**: Switch between daily, weekly, and monthly views
- **Multi-Symbol Support**: Track various financial instruments (BTC, ETH, ADA, SOL, DOT)
- **Real-time Data**: Integration with financial APIs (with mock data fallback)

### 📈 Data Visualization
- **Performance Indicators**: Color-coded cells showing bullish/bearish movements
- **Volatility Analysis**: Visual representation of market volatility
- **Volume Metrics**: Trading volume indicators for liquidity analysis
- **Interactive Tooltips**: Hover effects showing detailed metrics

### 🎨 Modern UI/UX
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Theme**: Built with shadcn/ui components
- **Smooth Animations**: Enhanced user experience with Tailwind CSS
- **Accessibility**: ARIA-compliant components for better accessibility

### 🛠️ Technical Features
- **Type Safety**: Full TypeScript implementation
- **State Management**: React Query for data fetching and caching
- **Routing**: React Router for navigation
- **Component Library**: shadcn/ui for consistent design system
- **Build Tool**: Vite for fast development and optimized builds

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-git-url>
   cd market-calen-dash-main
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```
   > Note: Use `--legacy-peer-deps` flag to resolve peer dependency conflicts

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Alternative Package Managers
```bash
# Using Yarn
yarn install
yarn dev

# Using Bun (if available)
bun install
bun run dev
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Calendar/        # Calendar-specific components
│   │   ├── CalendarCell.tsx
│   │   ├── CalendarControls.tsx
│   │   ├── CalendarGrid.tsx
│   │   └── FinancialCalendar.tsx
│   ├── Dashboard/       # Dashboard components
│   │   └── DataPanel.tsx
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Page components
├── services/           # API and data services
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory for API configuration:
```env
VITE_API_BASE_URL=your_api_endpoint
VITE_API_KEY=your_api_key
```

### Vite Configuration
The project uses Vite with the following key configurations:
- **Port**: 8080 (development server)
- **TypeScript**: Full TypeScript support
- **Path Aliases**: `@/*` maps to `src/*`

## 🎨 Technology Stack

### Frontend Framework
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server

### UI/Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **Lucide React** - Beautiful icons
- **CSS Modules** - Component-scoped styling

### State Management & Data
- **React Query** - Server state management and caching
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **TypeScript ESLint** - TypeScript-specific linting

## 📊 Data Sources

The application supports multiple data sources:

1. **Live API Integration**: Real-time financial data from external APIs
2. **Mock Data**: Fallback simulated data for development and demos
3. **Historical Data**: Support for historical price and volume data

### Supported Instruments
- **Cryptocurrencies**: BTC/USDT, ETH/USDT, ADA/USDT, SOL/USDT, DOT/USDT
- **Extensible**: Easy to add new symbols and markets

## 🔍 Key Components

### FinancialCalendar
Main component orchestrating the calendar view with data fetching and state management.

### CalendarGrid
Renders the calendar layout with interactive cells showing financial metrics.

### DataPanel
Detailed view panel displaying comprehensive data for selected dates.

### CalendarControls
Navigation and filtering controls for timeframe, symbols, and view modes.

## 🎯 Usage Examples

### Viewing Daily Data
1. Select a symbol from the dropdown
2. Navigate to desired month/year
3. Click on any date to view detailed metrics
4. Use hover effects for quick data preview

### Analyzing Trends
1. Switch to weekly/monthly view for broader trends
2. Use color indicators to identify patterns
3. Compare different time periods
4. Analyze volatility and volume correlations

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
The project includes Vercel configuration:
```bash
npm run vercel-build
```

### Other Platforms
The built files in `/dist` can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3
- Azure Static Web Apps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **shadcn/ui** - For the excellent component library
- **Tailwind CSS** - For the utility-first CSS framework
- **React Team** - For the amazing React framework
- **Vite Team** - For the blazing-fast build tool

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Made with ❤️ using React, TypeScript, and modern web technologies.**
