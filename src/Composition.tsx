// src/Composition.tsx

import { AbsoluteFill, Img } from "remotion";
import { z } from "zod";

// This defines the "mailboxes" or props our video can receive.
export const mySchema = z.object({
  topic: z.string(),
  quote: z.string(),
  imageUrl: z.string(),
});

// Notice we are now accepting 'props' as an input.
export const MyComposition = ({ topic, quote, imageUrl }: z.infer<typeof mySchema>) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Img
        src={imageUrl}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.3,
        }}
      />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 80,
          color: 'white',
          textAlign: 'center',
          padding: '0 50px',
        }}>
          {topic}
        </h1>
        <p style={{
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: 40,
          color: '#cccccc',
          textAlign: 'center',
          maxWidth: '80%',
        }}>
          {quote}
        </p>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};