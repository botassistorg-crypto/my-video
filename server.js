// server.js

const express = require('express');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
const PORT = process.env.PORT || 10000;

// This is the main "render" endpoint.
// Pipedream will send a POST request to this URL.
app.post('/render-video', async (req, res) => {
  console.log("Received a new render request...");

  // Get the data from Pipedream's request
  const { topic, quote, imageUrl } = req.body;

  if (!topic || !quote || !imageUrl) {
    return res.status(400).send({ error: 'Missing required properties: topic, quote, imageUrl' });
  }

  // Define the output file path. We add a random number to make it unique.
  const outputFileName = `video-${Date.now()}.mp4`;
  const outputLocation = `out/${outputFileName}`;

  // This is our render command. It now includes the custom data via '--props'.
  const renderCommand = `npx remotion render src/index.ts MyComp ${outputLocation} --props='${JSON.stringify({ topic, quote, imageUrl })}'`;

  console.log(`Executing render command: ${renderCommand}`);

  try {
    // Execute the render command. This will take time.
    await execAsync(renderCommand);
    console.log(`Successfully rendered video: ${outputLocation}`);

    // In a real application, we would upload this file to a service like S3
    // and return the public URL. For now, we will just confirm success.
    // NOTE: Render.com has an ephemeral filesystem, so the file will disappear after a while.
    res.status(200).send({
      success: true,
      message: "Video rendered successfully.",
      // In the future, this would be a public URL to the video.
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