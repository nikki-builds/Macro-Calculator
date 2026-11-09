import React, { useState, useRef, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Calculator,Activity, Target } from 'lucide-react';
import './App.css';


const MacroCalculator = () => {
  // This is where I'm storing form data
  const [formData, setFormData] = useState({
    age:'',
    unit: 'us',      // 'us' (lb, ft/in) or 'metric' (kg, cm)
    weight:'',       // lb or kg, depending on unit
    height: '',      // cm (metric only)
    heightFt: '',    // ft (US only)
    heightIn: '',    // in (US only)
    gender: 'male',
    activityLevel: 'sedentary',
    goal: 'maintain'
  });

  // This is where I'll store calculation results
  const [results, setResults] = useState(null); // null: nothing or empty (no data yet or intentionall empty)

  const [isLoading, setIsLoading] = useState(false);

  // After a calculation, bring the results into view (small screens)
  // and move keyboard/screen-reader focus to them.
  const resultsRef = useRef(null);
  useEffect(() => {
    if (!results || !resultsRef.current) return;
    const el = resultsRef.current;
    const top = el.getBoundingClientRect().top;
    const alreadyVisible = top >= 0 && top < window.innerHeight * 0.5;
    if (!alreadyVisible) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
    el.focus({ preventScroll: true });
  }, [results]);

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
  const { age, unit, weight, height, heightFt, heightIn, gender, activityLevel, goal } = formData;
  // long way:
  // const age = formData.age;
  // const weight = formData.weight;

  // validation
  const heightMissing = unit === 'us' ? !heightFt : !height;
  if(!age || !weight || heightMissing) {
    toast.error('Please fill in all fields!');
    return;
  }

  setIsLoading(true); // show loading spinner

  // The formulas use kg and cm, so US inputs are converted first.
  const weightKg = unit === 'us' ? parseFloat(weight) * 0.453592 : parseFloat(weight);
  const heightCm = unit === 'us'
    ? (parseFloat(heightFt) * 12 + (parseFloat(heightIn) || 0)) * 2.54
    : parseFloat(height);

  const bmr = calculateBMR(
    weightKg,
    heightCm,
    parseFloat(age),
    gender
  );

  const tdee = bmr * activityMultipliers[activityLevel];

  let calculatedCalories = tdee;
  if (goal === 'lose') {
    calculatedCalories = tdee - 500; 
  } else if (goal === 'gain') {
    calculatedCalories = tdee + 500; 
  }

  // Never recommend less than 1,200 kcal/day
  const MIN_CALORIES = 1200;
  const belowMinimum = calculatedCalories < MIN_CALORIES;
  const targetCalories = Math.max(calculatedCalories, MIN_CALORIES);

  // Protein is set by body weight (g per kg), not by a % of calories,
  // so it doesn't grow just because calories are high.
  const proteinPerKg = { lose: 1.8, maintain: 1.4, gain: 1.8 };
  // Fat is a share of calories; carbs fill whatever calories are left.
  const fatShare = { lose: 0.30, maintain: 0.30, gain: 0.25 };

  const proteinGrams = Math.round(weightKg * proteinPerKg[goal]);
  const proteinCalories = proteinGrams * 4;

  const fatsGrams = Math.round((targetCalories * fatShare[goal]) / 9);
  const fatsCalories = fatsGrams * 9;

  const carbsCalories = Math.max(targetCalories - proteinCalories - fatsCalories, 0);
  const carbsGrams = Math.round(carbsCalories / 4);

  const percentOf = (kcal) => Math.round((kcal / targetCalories) * 100);

  const calculationResults = {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    calculatedCalories: Math.round(calculatedCalories),
    belowMinimum,
    goal,
    protein: {
      grams: proteinGrams,
      calories: proteinCalories,
      percentage: percentOf(proteinCalories),
      perKg: proteinPerKg[goal]
    },
    carbs: {
      grams: carbsGrams,
      calories: carbsGrams * 4,
      percentage: percentOf(carbsGrams * 4)
    },
    fats: {
      grams: fatsGrams,
      calories: fatsCalories,
      percentage: percentOf(fatsCalories)
    }
  };

  setResults(calculationResults);

  // Calculation runs entirely in the browser; results are not saved anywhere.
  setIsLoading(false);

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

      {/* Unit toggle: US (lb, ft/in) or Metric (kg, cm) */}
      <div className='mb-4'>
        <span className='block text-sm font-medium text-muted mb-2' id='unit-label'>Units</span>
        <div className='inline-flex rounded-lg border border-highlight/50 overflow-hidden' role='group' aria-labelledby='unit-label'>
          {[
            { value: 'us', label: 'US (lb, ft/in)' },
            { value: 'metric', label: 'Metric (kg, cm)' },
          ].map((opt) => (
            <button
              key={opt.value}
              type='button'
              aria-pressed={formData.unit === opt.value}
              onClick={() => setFormData({ ...formData, unit: opt.value, weight: '', height: '', heightFt: '', heightIn: '' })}
              className={`px-4 py-2 min-h-[44px] text-sm font-medium transition ${
                formData.unit === opt.value ? 'bg-accent text-white' : 'bg-transparent text-muted hover:bg-highlight/30'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* AGE */}
      <div className='mb-4'>
        <label htmlFor='age' className='block text-sm font-medium text-muted mb-2'>Age (years)</label>
        <input id='age' type='number' name='age' value={formData.age} placeholder='25'
          onChange={(e)=> setFormData({ ...formData, age: e.target.value })}
          className='w-full px-4 py-2 md:py-3 border border-highlight/50 rounded-lg focus:ring-2 focus:ring-accent/40 focus:border-transparent transition' />
      </div>

      {/* WEIGHT */}
      <div className='mb-4'>
        <label htmlFor='weight' className='block text-sm font-medium text-muted mb-2'>
          Weight ({formData.unit === 'us' ? 'lb' : 'kg'})
        </label>
        <input id='weight' type='number' name='weight' value={formData.weight}
          placeholder={formData.unit === 'us' ? '140' : '63'}
          onChange={(e)=> setFormData({ ...formData, weight: e.target.value })}
          className='w-full px-4 py-2 md:py-3 border border-highlight/50 rounded-lg focus:ring-2 focus:ring-accent/40 focus:border-transparent transition' />
      </div>

      {/* HEIGHT */}
      {formData.unit === 'us' ? (
        <fieldset className='mb-4'>
          <legend className='block text-sm font-medium text-muted mb-2'>Height</legend>
          <div className='flex gap-3'>
            <div className='flex-1'>
              <label htmlFor='heightFt' className='sr-only'>Feet</label>
              <div className='relative'>
                <input id='heightFt' type='number' name='heightFt' value={formData.heightFt} placeholder='5'
                  onChange={(e)=> setFormData({ ...formData, heightFt: e.target.value })}
                  className='w-full px-4 py-2 md:py-3 border border-highlight/50 rounded-lg focus:ring-2 focus:ring-accent/40 focus:border-transparent transition pr-10' />
                <span className='absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted' aria-hidden='true'>ft</span>
              </div>
            </div>
            <div className='flex-1'>
              <label htmlFor='heightIn' className='sr-only'>Inches</label>
              <div className='relative'>
                <input id='heightIn' type='number' name='heightIn' value={formData.heightIn} placeholder='4'
                  onChange={(e)=> setFormData({ ...formData, heightIn: e.target.value })}
                  className='w-full px-4 py-2 md:py-3 border border-highlight/50 rounded-lg focus:ring-2 focus:ring-accent/40 focus:border-transparent transition pr-10' />
                <span className='absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted' aria-hidden='true'>in</span>
              </div>
            </div>
          </div>
        </fieldset>
      ) : (
        <div className='mb-4'>
          <label htmlFor='height' className='block text-sm font-medium text-muted mb-2'>Height (cm)</label>
          <input id='height' type='number' name='height' value={formData.height} placeholder='163'
            onChange={(e)=> setFormData({ ...formData, height: e.target.value })}
            className='w-full px-4 py-2 md:py-3 border border-highlight/50 rounded-lg focus:ring-2 focus:ring-accent/40 focus:border-transparent transition' />
        </div>
      )}

    
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
      <h2 ref={resultsRef} tabIndex={-1} className='text-lg md:text-2xl font-semibold text-accent mb-6 scroll-mt-4 focus:outline-none'>Your Results</h2>
      {results ? (
        <div className='space-y-6 result-container'>
           {/* Daily calorie target */}
          <div className='bg-gradient-to-br from-background to-highlight/30 rounded-xl p-6 border border-highlight/40'>
            <p className='text-sm text-muted mb-2 font-medium'>Daily Calorie Target</p>
            <p className='text-4xl md:text-5xl font-bold text-accent mb-3'>{results.targetCalories}</p>
            <div className='flex justify-between gap-4 text-xs md:text-sm text-muted pt-3 border-t border-highlight/30'>
              <div>
                <p>BMR: <span className='font-bold'>{results.bmr}</span> kcal/day</p>
                <p className='text-[11px] md:text-xs mt-0.5'>Basal Metabolic Rate: energy your body uses at rest</p>
              </div>
              <div className='text-right'>
                <p>TDEE: <span className='font-bold'>{results.tdee}</span> kcal/day</p>
                <p className='text-[11px] md:text-xs mt-0.5'>Total Daily Energy Expenditure: BMR plus activity</p>
              </div>
            </div>
          </div>

          {/* F. Minimum calorie warning */}
          {results.belowMinimum && (
            <div role='alert' className='rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800'>
              <p className='font-semibold'>Your target was raised to 1,200 kcal.</p>
              <p className='mt-1'>
                Based on your inputs, the formula suggested {results.calculatedCalories} kcal/day. Eating below
                1,200 kcal a day can be risky for adults and isn't recommended without medical supervision.
              </p>
            </div>
          )}

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
                  <span className='text-xs text-muted'>({results.fats.percentage}% • {results.fats.calories}kcal)</span>
                </div>
              </div>

              <div className='mc-progress-track'>
                <div className='mc-progress-fill progress-bar' style={{width:`${results.fats.percentage}%`}}></div>
              </div>           
            </div>
          </div>
          
          {/* Muscle gain tip */}
          {results.goal === 'gain' && (
            <div className='bg-background border-l-4 border-accent/70 p-4 rounded'>
              <p className='text-sm text-muted'>
                <span className='font-semibold text-accent'>Building muscle:</span> Extra calories alone won't build
                muscle. Pair this plan with regular strength training, and spread your protein across meals
                (about 20 to 40 g per meal).
              </p>
            </div>
          )}

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