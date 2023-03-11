const { Configuration, OpenAIApi } = require("openai");
const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/user');

require('dotenv').config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Route for getting AI feedback
router.post('/', async (req, res) => {
  const { answers, address } = req.body;

  try {
   const user = await User.findOne({ address: address });
   const { nickname, gender, age, height, heightUnit, weight, weightUnit, fitnessLevel, fitnessGoal, curExercise, dailyActivity } = user;
    
    const prompt = `Imagine you are a world class health and fitness coach  known as “C.H.A.N.G.E.360” and you are tasked with creating a nutrition program for a client ${nickname} who has been using your services for a few days to get them the best results in the fastest most sustainable way possible. The solution must be a new 1 day meal plan based on updated data in table format, the plan must adhere to  ${nickname}'s follow-up information and provide at least 1 recipe from the meal plan.  Do not reply that there are many factors that influence diet and nutrition. Do not echo my prompt. Client summary =Gender: ${gender}, Age: ${age}, Height: ${height} ${heightUnit}, Weight: ${weight} ${weightUnit}, Fitness Level: ${fitnessLevel}, Fitness Goal: ${fitnessGoal}, Current Exercise: ${curExercise}, Daily Activity: ${dailyActivity}., ${answers}. Prepare the one day full plan now and provide recommendations based on client feedback.`;   
   
    // const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
    //     prompt: `${prompt}`,
    //     temperature: 0.5,
    //     max_tokens: 4000,
    //     top_p: 1,
    //     frequency_penalty: 0,
    //     presence_penalty: 0,
    // }, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    //   },
    // });

    const response = await openai.createCompletion({
      model: `text-davinci-003`, 
      prompt: `${prompt}`,
      temperature: 0.5,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    res.json({
        message: response.data.choices[0].text
      });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
