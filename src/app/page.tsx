'use client'

import { useState, ChangeEvent } from 'react'

interface WeightGuidance {
  category: string
  range: string
}

export default function Home() {
  const [unitSystem, setUnitSystem] = useState('metric') // 'metric' or 'imperial'
  const [height, setHeight] = useState('')
  const [heightFeet, setHeightFeet] = useState('')
  const [heightInches, setHeightInches] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBmi] = useState<number | null>(null)
  const [bmiCategory, setBmiCategory] = useState('')
  const [weightGuidance, setWeightGuidance] = useState<WeightGuidance[]>([])

  const handleUnitChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUnitSystem(event.target.value)
    // Reset inputs when unit system changes
    setHeight('')
    setHeightFeet('')
    setHeightInches('')
    setWeight('')
    setBmi(null)
    setBmiCategory('')
    setWeightGuidance([])
  }

  const calculateBmi = () => {
    let hCm: number
    let wKg: number

    if (unitSystem === 'metric') {
      hCm = parseFloat(height)
      wKg = parseFloat(weight)
    } else {
      const feet = parseFloat(heightFeet)
      const inches = parseFloat(heightInches)
      wKg = parseFloat(weight) * 0.453592 // lbs to kg

      if (isNaN(feet) && isNaN(inches)) {
        hCm = NaN // Mark as NaN if both are empty or invalid
      } else {
        hCm = ( (isNaN(feet) ? 0 : feet) * 30.48) + ( (isNaN(inches) ? 0 : inches) * 2.54) // ft/in to cm
      }
    }

    if (isNaN(hCm) || isNaN(wKg) || hCm <= 0 || wKg <= 0) {
      setBmi(null)
      setBmiCategory('Please enter valid height and weight')
      setWeightGuidance([])
      return
    }

    const hM = hCm / 100
    const bmiValue = wKg / (hM ** 2)
    setBmi(bmiValue)

    let currentCategory = ''
    if (bmiValue < 18.5) {
      currentCategory = 'Underweight'
    } else if (bmiValue < 25) {
      currentCategory = 'Normal weight'
    } else if (bmiValue < 30) {
      currentCategory = 'Overweight'
    } else {
      currentCategory = 'Obese'
    }
    setBmiCategory(currentCategory)

    // Calculate weight guidance
    const guidance: WeightGuidance[] = []
    const categories = [
      { name: 'Underweight', upper: 18.5 },
      { name: 'Normal weight', lower: 18.5, upper: 25 },
      { name: 'Overweight', lower: 25, upper: 30 },
      { name: 'Obese', lower: 30 },
    ]

    categories.forEach(cat => {
      let rangeStr = ''
      if (cat.lower) {
        const lowerW = cat.lower * (hM ** 2)
        rangeStr += unitSystem === 'metric' ? `${lowerW.toFixed(1)}kg` : `${(lowerW / 0.453592).toFixed(1)}lbs`
        rangeStr += ' - '
      }
      if (cat.upper) {
        const upperW = cat.upper * (hM ** 2)
        rangeStr += unitSystem === 'metric' ? `${upperW.toFixed(1)}kg` : `${(upperW / 0.453592).toFixed(1)}lbs`
      } else {
        // For obese, it's an open upper range
        const lowerW = cat.lower! * (hM ** 2)
         rangeStr = unitSystem === 'metric' ? `> ${lowerW.toFixed(1)}kg` : `> ${(lowerW / 0.453592).toFixed(1)}lbs`
      }
       // Adjust for Underweight to have an upper bound only
      if (cat.name === 'Underweight' && cat.upper) {
        const upperW = cat.upper * (hM ** 2);
        rangeStr = unitSystem === 'metric' ? `< ${upperW.toFixed(1)}kg` : `< ${(upperW / 0.453592).toFixed(1)}lbs`;
      }

      guidance.push({ category: cat.name, range: rangeStr })
    })
    setWeightGuidance(guidance)
  }

  return (
    <div className='min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4'>
      {/* Ad Placeholder 1 (Top) - Removed for Auto Ads */}
      {/* <div className='w-full max-w-md mb-8 p-4 bg-gray-300 text-center text-gray-700'>
        Ad Placeholder 1 (e.g., 728x90)
      </div> */}

      <main className='bg-white shadow-md rounded-lg p-8 w-full max-w-md'>
        <h1 className='text-3xl font-bold text-center mb-6 text-gray-700'>
          BMI Calculator
        </h1>

        <div className='mb-6'>
          <p className='block text-sm font-medium text-gray-600 mb-2'>Select Units:</p>
          <div className='flex items-center space-x-4'>
            <label className='flex items-center text-sm text-gray-700'>
              <input
                type='radio'
                name='unitSystem'
                value='metric'
                checked={unitSystem === 'metric'}
                onChange={handleUnitChange}
                className='mr-2 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500'
              />
              Metric (kg, cm)
            </label>
            <label className='flex items-center text-sm text-gray-700'>
              <input
                type='radio'
                name='unitSystem'
                value='imperial'
                checked={unitSystem === 'imperial'}
                onChange={handleUnitChange}
                className='mr-2 h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500'
              />
              Imperial (lbs, ft/in)
            </label>
          </div>
        </div>

        <div className='mb-4'>
          <label
            htmlFor='weight'
            className='block text-sm font-medium text-gray-600 mb-1'
          >
            Weight ({unitSystem === 'metric' ? 'kg' : 'lbs'})
          </label>
          <input
            type='number'
            id='weight'
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900'
            placeholder={unitSystem === 'metric' ? 'Enter your weight in kilograms' : 'Enter your weight in pounds'}
          />
        </div>

        {unitSystem === 'metric' ? (
          <div className='mb-6'>
            <label
              htmlFor='height-metric'
              className='block text-sm font-medium text-gray-600 mb-1'
            >
              Height (cm)
            </label>
            <input
              type='number'
              id='height-metric'
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900'
              placeholder='Enter your height in centimeters'
            />
          </div>
        ) : (
          <div className='mb-6'>
            <label className='block text-sm font-medium text-gray-600 mb-1'>
              Height (ft and inches)
            </label>
            <div className='flex space-x-2'>
              <input
                type='number'
                id='height-feet'
                value={heightFeet}
                onChange={(e) => setHeightFeet(e.target.value)}
                className='mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900'
                placeholder='Feet'
              />
              <input
                type='number'
                id='height-inches'
                value={heightInches}
                onChange={(e) => setHeightInches(e.target.value)}
                className='mt-1 block w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900'
                placeholder='Inches'
              />
            </div>
          </div>
        )}

        {/* Ad Placeholder 2 (Middle) - Removed for Auto Ads */}
        {/* <div className='w-full my-6 p-4 bg-gray-300 text-center text-gray-700'>
          Ad Placeholder 2 (e.g., 300x250)
        </div> */}

        <button
          onClick={calculateBmi}
          className='w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out'
        >
          Calculate BMI
        </button>

        {bmi !== null && (
          <div className='mt-8 p-4 bg-indigo-50 rounded-md text-center'>
            <p className='text-xl font-semibold text-indigo-700'>
              Your BMI: {bmi.toFixed(2)}
            </p>
            <p className='text-lg text-indigo-600'>{bmiCategory}</p>
          </div>
        )}
        {bmi === null && bmiCategory && (
           <div className='mt-8 p-4 bg-red-100 rounded-md text-center'>
            <p className='text-lg text-red-600'>{bmiCategory}</p>
          </div>
        )}

        {weightGuidance.length > 0 && (
          <div className='mt-8 pt-6 border-t border-gray-200'>
            <h3 className='text-xl font-semibold text-gray-700 mb-3 text-center'>Weight Guidance for Your Height</h3>
            <div className='space-y-2'>
              {weightGuidance.map((item) => (
                <div key={item.category} className={`p-3 rounded-md flex justify-between items-center ${item.category === bmiCategory ? 'bg-indigo-100 border border-indigo-300' : 'bg-gray-50'}`}>
                  <span className={`font-medium ${item.category === bmiCategory ? 'text-indigo-700' : 'text-gray-600'}`}>{item.category}</span>
                  <span className={`text-sm ${item.category === bmiCategory ? 'text-indigo-600' : 'text-gray-500'}`}>{item.range}</span>
                </div>
              ))}
            </div>
             <p className='mt-4 text-xs text-gray-500 text-center'>
              These ranges are based on standard BMI categories for your entered height.
            </p>
          </div>
        )}
      </main>

      {/* Ad Placeholder 3 (Bottom) - Removed for Auto Ads */}
      {/* <div className='w-full max-w-md mt-8 p-4 bg-gray-300 text-center text-gray-700'>
        Ad Placeholder 3 (e.g., 728x90 or 300x250)
      </div> */}

      <footer className='mt-12 text-center text-sm text-gray-500'>
        <p>&copy; {new Date().getFullYear()} BMI Calculator. All rights reserved.</p>
        <p>Disclaimer: This calculator is for informational purposes only.</p>
      </footer>
    </div>
  )
}
