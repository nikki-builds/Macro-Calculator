const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
  personalInfo: {
    age: {
      type: Number,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female'] // enum: restricts values to a specific list (only male or female allowed)
    },
    activityLevel: {
      type: String,
      required: true,
      enum: ['sedentary','light','moderate','active','veryActive']
    }
  },
  goal: {
    type: String,
    required: true,
    enum: ['lose','maintain','gain']
    },
  results: {
    bmr: Number,
    tdee: Number,
    targetCalories: Number,
    protein: {
      grams: Number,
      calories: Number,
      percentage: Number
    },
    carbs: {
      grams: Number,
      calories: Number,
      percentage: Number
    },
    fats: {
      grams: Number,
      calories: Number,
      percentage: Number
      }
    }
  }, {
    timestamps: true
  }
);

const Calculation = mongoose.model('Calculation', calculationSchema);

module.exports = Calculation;