# 💪 Macro Calculator Pro

## 🌐 Live Demo

**[View Live Demo](https://macro-calculator-pi.vercel.app/)**

A React web app that calculates personalized daily calorie targets and a macronutrient breakdown based on your information and fitness goal. All calculations run in the browser, so results appear instantly and nothing you enter is stored.

![Macro Calculator Screenshot](./assets/screenshot-mc-before.png)
![Macro Calculator Screenshot](./assets/screenshot-mc-after.png)

## 🌟 Features

- **Accurate BMR Calculation** - Uses the Mifflin-St Jeor equation
- **Activity-Based TDEE** - Adjusts for 5 different activity levels
- **Goal-Oriented Plans** - Tailored macros for weight loss, maintenance, or muscle gain
- **Visual Breakdown** - Progress bars showing macro distribution
- **Private by Design** - Runs entirely in the browser; no personal data is sent or saved
- **Form Validation** - A friendly toast message if a field is left empty
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

- React.js
- CSS3 with custom animations
- Tailwind CSS
- Lucide React (icons)
- React Hot Toast (notifications)
- Deployed on Vercel

**Development Tools:** npm, Git & GitHub, VS Code

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Clone and run
```bash
git clone https://github.com/nikki-builds/Macro-Calculator.git
cd Macro-Calculator
npm install
npm start
```

The app will open at `http://localhost:3000`. No environment variables or database are needed.

## 🎯 How It Works

1. **Enter Your Information**
   - Age, weight (kg), height (cm), gender
   - Activity level (sedentary to very active)
   - Goal (lose weight, maintain, or gain muscle)

2. **Calculate**
   - Calculates BMR using the Mifflin-St Jeor equation
   - Determines TDEE based on activity level
   - Adjusts calories for your goal (+/- 500 kcal)

3. **View Results**
   - Daily calorie target, with BMR and TDEE
   - Protein, carbs, and fats in grams, percentages, and calories

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

## 🧪 About the `server` Folder

This repo also contains a Node.js + Express + MongoDB backend (`server/`) that I built to practice connecting a frontend to an API and a database. The first live version saved every calculation to MongoDB.

I later removed that from the live app. A calculator doesn't need to remember anything (the same inputs always give the same result), users had no way to view saved results, and storing people's age, weight, and height without a clear purpose isn't a good practice for a health app. Removing it also made the app faster, since it no longer waits for a server.

The backend code is kept for reference. Its endpoints:
- `POST /api/calculations` - Save a calculation
- `GET /api/calculations` - Get all calculations
- `GET /api/calculations/:id` - Get a single calculation
- `DELETE /api/calculations/:id` - Delete a calculation

## 🚀 Future Enhancements

- [ ] Imperial units (lb, ft/in)
- [ ] Meal planning suggestions
- [ ] Export results as PDF
- [ ] Optional saved history (stored on your device)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License.

## 👤 Author

**Na Yeon (Nikki) Kim**
- Transitioning from nutrition background to tech
- Combining nutrition expertise with web development

## 🙏 Acknowledgments

- Mifflin-St Jeor equation for BMR calculation
- Nutrition research for macro distribution guidelines
- React community
