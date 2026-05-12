# India Air Sense - AI-Powered Air Quality Intelligence System

## Overview

India Air Sense is a comprehensive web application that provides real-time air quality monitoring and intelligence for major Indian cities. The system combines machine learning predictions, interactive dashboards, and detailed analytics to help users understand and track air pollution levels across India.

## Features

### 🏠 Landing Page
- Clean, modern UI with Indian-themed design
- Interactive map showing air quality across cities
- Real-time AQI (Air Quality Index) display
- Information cards about air pollution impacts
- Feature highlights and navigation

### 📊 Dashboard
- Dynamic city selection (Delhi, Mumbai, Bangalore, Chennai, Kolkata)
- Prominent AQI display with status indicators
- Weather data cards (Temperature, Humidity, Wind Speed)
- Pollutant breakdown (PM2.5, PM10, NO2, SO2, CO, O3)
- Historical trends and analytics

### 🧮 Advanced AQI Calculator
- Machine learning-powered predictions
- Input parameters: Temperature, Humidity, Wind Speed
- Real-time AQI calculation using trained Linear Regression model
- Chemical analysis and pollutant estimation

### 🔬 Research Section
- Detailed air quality research and insights
- Environmental impact analysis
- Data-driven findings and recommendations

### 👥 Team Page
- Information about the development team
- Project contributors and acknowledgments

## Technology Stack

### Frontend
- **React 19** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components built on Radix UI
- **Framer Motion** - Animation library
- **React Leaflet** - Interactive maps
- **Recharts** - Data visualization
- **React Query** - Data fetching and caching

### Backend
- **Express.js 5** - Fast, unopinionated web framework
- **TypeScript** - Type-safe server code
- **Drizzle ORM** - Type-safe SQL query builder
- **PostgreSQL** - Robust relational database
- **Zod** - Schema validation
- **Pino** - High-performance logging

### Machine Learning
- **Scikit-learn** - Linear Regression model
- **Pandas** - Data processing and analysis
- **Real dataset** - Kaggle air quality dataset for training

### Development Tools
- **pnpm** - Fast, disk-efficient package manager
- **Monorepo** - pnpm workspaces for multi-package management
- **esbuild** - Extremely fast JavaScript bundler
- **Orval** - API client generation from OpenAPI specs
- **Prettier** - Code formatting

## Project Structure

```
india-air-sense/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── aqi-india/          # React frontend application
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI specification
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod validation schemas
│   └── db/                 # Database schema and connections
├── scripts/                # Utility scripts
├── netlify/                # Netlify functions
└── server/                 # Additional server components
```

## Getting Started

### Prerequisites
- Node.js 24+
- pnpm package manager
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd india-air-sense
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up the database:
```bash
# Configure PostgreSQL connection in lib/db/
# Run database migrations
```

4. Start development servers:
```bash
# Start API server
pnpm --filter @workspace/api-server run dev

# Start frontend (in another terminal)
pnpm --filter aqi-india run dev
```

5. Open your browser to `http://localhost:5173`

### Build for Production

```bash
# Build all packages
pnpm run build

# Build specific packages
pnpm --filter aqi-india run build
pnpm --filter @workspace/api-server run build
```

## API Endpoints

- `GET /api/healthz` - Health check endpoint
- `GET /api/cities` - Get air quality data for all cities
- `POST /api/predict` - Predict AQI based on weather parameters
- `GET /api/dashboard/:city` - Get detailed dashboard data for a city

## Machine Learning Model

The system uses a Linear Regression model trained on real air quality data from Kaggle. The model predicts AQI based on:
- Temperature
- Humidity
- Wind Speed

Training data includes historical air quality measurements from major Indian cities.

## Deployment

The application is configured for deployment on:
- **Netlify** - Frontend hosting with functions
- **Vercel** - Alternative frontend hosting
- **Railway/Render** - Backend API hosting

### Environment Variables

Create `.env` files in respective packages:

```env
# Database
DATABASE_URL=postgresql://...

# API Keys (if needed)
OPENWEATHER_API_KEY=...
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Air quality dataset from Kaggle
- Open source libraries and frameworks
- Indian government environmental agencies for data insights
- Contributors and the open source community

---

**Built with ❤️ for cleaner air in India** 🇮🇳