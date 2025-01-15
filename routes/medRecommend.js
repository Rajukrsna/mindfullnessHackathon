const express = require('express');

const router = express.Router();
 const axios = require('axios');
 const MeditationPractice = require('../model/Practice');

router.post('/medRecommend', async(req, res) => {
    console.log('Medication Recommendation route hit');
    try {
        //console.log(req.body);
        //console.log(req.headers);
            const moodDedected = req; // Get the extracted content (ingredients, etc.)
            
        //console.log(extractedIngredients);
            // Create the prompt for recipe generation
            const prompt = `You are an AI wellness guide. Given the following mood, generate 3 suitable pranayama or meditation practices. The output should be structured in the following JSON format:

            {
              "practices": [
                {
                  "name": "{Practice Name}",
                  "benefits": [
                    "{Benefit 1}",
                    "{Benefit 2}",
                    "{Benefit 3}"
                  ],
                  "description": "{Detailed description of the practice and how to perform it step-by-step}"
                },
                {
                  "name": "{Practice Name}",
                  "benefits": [
                    "{Benefit 1}",
                    "{Benefit 2}",
                    "{Benefit 3}"
                  ],
                  "description": "{Detailed description of the practice and how to perform it step-by-step}"
                },
                {
                  "name": "{Practice Name}",
                  "benefits": [
                    "{Benefit 1}",
                    "{Benefit 2}",
                    "{Benefit 3}"
                  ],
                  "description": "{Detailed description of the practice and how to perform it step-by-step}"
                }
              ]
            }
            
            **User Mood Provided**: ${moodDedected}
            
            Ensure each practice includes:
            1. A relevant name for the pranayama or meditation practice.
            2. A list of 3 specific benefits tailored to improve (or maintain the mood if it is happy/positive) the provided mood.
            3. A clear and detailed step-by-step description of how to perform the practice.
            
            Respond only with the proper JSON structure.`;
            
            
        
            // Step 4: Pass the extracted content and the user's question to the text model
            // Step 4: Pass the extracted content and the user's question to the text model
const response = await axios.post(
  "https://api.sambanova.ai/v1/chat/completions",
  {
    stream: true,
    model: "Meta-Llama-3.3-70B-Instruct",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
  },
  {
    headers: {
      "Authorization": `Bearer ${process.env.API_KEY}`,
      "Content-Type": "application/json",
    },
  }
);

const lines = response.data.split('\n');

const dataLines = lines.filter(line => line.startsWith('data:'));

const jsonData = dataLines.map(line => {
  const cleanLine = line.replace(/^data:\s*/, '');
  return cleanLine !== '[DONE]' ? JSON.parse(cleanLine) : null;
}).filter(entry => entry !== null);

let accumulatedDelta = '';

jsonData.forEach(chunk => {
  if (chunk.choices[0].delta.content) {
    accumulatedDelta += chunk.choices[0].delta.content;
  }
});

console.log(accumulatedDelta); 

// Now use accumulatedDelta directly as a string
const cleanedData = accumulatedDelta
  .replace(/```/g, '') // Remove any backticks
  .trim();  // Remove leading/trailing whitespace

// If the cleanedData is expected to be a valid JSON string, parse it
let parsedData;
try {
  parsedData = JSON.parse(cleanedData);
} catch (error) {
  console.error("Error parsing cleaned data:", error);
  return res.status(500).send("Error parsing data");
}

// Create a new MeditationPractice object based on the parsed data
const practice = new MeditationPractice({
  name: parsedData.practices[0].name,
  description: parsedData.practices[0].description,
  benefits: parsedData.practices[0].benefits,
  videoUrl: "https://www.youtube.com/watch?v=1a2b3c4d5e",
});

await practice.save();
res.json({ accumulatedDelta });

} catch (error) {
  console.error("Error:", error);
  res.status(500).send("Error in chatbot response");
}

});

module.exports = router;