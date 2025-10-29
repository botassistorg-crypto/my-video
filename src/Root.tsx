// src/Root.tsx

import { Composition } from "remotion";
// The MyComposition component name is correct, we just change the ID below.
import { MyComposition, mySchema } from "./Composition"; 

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        // THIS IS THE FIX: The ID must match what the studio is expecting.
        id="MyComp" 
        component={MyComposition}
        durationInFrames={150} // 5 seconds at 30fps
        fps={30}
        width={1080}
        height={1920} // Changed to vertical for our Shorts/Reels
        schema={mySchema}
        defaultProps={{
          topic: "The Stoic Investor's Handbook",
          quote: "The whole future lies in uncertainty: live immediately.",
          imageUrl: "https://images.pexels.com/photos/1631677/pexels-photo-1631677.jpeg",
        }}
      />
    </>
  );
};