import React, { useState } from 'react';
import './App.css';

function App() {
    const [formData, setFormData] = useState({
        gender: '',
        weight: '',
        bodyFat: '',
        height: '',
        goal: '',
        activityLevel: ''
    });

    const [customizations, setCustomizations] = useState({
        calorieAdjustment: 0,
        proteinPerPound: 1,
        carbsInGrams: 120
    });

    const [showResults, setShowResults] = useState(false);
    const [showCustomization, setShowCustomization] = useState(false);
    const [error, setError] = useState('');

    const calculateTDEE = () => {
        const weight = parseFloat(formData.weight);
        const bodyFat = parseFloat(formData.bodyFat);
        const leanMass = weight * (1 - (bodyFat / 100));
        const BMR = 370 + (21.6 * leanMass);
        
        const activityMultipliers = {
            sedentary: 1.2,
            lightlyActive: 1.375,
            moderatelyActive: 1.55,
            vigorouslyActive: 1.725
        };
        
        return BMR * activityMultipliers[formData.activityLevel];
    };

    const calculateMacros = () => {
        const weight = parseFloat(formData.weight);
        const bodyFat = parseFloat(formData.bodyFat);
        const leanMass = weight * (1 - (bodyFat / 100));
        
        let TDEE = calculateTDEE();
        
        const goalAdjustments = {
            loseFat: -0.2,
            maintain: 0,
            gainMuscle: 0.1
        };
        
        let adjustedTDEE = TDEE * (1 + (goalAdjustments[formData.goal] || 0));
        
        if (customizations.calorieAdjustment) {
            adjustedTDEE *= (1 + (customizations.calorieAdjustment / 100));
        }
        
        const protein = leanMass * customizations.proteinPerPound;
        const carbs = customizations.carbsInGrams;
        const proteinCalories = protein * 4;
        const carbCalories = carbs * 4;
        const remainingCalories = adjustedTDEE - proteinCalories - carbCalories;
        const fat = remainingCalories / 9;
        
        return {
            calories: Math.round(adjustedTDEE),
            protein: Math.round(protein),
            carbs: Math.round(carbs),
            fat: Math.max(0, Math.round(fat))
        };
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.gender || !formData.weight || !formData.bodyFat || 
            !formData.height || !formData.goal || !formData.activityLevel) {
            setError('Please fill in all fields');
            return;
        }
        setError('');
        setShowResults(true);
    };

    const handleCustomizationSubmit = (e) => {
        e.preventDefault();
        setShowResults(true);
        setShowCustomization(false);
    };

    return (
        <div className="calculator">
            {!showResults && (
                <div className="form-container">
                    <h1>Macro Calculator</h1>
                    {error && <div className="error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Gender</label>
                            <div className="radio-group">
                                {[['male', 'Male'], ['female', 'Female']].map(([value, label]) => (
                                    <label key={value} className="radio-label">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={value}
                                            checked={formData.gender === value}
                                            onChange={e => setFormData({...formData, gender: e.target.value})}
                                        />
                                        <span className="radio-text">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Weight (lbs)</label>
                                <input
                                    type="number"
                                    value={formData.weight}
                                    onChange={e => setFormData({...formData, weight: e.target.value})}
                                    placeholder="Enter weight"
                                />
                            </div>

                            <div className="form-group">
                                <label>Body Fat %</label>
                                <input
                                    type="number"
                                    value={formData.bodyFat}
                                    onChange={e => setFormData({...formData, bodyFat: e.target.value})}
                                    placeholder="Enter body fat"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Height (inches)</label>
                            <input
                                type="number"
                                value={formData.height}
                                onChange={e => setFormData({...formData, height: e.target.value})}
                                placeholder="Enter height"
                            />
                        </div>

                        <div className="form-group">
                            <label>Goal</label>
                            <div className="radio-group">
                                {[
                                    ['loseFat', 'Lose Body Fat'],
                                    ['maintain', 'Maintain'],
                                    ['gainMuscle', 'Gain Muscle']
                                ].map(([value, label]) => (
                                    <label key={value} className="radio-label">
                                        <input
                                            type="radio"
                                            name="goal"
                                            value={value}
                                            checked={formData.goal === value}
                                            onChange={e => setFormData({...formData, goal: e.target.value})}
                                        />
                                        <span className="radio-text">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Activity Level</label>
                            <div className="radio-group vertical">
                                {[
                                    ['sedentary', 'Sedentary'],
                                    ['lightlyActive', 'Lightly Active'],
                                    ['moderatelyActive', 'Moderately Active'],
                                    ['vigorouslyActive', 'Vigorously Active']
                                ].map(([value, label]) => (
                                    <label key={value} className="radio-label">
                                        <input
                                            type="radio"
                                            name="activityLevel"
                                            value={value}
                                            checked={formData.activityLevel === value}
                                            onChange={e => setFormData({...formData, activityLevel: e.target.value})}
                                        />
                                        <span className="radio-text">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="button">Calculate Macros</button>
                    </form>
                </div>
            )}

            {showResults && !showCustomization && (
                <div className="results-container">
                    <h2>Your Macro Results</h2>
                    <div className="results">
                        {(() => {
                            const macros = calculateMacros();
                            return (
                                <>
                                    <div className="macro-result">
                                        <span className="macro-label">Daily Calories:</span>
                                        <span className="macro-value">{macros.calories}</span>
                                    </div>
                                    <div className="macro-result">
                                        <span className="macro-label">Protein:</span>
                                        <span className="macro-value">{macros.protein}g</span>
                                    </div>
                                    <div className="macro-result">
                                        <span className="macro-label">Carbohydrates:</span>
                                        <span className="macro-value">{macros.carbs}g</span>
                                    </div>
                                    <div className="macro-result">
                                        <span className="macro-label">Fat:</span>
                                        <span className="macro-value">{macros.fat}g</span>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                    <button 
                        onClick={() => setShowCustomization(true)} 
                        className="button"
                    >
                        Customize
                    </button>
                    <button 
                        onClick={() => setShowResults(false)} 
                        className="button secondary"
                    >
                        Start Over
                    </button>
                </div>
            )}

            {showCustomization && (
                <div className="form-container">
                    <h2>Customize Your Macros</h2>
                    <form onSubmit={handleCustomizationSubmit}>
                        <div className="form-group">
                            <label>Calorie Adjustment (%)</label>
                            <input
                                type="number"
                                value={customizations.calorieAdjustment}
                                onChange={e => setCustomizations({
                                    ...customizations,
                                    calorieAdjustment: parseFloat(e.target.value)
                                })}
                                placeholder="Enter adjustment"
                            />
                        </div>
                        <div className="form-group">
                            <label>Protein per pound of lean mass</label>
                            <input
                                type="number"
                                step="0.1"
                                value={customizations.proteinPerPound}
                                onChange={e => setCustomizations({
                                    ...customizations,
                                    proteinPerPound: parseFloat(e.target.value)
                                })}
                                placeholder="Enter protein ratio"
                            />
                        </div>
                        <div className="form-group">
                            <label>Carbohydrates (g)</label>
                            <input
                                type="number"
                                value={customizations.carbsInGrams}
                                onChange={e => setCustomizations({
                                    ...customizations,
                                    carbsInGrams: parseFloat(e.target.value)
                                })}
                                placeholder="Enter carbs"
                            />
                        </div>
                        <button type="submit" className="button">Update Results</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default App;
