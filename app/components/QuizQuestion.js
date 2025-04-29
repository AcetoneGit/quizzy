import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from 'expo-av';

export default function QuizQuestion({
  song,
  onAnswer,
  duration = 10
}) {
  const [selected, setSelected] = useState(null);
  const [canAnswer, setCanAnswer] = useState(true);
  const [timeLeft, setTimeLeft] = useState(duration);

  const intervalRef = useRef();
  const timeoutRef = useRef();
  const soundRef = useRef();

  useEffect(() => {
    setSelected(null);
    setCanAnswer(true);
    setTimeLeft(duration);

    (async () => {
      if (song.audio) {
        const { sound } = await Audio.Sound.createAsync(song.audio);
        soundRef.current = sound;
        await sound.playAsync();
      }
    })();

    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    timeoutRef.current = setTimeout(() => {
      stopAll();
      onAnswer && onAnswer(null);
    }, duration * 1000);

    return () => {
      stopAll();
    };
  }, [song]);

  const stopAll = () => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);
    setCanAnswer(false);
    if (soundRef.current) {
      soundRef.current.stopAsync();
      soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  const handleChoice = (choice) => {
    if (!canAnswer) return;
    setSelected(choice);
    setCanAnswer(false);
    stopAll();
    if(onAnswer) onAnswer(choice);
  };

  const getButtonColor = (choice) => {
    if (!canAnswer) {
      if (choice === song.title) return 'limegreen';
      if (selected === choice && choice !== song.title) return 'crimson';
      return '#eee';
    }
    return '#eee';
  };

  const formatTime = (t) => t + "s";

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>⏳ {formatTime(timeLeft)}</Text>
      <Text style={styles.question}>Choisis le titre :</Text>
      {song.choices.map((choice, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.button,
            { backgroundColor: getButtonColor(choice) }
          ]}
          onPress={() => handleChoice(choice)}
          disabled={!canAnswer}
        >
          <Text
            style={[
              styles.buttonText,
              !canAnswer && choice === song.title ? { color: "white", fontWeight: "bold" } : {},
              !canAnswer && selected === choice && choice !== song.title ? { color: "white" } : {}
            ]}
          >
            {choice}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  timer: { fontSize: 30, marginVertical: 10 },
  question: { fontSize: 22, marginVertical: 14, textAlign: "center" },
  button: {
    minWidth: 180,
    borderRadius: 18,
    marginVertical: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: .8,
    borderColor: "#bbb"
  },
  buttonText: {
    fontSize: 20,
    textAlign: "center"
  }
});
