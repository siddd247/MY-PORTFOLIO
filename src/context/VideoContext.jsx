import { createContext, useContext, useState } from "react";
const VideoContext = createContext();
export function VideoProvider({ children }) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  return (
    <VideoContext.Provider value={{ videoPlaying, setVideoPlaying }}>
      {children}
    </VideoContext.Provider>
  );
}
export const useVideo = () => useContext(VideoContext);
