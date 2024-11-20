const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const OpenAI = require('openai');
// const User = require('./models/User');

// routes
const dailyDataRoutes = require('./routes/dailyData');
const profileRoutes = require('./routes/profile');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const habitRoutes = require('./routes/habitRoutes');
const bdiQuestionnaireRouter = require('./routes/bdiQuestionnaire');
const rbdiQuestionnaireRouter = require('./routes/rbdiQuestionnaire');
const authRoutes = require('./routes/auth');
//const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();
 
app.use(cors({
  origin: 'https://varpakodit-frontend-service.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  exposedHeaders: ['Authorization']
}));
app.options('*', cors()); // enable pre-flight for all routes
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/dailyData', dailyDataRoutes); 
app.use('/api/profile', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/bdiQuestionnaire', bdiQuestionnaireRouter);
app.use('/api/rbdiQuestionnaire', rbdiQuestionnaireRouter);
app.use('/api/auth', authRoutes);

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const openai = new OpenAI({
  apiKey: process.env.VARPAKODIT_API_KEY,
});

// console.log("The right API KEY is:", process.env.VARPAKODIT_API_KEY);

// const assistantId = "asst_tkvPdOllDHLHIyekcUra3Yhw"; // Maunun Botti
const assistantId = "asst_4Fux8EcZM4vObTXSamREVGcy"; // Varpakotien Botti

// Utility function to handle tool calls
const handleToolCalls = async (required_action) => {
  const tool_outputs = [];
  for (const tool_call of required_action.submit_tool_outputs.tool_calls) {
    const tool_call_id = tool_call.id;
    const function_name = tool_call.function.name;
    const args = JSON.parse(tool_call.function.arguments);

    try {
      const function_response = globals[function_name](...args);
      tool_outputs.push({
        tool_call_id: tool_call_id,
        output: JSON.stringify({ status: "success", result: function_response }),
      });
    } catch (error) {
      tool_outputs.push({
        tool_call_id: tool_call_id,
        output: JSON.stringify({ status: "error", error: error.message }),
      });
    }
  }
  return tool_outputs;
};

app.post('/start', async (req, res) => {
  try {
    const thread = await openai.beta.threads.create();
    res.status(200).json({ thread_id: thread.id });
  } catch (error) {
    console.error('Error starting new thread:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/message', async (req, res) => {
  const { message, thread_id } = req.body;
  if (!message || !thread_id) {
    return res.status(400).json({ error: "No message or thread ID provided" });
  }
  try {
    console.log(`Received message: ${message} for thread_id: ${thread_id}`);
    await openai.beta.threads.messages.create(thread_id, {
      role: "user",
      content: message,
    });

    let run = await openai.beta.threads.runs.create(thread_id, {
      assistant_id: assistantId,
    });
    while (true) {
      run = await openai.beta.threads.runs.retrieve(thread_id, run.id);
      if (run.status === 'completed') {
        break;
      } else if (run.status === 'requires_action') {
        const tool_outputs = await handleToolCalls(run.required_action);
        await openai.beta.threads.runs.submit_tool_outputs(thread_id, run.id, { tool_outputs });
      }
      await new Promise(resolve => setTimeout(resolve, 1000)); // Sleep to prevent hammering the API too quickly
    }

    run = await openai.beta.threads.runs.retrieve(thread_id, run.id);
    const messages = await openai.beta.threads.messages.list(thread_id);
    const latest_message = messages.data[0].content[0].text.value || "No response from Assistant";

    console.log('AI response:', latest_message);
    res.status(200).json({ reply: latest_message });
  } catch (error) {
    console.error('Error handling message:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
