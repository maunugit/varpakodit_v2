// backend/habitAnalysis.js 
const DailyData = require('./models/DailyData'); 

async function analyzeHabits(userId) {
  try {
    // Fetch the last 30 days of daily data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyData = await DailyData.find({
      userId: userId,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: 1 });

    // Initialize habit scores object
    const habitScores = {
      sleep: [],
      eating: [],
      hobbies: [],
      school: [],
      friendsFamily: [],
      generalMood: [],
      outsideTime: [],
      hygiene: [],
      screenTime: [],
      timeWithAdults: [],
    };

    // Map field values to scores and collect scores
    dailyData.forEach((day) => {
      for (const [key, value] of Object.entries(day.toObject())) {
        if (habitScores[key] !== undefined) {
          const score = mapValueToScore(key, value);
          if (score !== null) {
            habitScores[key].push(score);
          }
        }
      }
    });

    // Generate summary for each habit
    const habitSummary = {};
    for (const [key, scores] of Object.entries(habitScores)) {
      habitSummary[key] = analyzeSingleHabit(scores, key);
    }

    // Format the result
    return Object.entries(habitSummary).map(([key, value]) => ({
      title: formatTitle(key),
      value,
    }));
  } catch (error) {
    console.error('Error analyzing habits:', error);
    throw error;
  }
}

function mapValueToScore(field, value) {
  switch (field) {
    case 'sleep':
      return Number(value); // Values are 1-5
    case 'eating':
    case 'school':
    case 'hobbies':
    case 'friendsFamily':
    case 'generalMood':
    case 'timeWithAdults':
      return mapTextToScore(value);
    case 'hygiene':
      return value.toLowerCase() === 'good' ? 3 : 1;
    case 'outsideTime':
      return mapOutsideTimeToScore(value);
    case 'screenTime':
      return Number(value); // Lower is better
    default:
      return null;
  }
}

function mapTextToScore(text) {
  switch (text.toLowerCase()) {
    case 'bad':
      return 1;
    case 'okay':
      return 2;
    case 'good':
      return 3;
    default:
      return null;
  }
}

function mapOutsideTimeToScore(value) {
  switch (value) {
    case 'Not at all':
      return 0;
    case 'less than an hour':
      return 1;
    case '1-2 hours':
      return 2;
    case '3+ hours':
      return 3;
    default:
      return null;
  }
}
function analyzeSingleHabit(scores, field) {
  const total = scores.length;
  if (total === 0) {
    return 'No data';
  }
  const sum = scores.reduce((acc, val) => acc + val, 0);
  const average = sum / total;

  let goodThreshold, okayThreshold;

  switch (field) {
    case 'sleep':
      goodThreshold = 4; // Average score >= 4
      okayThreshold = 3; // Average score >= 3
      break;
    case 'screenTime':
      // Lower screen time is better
      goodThreshold = 2;
      okayThreshold = 4;
      if (average <= goodThreshold) return 'Good';
      if (average <= okayThreshold) return 'Okay';
      return 'Needs Improvement';
    case 'outsideTime':
      goodThreshold = 2; // Average score >= 2
      okayThreshold = 1; // Average score >= 1
      break;
    case 'hygiene':
      goodThreshold = 3; // Only 'good' or 'bad'
      okayThreshold = 2; // No 'okay' in data
      break;
    default:
      // For fields with scores from 1 to 3
      goodThreshold = 2.5;
      okayThreshold = 1.5;
  }

  if (field !== 'screenTime') {
    if (average >= goodThreshold) return 'Good';
    if (average >= okayThreshold) return 'Okay';
    return 'Needs Improvement';
  }
}
function formatTitle(key) {
  // Convert camelCase to 'Title Case'
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
}

module.exports = {
  analyzeHabits,
};