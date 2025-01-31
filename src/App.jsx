import React, { useState } from 'react';
import './App.css';

const Tooltip = ({ content }) => (
    <div className="tooltip">
        <span className="tooltip-icon">?</span>
        <span className="tooltip-text">{content}</span>
    </div>
);

function App() {
    // ... [previous state code remains the same] ...

    const activityDescriptions = {
        sedentary: "Little to no exercise, desk job",
        lightlyActive: "Light exercise 1-3 days/week",
        moderatelyActive: "Moderate exercise 3-5 days/week",
        vigorouslyActive: "Heavy exercise 6-7 days/week"
    };

    return (
        <div className="calculator">
            <div className="intro">
                <h1>Macro Calculator</h1>
                <p className="description">
                    Calculate your personalized macronutrient needs based on your body composition, 
                    activity level, and fitness goals. This calculator uses the Katch-McArdle formula 
                    for enhanced accuracy, factoring in your lean body mass.
                </p>
            </div>

            {!showResults && (
                <div className="form-container">
                    {error && <div className="error">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <h3>Personal Information</h3>
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
                                    <label>
                                        Weight (lbs)
                                        <Tooltip content="Your current weight in pounds" />
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.weight}
                                        onChange={e => setFormData({...formData, weight: e.target.value})}
                                        placeholder="Enter weight"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        Body Fat %
                                        <Tooltip content="Your estimated body fat percentage. If unsure, use 20% for men and 25% for women as starting points." />
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.bodyFat}
                                        onChange={e => setFormData({...formData, bodyFat: e.target.value})}
                                        placeholder="Enter body fat"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>
                                    Height (inches)
                                    <Tooltip content="Your height in inches (5ft = 60 inches, 6ft = 72 inches)" />
                                </label>
                                <input
                                    type="number"
                                    value={formData.height}
                                    onChange={e => setFormData({...formData, height: e.target.value})}
                                    placeholder="Enter height"
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>Goals & Activity</h3>
                            <div className="form-group">
                                <label>
                                    Goal
                                    <Tooltip content="Select based on your primary fitness objective" />
                                </label>
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
                                <label>
                                    Activity Level
                                    <Tooltip content="Select the option that best matches your weekly activity" />
                                </label>
                                <div className="radio-group vertical">
                                    {Object.entries({
                                        sedentary: 'Sedentary',
                                        lightlyActive: 'Lightly Active',
                                        moderatelyActive: 'Moderately Active',
                                        vigorouslyActive: 'Vigorously Active'
                                    }).map(([value, label]) => (
                                        <label key={value} className="radio-label">
                                            <input
                                                type="radio"
                                                name="activityLevel"
                                                value={value}
                                                checked={formData.activityLevel === value}
                                                onChange={e => setFormData({...formData, activityLevel: e.target.value})}
                                            />
                                            <span className="radio-text">
                                                {label}
                                                <span className="activity-description">
                                                    {activityDescriptions[value]}
                                                </span>
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="button">Calculate Macros</button>
                    </form>
                </div>
            )}

            {showResults && !showCustomization && (
                <div className="results-container">
                    <h2>Your Personalized Macro Plan</h2>
                    <div className="results">
                        {(() => {
                            const macros = calculateMacros();
                            return (
                                <>
                                    <div className="macro-result">
                                        <div className="macro-header">
                                            <span className="macro-label">Daily Calories</span>
                                            <Tooltip content="Your total daily calorie target based on your goals and activity level" />
                                        </div>
                                        <span className="macro-value highlight">{macros.calories}</span>
                                    </div>
                                    <div className="macro-result">
                                        <div className="macro-header">
                                            <span className="macro-label">Protein</span>
                                            <Tooltip content="Crucial for muscle maintenance and recovery" />
                                        </div>
                                        <span className="macro-value">{macros.protein}g</span>
                                    </div>
                                    <div className="macro-result">
                                        <div className="macro-header">
                                            <span className="macro-label">Carbohydrates</span>
                                            <Tooltip content="Primary energy source for workouts and daily activities" />
                                        </div>
                                        <span className="macro-value">{macros.carbs}g</span>
                                    </div>
                                    <div className="macro-result">
                                        <div className="macro-header">
                                            <span className="macro-label">Fat</span>
                                            <Tooltip content="Essential for hormone production and overall health" />
                                        </div>
                                        <span className="macro-value">{macros.fat}g</span>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                    <div className="results-explanation">
                        <p>These macros are calculated based on your specific needs. The protein target helps maintain muscle, 
                        carbs fuel your workouts, and fats support hormone function.</p>
                    </div>
                    <div className="button-group">
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
                </div>
            )}

            {showCustomization && (
                <div className="form-container">
                    <h2>Fine-Tune Your Macros</h2>
                    <p className="customization-intro">
                        Adjust these values based on your preferences or specific dietary needs.
                    </p>
                    <form onSubmit={handleCustomizationSubmit}>
                        <div className="form-group">
                            <label>
                                Calorie Adjustment (%)
                                <Tooltip content="Adjust total calories up or down. Use positive numbers to increase, negative to decrease." />
                            </label>
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
                            <label>
                                Protein per pound of lean mass
                                <Tooltip content="Standard range is 0.8-1.2g per pound of lean mass" />
                            </label>
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
                            <label>
                                Carbohydrates (g)
                                <Tooltip content="Adjust based on your carb preferences and energy needs" />
                            </label>
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
