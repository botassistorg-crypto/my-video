// server.js - Version 2 (Robust)

const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 10000;

app.post('/render-video', async (req, res) => {
  console.log("Received a new render request...");

  const { topic, quote, imageUrl } = req.body;

  if (!topic || !quote || !imageUrl) {
    return res.status(400).send({ error: 'Missing required properties: topic, quote, imageUrl' });
  }

  const outputFileName = `video-${Date.now()}.mp4`;
  const outputLocation = `out/${outputFileName}`;

  // --- THE FIX ---
  // We create a clean JSON object for the props.
  const inputProps = { topic, quote, imageUrl };

  // We convert the object to a JSON string.
  const propsString = JSON.stringify(inputProps);

  // We "escape" the string for shell command safety. This is the crucial part.
  // This replaces single quotes with a "safe" version so the shell doesn't get confused.
  const escapedPropsString = propsString.replace(/'/g, "'\\''");
  
  // We build the final command using these safe, escaped props.
  const renderCommand = `npx remotion render src/index.ts MyComp ${outputLocation} --props='${escapedPropsString}'`;
  
  console.log(`Executing robust render command...`);

  try {
    await execAsync(renderCommand);
    console.log(`Successfully rendered video: ${outputLocation}`);
    
    // For now, we just confirm success.
    res.status(200).send({
      success: true,
      message: "Video rendered successfully.",
      videoPath: outputLocation
    });

  } catch (error) {
    console.error("--- RENDER FAILED ---");
    console.error(error.stderr || error.message);
    res.status(500).send({ error: 'Failed to render video.', details: error.stderr || error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Remotion Rendering Server listening on port ${PORT}`);
});