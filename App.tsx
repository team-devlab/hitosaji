import { useState } from "react";
import AlbumScreen from "./screens/AlbumScreen";
import HelloWorldScreen from "./screens/HelloWorldScreen";
import WelcomeScreen from "./screens/WelcomeScreen";

type Screen = "welcome" | "hello" | "album";

export default function App() {
  const [screen, setScreen] = useState<Screen>("welcome");

  if (screen === "album") {
    return <AlbumScreen onNavigateHello={() => setScreen("hello")} />;
  }
  if (screen === "hello") {
    return (
      <HelloWorldScreen
        onNavigateHome={() => setScreen("welcome")}
        onNavigateAlbum={() => setScreen("album")}
      />
    );
  }
  return <WelcomeScreen onNavigateHello={() => setScreen("hello")} />;
}
