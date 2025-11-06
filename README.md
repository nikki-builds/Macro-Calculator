# 💪 Macro Calculator Pro

A full-stack web application that calculates personalized daily calorie targets and macronutrient breakdown based on user information and fitness goals.

![Macro Calculator Screenshot](./assets/screenshot-mc-before.png)
![Macro Calculator Screenshot](./assets/screenshot-mc-after.png)

## 🌟 Features

- **Accurate BMR Calculation** - Uses the Mifflin-St Jeor equation
- **Activity-Based TDEE** - Adjusts for 5 different activity levels
- **Goal-Oriented Plans** - Tailored macros for weight loss, maintenance, or muscle gain
- **Visual Breakdown** - Interactive progress bars showing macro distribution
- **Data Persistence** - Calculations automatically saved to MongoDB database
- **Smart Validation** - Real-time form validation with helpful error messages
- **Toast Notifications** - Instant feedback on successful saves or errors
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

**Frontend:**
- React.js
- CSS3 with custom animations
- Lucide React (icons)
- React Hot Toast (notifications)

**Backend:**
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS enabled

**Development Tools:**
- npm
- Git & GitHub
- VS Code

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

### Clone the repository
```bash
git clone https://git@github.com:nikki-builds/Macro-Calculator.git
cd macro-calculator
```

### Install dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
```

### Environment Setup

Create a `.env` file in the `server` folder:
```
PORT=5000
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.gdwtrwh.mongodb.net/<DATABASE_NAME>
```

### Run the application

**Start Backend (Terminal 1):**
```bash
cd server
node server.js
```

**Start Frontend (Terminal 2):**
```bash
npm start
```

The app will open at `http://localhost:3000`

## 🎯 How It Works

1. **Enter Your Information**
   - Age, weight, height, gender
   - Activity level (sedentary to very active)
   - Goal (lose weight, maintain, or gain muscle)

2. **Calculate**
   - App calculates BMR using Mifflin-St Jeor equation
   - Determines TDEE based on activity level
   - Adjusts calories for your goal (+/- 500 kcal)

3. **View Results**
   - Daily calorie target
   - Protein, carbs, and fats breakdown
   - Grams, percentages, and calories for each macro

4. **Auto-Save**
   - Calculations automatically saved to database
   - Instant confirmation with toast notification

## 📊 Calculation Methods

### BMR (Basal Metabolic Rate)
**Men:** BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + 5  
**Women:** BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) - 161

### TDEE (Total Daily Energy Expenditure)
TDEE = BMR × Activity Multiplier
- Sedentary: 1.2
- Light: 1.375
- Moderate: 1.55
- Active: 1.725
- Very Active: 1.9

### Macro Splits
**Weight Loss:** 35% protein, 30% carbs, 35% fats  
**Maintenance:** 30% protein, 40% carbs, 30% fats  
**Muscle Gain:** 30% protein, 45% carbs, 25% fats

## 🚀 Future Enhancements

- [ ] User authentication (sign up/login)
- [ ] Personalized calculation history per user
- [ ] Meal planning suggestions
- [ ] Progress tracking over time
- [ ] AI-powered nutrition recommendations
- [ ] Export results as PDF
- [ ] Mobile app version
- [ ] Food database integration

## 📝 API Endpoints

### Calculations
- `POST /api/calculations` - Save new calculation
- `GET /api/calculations` - Get all calculations
- `GET /api/calculations/:id` - Get single calculation
- `DELETE /api/calculations/:id` - Delete calculation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/nikki-builds)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Portfolio: [yourwebsite.com](https://yourwebsite.com)

## 🙏 Acknowledgments

- Mifflin-St Jeor equation for BMR calculation
- Nutrition research for macro distribution guidelines
- React and Node.js communities

---

⭐ Star this repo if you found it helpful!