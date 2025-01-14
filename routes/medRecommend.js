const express = require('express');

const router = express.Router();
 const axios = require('axios');

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
            //console.log( response.data);
        
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
        res.json({ accumulatedDelta});
        
        
          } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Error in chatbot response");
          }
});

module.exports = router;