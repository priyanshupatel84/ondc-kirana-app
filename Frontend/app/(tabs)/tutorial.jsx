import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { WebView } from "react-native-webview";

const Tutorial = () => {
  const playlistId = "PLBzH1VLM11orrg4eIF0k6ACgYLo6POQq4"; // Your YouTube Playlist ID
  const playlistUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}`;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutorials</Text>

      {/* First WebView */}
      <WebView
        style={styles.video}
        source={{ uri: playlistUrl }} // Embed the YouTube playlist URL
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true} // Enable inline playback
        mediaPlaybackRequiresUserAction={false} // Allow auto-play
      />

      {/* Second WebView */}
      <WebView
        style={styles.video}
        source={{ uri: playlistUrl }} // Embed the YouTube playlist URL
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true} // Enable inline playback
        mediaPlaybackRequiresUserAction={false} // Allow auto-play
      />

      {/* Third WebView */}
      <WebView
        style={styles.video}
        source={{ uri: playlistUrl }} // Embed the YouTube playlist URL
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowsInlineMediaPlayback={true} // Enable inline playback
        mediaPlaybackRequiresUserAction={false} // Allow auto-play
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10, // Optional: Add padding for better layout
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  video: {
    width: "100%",
    height: 300, // Adjust height as needed
    marginBottom: 20, // Add margin between videos for spacing
  },
});

export default Tutorial;
