import React, { useState} from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Calculator,Activity, Target } from 'lucide-react';
import { saveCalculation, getAllCalculations, deleteCalculation } from './services/api';
import './App.css';


const MacroCalculator = () => {
  // This is where I'm storing form data
  const [formData, setFormData] = useState({
    age:'',
    weight:'',
    height: '',
    gender: 'male',
    activityLevel: 'sedentary',
    goal: 'maintain'
  });

  // This is where I'll store calculation results
  const [results, setResults] = useState(null); // null: nothing or empty (no data yet or intentionall empty)

  const [isLoading, setIsLoading] = useState(false);

// step 4 starts here

// Activity Multipliers
const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9
};

// BMR Calculation using Mifflin-St Jeor Equation
const calculateBMR = (weight, height, age, gender) => {
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return  10 * weight + 6.25 * height - 5 * age - 161;
  }
};

// Main calculate function 
const calculateMacros = async () => {
  const { age, weight, height, gender, activityLevel, goal } = formData;
  // long way:
  // const age = formData.age;
  // const weight = formData.weight;

  // validation
  if(!age || !weight || !height) {
    toast.error('Please fill in all fields!');
    return;
  }

  setIsLoading(true); // show loading spinner

  const bmr = calculateBMR(
    parseFloat(weight),
    parseFloat(height),
    parseInt(age),
    gender
  );

  const tdee = bmr * activityMultipliers[activityLevel];

  let targetCalories = tdee;
  if (goal === 'lose') {
    targetCalories = tdee - 500; 
  } else if (goal === 'gain') {
    targetCalories = tdee + 500; 
  }

  let proteinPercent, carbsPercent, fatsPercent;

  if(goal === 'lose') {
    proteinPercent = 0.35;
    carbsPercent = 0.30;
    fatsPercent = 0.35;
  } else if (goal === 'gain') {
    proteinPercent = 0.30;
    carbsPercent = 0.45;
    fatsPercent = 0.25;
  } else {
    proteinPercent = 0.30;
    carbsPercent = 0.40;
    fatsPercent = 0.30;
  }

  const proteinGrams = Math.round((targetCalories * proteinPercent) / 4);
  const carbsGrams = Math.round((targetCalories * carbsPercent) / 4);
  const fatsGrams = Math.round((targetCalories * fatsPercent) / 9);

  const calculationResults = {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    protein: {
      grams: proteinGrams,
      calories: proteinGrams * 4,
      percentage: Math.round(proteinPercent * 100)
    },
    carbs: {
      grams: carbsGrams,
      calories: carbsGrams * 4,
      percentage: Math.round(carbsPercent * 100)
    },
    fats: {
      grams: fatsGrams,
      calories: fatsGrams * 9,
      percentage: Math.round(fatsPercent * 100)
    }
  };

  setResults(calculationResults);

try {
  await saveCalculation ({
    personalInfo: {
      age: parseInt(age),
      weight:parseFloat(weight),
      height: parseFloat(height),
      gender,
      activityLevel
    },
    goal,
    results: calculationResults
  });
  
  toast.success('Calculation saved successfully!'); // Success toast
  console.log('calculation saved to database!');

}catch(error) {
  console.error('Failed to save calculation:', error);
  toast.error('Failed to save calculation. Please try again.'); // Error toast
} finally {
  setIsLoading(false); // Hide loading spinner
}

};

//step 3 starts here

  return (
    <div className='min-h-screen bg-background p-4 md:p-8'>
      <Toaster position='top-right'/> 
    

      {/* Header section */}
      <div className='text-center mb-6 md:mb-8'>
        <div className='flex items-center justify-center mb-3 md:mb-4'>
          <Calculator className='w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-accent pulse-icon'/>
        </div>
        <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold gradient-text'>Macro Calculator</h1>
        <p className='text-sm md:text-base text-muted mt-2'>Evidence-based nutrition calculations</p>
      </div>

      {/* Form Selection */}
      <div className='max-w-4xl mx-auto mc-card mb-6'>
      <h2 className='mc-section-header'>
        <Activity className='w-5 h-5 md:w-6 md:h-6 mr-2 text-accent'/>Your Information</h2>

      { /* form starts here for AGE input */}
      {[
        { label: 'Age (years)', name: 'age', placeholder: '25'},
        { label: 'Weight (kg)', name: 'weight', placeholder: '60'},
        { label: 'Height (cm)', name: 'height', placeholder: '170'},
      ].map((field) => (
        <div key={field.name} className='mb-4'>
          <label className='block text-sm font-medium text-muted mb-2'>{field.label}</label>
          <input
          type='number'
          name={field.name}
          value={formData[field.name]}
          onChange={(e)=> setFormData({ ...formData, [field.name]: e.target.value})}
          placeholder={field.placeholder}
          className='w-full px-4 py-2 md:py-3 border border-highlight/50 rounded-lg focus:ring-2 focus:ring-accent/40 focus:border-transparent transition'
          />
        </div>
      ))}

    
      {/* <div className='mb-4' >
        <label className='block text-sm font-medium text-gray-700 mb-2'>Age (years)</label>
        <input
        type="number"
        name='age'
        value={formData.age}
        onChange= {(e)=> setFormData({ ...formData, age: e.target.value })}
        placeholder="25"
        className='w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition'
        />
      </div> */}

      {/* WEIGHT input */}
      {/* <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Weight (kg)</label>
        <input
        type='number'
        name='weight'
        value={formData.weight}
        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
        placeholder='70'
        className='w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition'
        />
      </div> */}

      {/* HEIGHT input */}
      {/* <div className='mb-4'>
        <label className='block text-sm font-medium text-gray-700 mb-2'>Height (cm)</label>
        <input
        type='number'
        name='height'
        value={formData.height}
        onChange={(e)=> setFormData({ ...formData, height:e.target.value })}
        placeholder='170'
        className='w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition'
        />
       </div>  
        */}

        {/* GENDER select */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-muted mb-2'>Gender</label>
          <select
          name='gender'
          value={formData.gender}
          onChange={(e)=> setFormData({ ...formData, gender:e.target.value})}
          className='w-full px-4 py-2 md:py-3 border border-highlight/50 rounded-lg focus:ring-2 focus:ring-accent/40 focus:border-transparent transition'
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* ACTIVITY LEVEL select */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-muted mb-2'>Activity Level</label>
          <select
          name='activityLevel'
          value={formData.activityLevel}
          onChange={(e)=> setFormData({ ...formData, activityLevel:e.target.value})}
          className='w-full px-4 py-2 md:py-3 border border-highlight/50 rounded-lg
                       focus:ring-2 focus:ring-accent/40 focus:border-transparent transition'
          >
            <option value="sedentary">Sedentary (Little or no exercise)</option>
            <option value="light">Light (Light exercise/sports 1-3 days/week)</option>
            <option value="moderate">Moderate (Moderate exercise 3-5 days/week)</option>
            <option value="active">Active (Hard exercise/sports 6-7 days/week)</option>
            <option value="veryActive">Very Active (Very intense exercise or physical job)</option>
          </select>
        </div>
        
        {/* GOAL select */}
        <div className='mb-6'>
          <label className='block text-sm font-medium text-muted mb-2 flex items-center'>
              <Target className='w-4 h-4 mr-1 text-accent'/> Goal
          </label>
          <select
          name='goal'
          value={formData.goal}
          onChange={(e)=> setFormData({...formData, goal:e.target.value})}
          className='w-full px-4 py-2 md:py-3 border border-highlight/50 rounded-lg 
                       focus:ring-2 focus:ring-accent/40 focus:border-transparent transition'
          >
            <option value="lose">Lose Weight</option>
            <option value="maintain">Maintain</option>
            <option value="gain">Gain Muscle</option>
          </select>
        </div>

        {/* Calculation Button */}
        <button 
        onClick={calculateMacros} 
        className='mc-button'
        >
          Calculate Macros
          </button>      
    </div>


    {/* Results section */}
    <div className='max-w-4xl mx-auto mc-card'>
      <h2 className='text-lg md:text-2xl font-semibold text-accent mb-6'>Your Results</h2>
      {results ? (
        <div className='space-y-6 result-container'>
           {/* Daily calorie target */}
          <div className='bg-gradient-to-br from-background to-highlight/30 rounded-xl p-6 border border-highlight/40'>
            <p className='text-sm text-muted mb-2 font-medium'>Daily Calorie Target</p>
            <p className='text-4xl md:text-5xl font-bold text-accent mb-3'>{results.targetCalories}</p>
            <div className='flex justify-between text-xs md:text-sm text-muted pt-3 border-t border-highlight/30'>
              <span>BMR: <span className='font-bold'>{results.bmr}</span> kcal/day</span>
              <span>TDEE: <span className='font-bold'>{results.tdee}</span> kcal/day</span>
            </div>
          </div>

           {/*Macronutrient Breakdown */}
          <div>
            <h3 className='font-semibold text-accent mb-4 text-lg'>
              Macronutrient Breakdown
            </h3>

            {/* Protein */}
            <div className='bg-background rounded-lg p-4 mb-3 border-highlight/40 shadow-soft'>
              <div className='flex justify-between items-center mb-3'>
                <span className='text-sm font-semibold text-muted'>Protein</span>
                <div className='text-right flex flex-col'>
                  <span className='text-sm font-bold text-accent'>{results.protein.grams}g</span>
                  <span className='text-xs text-muted'>({results.protein.percentage}% • {results.protein.calories}kcal)</span>
                  </div>
                </div> 

              <div className='mc-progress-track'>
                <div className='mc-progress-fill progress-bar' style={{width:`${results.protein.percentage}%`}}
                ></div>
              </div>
            </div> 

            {/* Carbs */}
            <div className='bg-background rounded-lg p-4 mb-3 border-highlight/40 shadow-soft'>
              <div className='flex justify-between items-center mb-3'>
                <span className='text-sm font-semibold text-muted'>Carbohydrates</span>
                <div className='text-right flex flex-col'>
                  <span className='text-sm font-bold text-accent'>{results.carbs.grams}g</span>
                  <span className='text-xs text-muted'>({results.carbs.percentage}% • {results.carbs.calories}kcal)</span>
                </div>
              </div>

              <div className='mc-progress-track'>
                <div className='mc-progress-fill progress-bar' style={{width:`${results.carbs.percentage}%`}}>
                </div>
              </div>
            </div>

            {/* Fats */}
            <div className='bg-background rounded-lg p-4 mb-3 border-highlight/40 shadow-soft'>
              <div className='flex justify-between items-center mb-3'>
                <span className='text-sm font-semibold text-muted'>Fats</span>
                <div className='text-right flex flex-col'>
                  <span className='text-sm font-bold text-accent'>{results.fats.grams}g</span>
                  <span className='text-xs text-muted'>({results.fats.percentage}%) • {results.fats.calories}kcal</span>
                </div>
              </div>

              <div className='mc-progress-track'>
                <div className='mc-progress-fill progress-bar' style={{width:`${results.fats.percentage}%`}}></div>
              </div>           
            </div>
          </div>
          
          {/* Info Note */}
          <div className='bg-background border-l-4 border-accent/70 p-4 rounded'>
            <p className='text-sm text-muted'>
              <span className='font-semibold text-accent'>Note:</span> Calculations are based on the Mifflin–St Jeor equation, one of the most accurate formulas for estimating basal metabolic rate (BMR). Individual results may vary and should be adjusted according to response and ongoing progress.
            </p>
          </div>
        </div>
      ) : (
        <div className='flex flex-col items-center justify-center py-16 text-muted'>
          <Calculator className='w-16 h-16 md:w-20 md:h-20 mb-4 opacity-30'/>
          <p className='text-base md:text-lg text-center'>Enter your information and click<br />
          "Calculate Macros" to see your results</p>
        </div>
      )}  
    </div>

    {/* Footer */}
    <div className='text-center mt-8 pb-8 text-muted text-xs md:text-sm'>
      <p>Built with React, Node.js, Express, and MongoDB</p>
      <p>Calculations based on peer-reviewed nutrition research</p>
    </div>

    </div>
    
  );


};

export default MacroCalculator;