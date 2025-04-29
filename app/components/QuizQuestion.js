import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Audio } from 'expo-av';

const COLORS = {
  bg: "#F1F4FF",
  card: "rgba(255,255,255,0.7)",
  accent: "#0057FF",
  correct: "#52E580",
  wrong: "#FF5757",
  neutral: "#FFFFFF",
  shadow: "#D7DBEE"
};

const QuizQuestion = ({ song, duration, onAnswer, disabled }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [sound, setSound] = useState();
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [song, fadeAnim]);

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
          selected === song.title ? COLORS.correct : COLORS.wrong,
        borderColor:
          selected === song.title ? "#189142" : "#A62222",
        borderWidth: 2,
        shadowColor: selected === song.title ? COLORS.correct : COLORS.wrong,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      };
    }
    if (selected !== song.title && choice === song.title) {
      return {
        backgroundColor: COLORS.correct,
        borderColor: "#189142",
        borderWidth: 2,
        shadowColor: COLORS.correct,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      };
    }
    return {};
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: COLORS.bg,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingTop: 10,
    }}>
    <Animated.View style={{
      opacity: fadeAnim,
      width: "100%",
      backgroundColor: COLORS.card,
      borderRadius: 22,
      padding: 24,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
      elevation: 6,
      marginVertical: 16,
    }}>
      <Text style={{
        fontSize: 24,
        marginBottom: 20,
        fontWeight: "600",
        color: COLORS.accent,
        textAlign: "center",
        letterSpacing: 0.5,
      }}>
        Quel est ce morceau ?
      </Text>
      {/* Timer */}
      <View style={{
        alignSelf: "center",
        backgroundColor: "#F5EAFE",
        borderRadius: 50,
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginBottom: 22,
        minWidth: 88,
        shadowColor: "#AAA",
        shadowOpacity: 0.1,
        shadowRadius: 6
      }}>
        <Text style={{
          fontSize: 28,
          fontWeight: "bold",
          color: COLORS.accent,
          letterSpacing: 1,
          textAlign: "center"
        }}>
          {timeLeft}s
        </Text>
      </View>
      {song.choices.map((choice) => (
        <TouchableOpacity
          key={choice}
          onPress={async () => await handleChoice(choice)}
          disabled={disabled || selected !== null}
          activeOpacity={0.82}
          style={{
            backgroundColor: COLORS.neutral,
            alignItems: 'center',
            paddingVertical: 17,
            paddingHorizontal: 12,
            borderRadius: 16,
            marginVertical: 8,
            marginHorizontal: 3,
            shadowColor: "#B7BED6",
            shadowOffset: { width: 1, height: 3 },
            shadowOpacity: 0.13,
            shadowRadius: 7,
            elevation: 2,
            borderWidth: 1.5,
            borderColor: "#D7DBEE",
            opacity: !!selected && (selected !== choice && (choice !== song.title)) ? 0.46 : 1,
            ...getButtonStyle(choice),
            transitionDuration: "300ms",
          }}
        >
          <Text style={{
            fontSize: 20,
            fontWeight: "500",
            color: !!selected
              ? (choice === song.title ? "#176331" : (choice === selected ? "#A61F23" : "#8391A8"))
              : "#232C4E",
            letterSpacing: 0.2,
          }}>{choice}</Text>
        </TouchableOpacity>
      ))}
      {}
      <View style={{ minHeight: 40, marginTop: 8 }}>
      {showFeedback && selected && (
        <Text style={{
          fontSize: 22,
          marginTop: 12,
          color: selected === song.title ? "#10B981" : COLORS.wrong,
          textAlign: "center",
          fontWeight: "bold"
        }}>
          {selected === song.title ? "👍 Bonne réponse !" : "❌ Mauvaise réponse"}
        </Text>
      )}
      {showFeedback && selected !== song.title && (
        <Text style={{
          textAlign: "center",
          fontSize: 16,
          marginTop: 4,
          color: "#222657",
          fontStyle: "italic"
        }}>
          La bonne réponse était : <Text style={{ color: COLORS.correct, fontWeight: "bold" }}>{song.title}</Text>
        </Text>
      )}
      </View>
    </Animated.View>
    </View>
  );
};

export default QuizQuestion;
