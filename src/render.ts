// src/render.ts

import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";
import path from "path";
import { webpackOverride } from "../webpack-override";

// This is our main rendering function.
const main = async () => {
  console.log("Starting programmatic render...");

  // The composition ID from our Root.tsx file
  const compositionId = "MyComp";

  // --- Step 1: Bundle our React code ---
  console.log("Bundling the Remotion project...");
  const bundleLocation = await bundle({
    entryPoint: path.resolve("./src/index.ts"),
    webpackOverride,
  });

  // --- Step 2: Define the NEW data we want to put in the video ---
  // This simulates what Pipedream will do.
  const inputProps = {
    topic: "A New Video!",
    quote: "This text was sent from a script, not the default props.",
    imageUrl: "https://images.pexels.com/photos/355747/pexels-photo-355747.jpeg", // A different background image
  };

  // --- Step 3: Get the video metadata ---
  const comps = await getCompositions(bundleLocation, {
    inputProps,
  });

  const video = comps.find((c) => c.id === compositionId);
  if (!video) {
    throw new Error(`Composition ${compositionId} not found`);
  }

  // --- Step 4: Render the video! ---
  console.log("Rendering the video... This may take a minute.");
  await renderMedia({
    composition: video,
    serveUrl: bundleLocation,
    codec: "h264",
    outputLocation: "out/programmatic-video.mp4",
    inputProps,
  });

  console.log("--- RENDER COMPLETE ---");
  console.log("The new video is located in the 'out' folder in your project.");
};

main();