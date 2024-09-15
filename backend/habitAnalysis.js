// backend/habitAnalysis.js 
const DailyData = require('./models/DailyData'); 

async function analyzeHabits(userId) {
  try {
    // Fetch the last 30 days of daily data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyData = await DailyData.find({
      userId: userId,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });

    // Initialize habit analysis object
    const habitAnalysis = {
      sleep: { good: 0, okay: 0, bad: 0 },
      eating: { good: 0, okay: 0, bad: 0 },
      hobbies: { good: 0, okay: 0, bad: 0 },
      school: { good: 0, okay: 0, bad: 0 },
      friendsFamily: { good: 0, okay: 0, bad: 0 },
      generalMood: { good: 0, okay: 0, bad: 0 }
    };

    // Analyze daily data
    dailyData.forEach(day => {
      for (const [key, value] of Object.entries(day.toObject())) {
        if (habitAnalysis[key]) {
          habitAnalysis[key][value.toLowerCase()]++;
        }
      }
    });

    // Generate summary for each habit
    const habitSummary = {
      sleep: analyzeSingleHabit(habitAnalysis.sleep),
      eating: analyzeSingleHabit(habitAnalysis.eating),
      hobbies: analyzeSingleHabit(habitAnalysis.hobbies),
      school: analyzeSingleHabit(habitAnalysis.school),
      friendsFamily: analyzeSingleHabit(habitAnalysis.friendsFamily),
      generalMood: analyzeSingleHabit(habitAnalysis.generalMood)
    };

    return [
      { title: 'Sleep', value: habitSummary.sleep },
      { title: 'Eating', value: habitSummary.eating },
      { title: 'Hobbies', value: habitSummary.hobbies },
      { title: 'School', value: habitSummary.school },
      { title: 'Friends and Family', value: habitSummary.friendsFamily },
      { title: 'General Mood', value: habitSummary.generalMood }
    ];
  } catch (error) {
    console.error('Error analyzing habits:', error);
    throw error;
  }
}

function analyzeSingleHabit(habitData) {
  const total = habitData.good + habitData.okay + habitData.bad;
  const goodPercentage = (habitData.good / total) * 100;
  const okayPercentage = (habitData.okay / total) * 100;
  const badPercentage = (habitData.bad / total) * 100;

  if (goodPercentage >= 60) return 'Good';
  if (goodPercentage + okayPercentage >= 60) return 'Okay';
  return 'Needs Improvement';
}

module.exports = {
  analyzeHabits
};