# Quality Assurance Assistant 🎯
#### *AI-Powered Quality Tools & Analysis*

## 🌟 Overview
An intelligent quality assurance assistant that combines modern AI capabilities with traditional quality tools. This application helps quality professionals and engineers analyze data, generate charts, and get AI-powered insights for quality improvement.

## ✨ Features

### 🤖 AI-Powered Analysis
- **Smart Chat Interface** - Context-aware responses using Google's Gemini AI
- **Multiple Personas** - Choose between:
  - 🎓 Novice Guide - Explains tools simply with analogies
  - 👨‍💼 Expert Consultant - Uses technical terms and advanced methods
  - 🔍 Skeptical Manager - Challenges assumptions and asks for proof

### 📊 Quality Tools
- **Pareto Charts** - For 80/20 analysis of defects and causes
- **Histograms** - Data distribution visualization and analysis
- **Control Charts** - Process monitoring and variation analysis
- **Process Capability** - Cp/Cpk analysis for process performance
- **Fishbone Diagrams** - Root cause analysis and problem solving

### 🎨 UI Features
- **Dark/Light Mode** - Eye-friendly interface with automatic theme detection
- **Interactive Particles** - Dynamic WebGL background effects
- **Responsive Design** - Seamlessly works on desktop and mobile devices
- **Glass Morphism** - Modern UI with blur effects and transparency

## 🛠️ Tech Stack

### Frontend
```
React + TypeScript
Tailwind CSS
Framer Motion
OGL (WebGL Particles)
```

### Backend
```
Python
LangChain
Google Gemini AI
FastAPI
```

### Data Processing
```
Pandas
NumPy
Matplotlib
Seaborn
Plotly
```

## 🚀 Getting Started

### Prerequisites
```bash
Node.js v16+
Python 3.9+
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/A-Menon888/quality.git
cd quality
```

2. **Backend Setup**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
```

3. **Frontend Setup**
```bash
cd qa-frontend
npm install
```

4. **Environment Setup**
Create `.env` file in root directory:
```env
GOOGLE_API_KEY=your_api_key
```

### Running the Application

1. **Start Backend**
```bash
python main.py
```

2. **Start Frontend**
```bash
cd qa-frontend
npm start
```

Visit `http://localhost:3000` to access the application.

## 🔐 Security Features

- Environment variables for API keys and sensitive data
- CORS protection for API endpoints
- Rate limiting for API requests
- Input validation and sanitization
- Secure file upload handling

## 🌟 Key Features Explained

### Data Analysis
- Upload CSV/Excel files for analysis
- Automatic data type detection
- Statistical analysis and insights
- Interactive chart generation

### AI Capabilities
- Context-aware responses
- Data-driven recommendations
- Quality tool selection assistance
- Process improvement suggestions

### Visualization
- Interactive and responsive charts
- Real-time chart updates
- Custom chart styling options
- Export capabilities (PNG, PDF)

## 📄 License
This project is licensed under the MIT License.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

<p align="center">
  Made for Quality Assurance Professionals and MSME's by Aayush and Rohit.
</p>
