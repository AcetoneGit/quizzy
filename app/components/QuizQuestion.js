import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Audio } from 'expo-av';

const QuizQuestion = ({ song, duration, onAnswer, disabled }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sound, setSound] = useState();

  useEffect(() => {
    if (timeLeft > 0 && !disabled && selected === null) {
      const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft, disabled, selected]);

  useEffect(() => {
    setTimeLeft(duration);
    setSelected(null);
    setShowFeedback(false);
  }, [song]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (sound) {
        await sound.unloadAsync();
      }
      if (song.audio) {
        const { sound: newSound } = await Audio.Sound.createAsync(song.audio);
        setSound(newSound);
        if (isMounted) {
          await newSound.playAsync();
        }
      }
    })();
    return () => {
      isMounted = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [song]);

  const handleChoice = async (choice) => {
    if (!disabled && selected === null && timeLeft >= 0) {
      setSelected(choice);
      const elapsed = duration - timeLeft;
      setShowFeedback(true);
      onAnswer(choice, elapsed);
      if (sound) {
        await sound.stopAsync();
      }
    }
  };

  const getButtonStyle = (choice) => {
    if (!selected) return {};
    if (choice === selected) {
      return {
        backgroundColor:
          selected === song.title ? "#7CFC00" : "#FF7F7F",
        borderWidth: 2,
        borderColor:
          selected === song.title ? "green" : "red",
      };
    }
    if (selected !== song.title && choice === song.title) {
      return {
        backgroundColor: "#7CFC00",
        borderWidth: 2,
        borderColor: "green",
      };
    }
    return {};
  };

  return (
    <View style={{ margin: 24 }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>
        Quel est ce son ?
      </Text>
      <View style={{ flexDirection: "row", marginBottom: 8, justifyContent: "center" }}>
        <Text style={{ fontSize: 28, fontWeight: "bold", color: "#007AFF" }}>
          {timeLeft}s
        </Text>
      </View>
      {song.choices.map((choice) => (
        <TouchableOpacity
          key={choice}
          onPress={async () => await handleChoice(choice)}
          disabled={disabled || selected !== null}
          style={{
            backgroundColor: '#eee',
            alignItems: 'center',
            padding: 10,
            borderRadius: 5,
            marginVertical: 6,
            opacity: disabled ? 0.5 : 1,
            ...getButtonStyle(choice),
          }}
        >
          <Text style={{ fontSize: 18 }}>{choice}</Text>
        </TouchableOpacity>
      ))}
      {showFeedback && selected && (
        <Text style={{
          fontSize: 20,
          marginTop: 16,
          color: selected === song.title ? "green" : "red",
          textAlign: "center"
        }}>
          {selected === song.title ? "Bonne réponse !" : `Mauvaise réponse 😣`}
        </Text>
      )}
      {showFeedback && selected !== song.title && (
        <Text style={{ textAlign: 'center', fontSize: 16 }}>
          La bonne réponse était : <Text style={{ color: 'green' }}>{song.title}</Text>
        </Text>
      )}
    </View>
  );
};

export default QuizQuestion;
