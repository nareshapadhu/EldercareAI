require('dotenv').config();
const venom = require('venom-bot');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// Debug: Check if API key is loaded
console.log('API Key loaded:', process.env.OPENROUTER_API_KEY ? 'Yes' : 'No');

let client;

const app = express();
app.use(bodyParser.json());

// 🟩 Your AI prompt goes here (simple HuggingFace-compatible)
const onboardingPrompt = `
You are an eldercare onboarding assistant. Ask the user step by step:
1. Their full name
2. Age
3. List of medicines with quantity and time slots
4. Emergency contact numbers of family members

Be friendly and polite. Never suggest any medicines or treatments. Always say "please consult your doctor" if asked.
`;

// 📩 Message history per user
const userState = {};

// API endpoint to send a message
app.post('/send', async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).send({ error: 'Missing "to" or "message" in request' });
  }

  try {
    await client.sendText(to, message);
    console.log(`✅ Message sent to ${to}: ${message}`);
    res.send({ success: true });
  } catch (err) {
    console.error('❌ Error sending message:', err.message);
    res.status(500).send({ success: false, error: err.message });
  }
});

venom
  .create({
    session: 'eldercare-bot',
    multidevice: true,
    headless: true,
    browserPath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    puppeteerOptions: {
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  })
  .then((bot) => {
    client = bot;
    console.log('✅ Venom bot is ready');

    app.listen(3000, () => {
      console.log('🚀 WhatsApp API running at http://localhost:3000/send');
    });

    client.onMessage(async (message) => {
      const sender = message.from;
      const text = message.body.trim().toLowerCase();

      console.log(`📩 Incoming from ${sender}: ${message.body}`);

      if (!userState[sender]) {
        userState[sender] = [];
      }

      userState[sender].push({ role: 'user', content: message.body });

      // If message starts onboarding
      if (text === 'hi' || text === 'start') {
        const welcome = '👋 Welcome to the eldercare onboarding assistant!\nLet\'s get started.';
        await client.sendText(sender, welcome);

        userState[sender] = [
          { role: 'system', content: onboardingPrompt },
          { role: 'user', content: 'Start the onboarding' }
        ];

        const aiResponse = await getAIResponse(userState[sender]);
        userState[sender].push({ role: 'assistant', content: aiResponse });
        await client.sendText(sender, aiResponse);
      } else if (userState[sender]) {
        userState[sender].push({ role: 'user', content: message.body });
        const aiResponse = await getAIResponse(userState[sender]);
        userState[sender].push({ role: 'assistant', content: aiResponse });
        await client.sendText(sender, aiResponse);

        // 🟢 Send onboarding data to n8n webhook
        try {
          const webhookData = {
            sender,
            latestMessage: message.body,
            aiResponse,
            conversation: userState[sender]
          };
          console.log('📤 Attempting to send data to n8n:', {
            webhookUrl: 'http://localhost:5678/webhook/onboarding',
            dataSize: JSON.stringify(webhookData).length,
            timestamp: new Date().toISOString()
          });

          const response = await axios.post('http://localhost:5678/webhook/onboarding', webhookData);
          console.log('✅ n8n webhook response:', {
            status: response.status,
            statusText: response.statusText,
            timestamp: new Date().toISOString()
          });
        } catch (err) {
          console.error('❌ n8n webhook error:', {
            message: err.message,
            code: err.code,
            response: err.response?.data,
            timestamp: new Date().toISOString()
          });
        }
      }
    });
  })
  .catch((err) => {
    console.error('❌ Venom bot failed to start:', err.message);
  });





  async function getAIResponse(history) {
    const messages = history.map((m) => ({
      role: m.role,
      content: m.content,
    }));
  
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mistral-7b-instruct', // or any other model from OpenRouter
          messages: messages,
        },
        {
          headers: {
            'Authorization': 'Bearer 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', // replace with your key
            'Content-Type': 'application/json',
          }
        }
      );
  
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('❌ AI error:', error.response ? error.response.data : error.message);
      return "I'm sorry, I couldn’t process that. Please try again.";
    }
  }