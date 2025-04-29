import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Audio } from "expo-av";
import { MaterialIcons } from '@expo/vector-icons';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';

const COLORS = {
  accent: "#0057FF",
  correct: "#52E580",
  wrong: "#FF5757",
  card: "rgba(255,255,255,0.95)",
  bg: "#F1F4FF"
};

const successSound = require("../../assets/audio/success.mp3");
const failSound = require("../../assets/audio/fail.mp3");

const QuizResults = ({ score, total, answers, questions, onRestart, onReview }) => {
  const [displayedScore, setDisplayedScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    let current = 0;
    const increment = Math.max(1, Math.round((score) / 40)) || 1;
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayedScore(score);
        clearInterval(timer);

        if (score / total >= 0.7) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
      } else {
        setDisplayedScore(current);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [score, total]);

  useEffect(() => {
    let isMounted = true;
    async function playFeedbackSound() {
      try {
        const sfx = score / total >= 0.7 ? successSound : failSound;
        const { sound } = await Audio.Sound.createAsync(sfx);
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate(status => {
          if (status.didJustFinish && isMounted) sound.unloadAsync();
        });
      } catch {}
    }
    playFeedbackSound();
    return () => { isMounted = false };
  }, [score, total]);

  const iconType = score / total > 0.75 ? "emoji-events"
        : score / total > 0.5 ? "emoji-emotions"
        : "sentiment-neutral";
  const iconColor = score / total > 0.75 ? COLORS.correct
        : score / total > 0.5 ? COLORS.accent
        : COLORS.wrong;

  return (
    <View style={{
      flex: 1,
      backgroundColor: COLORS.bg,
      padding: 0,
    }}>
      {}
      {showConfetti && (
        <ConfettiCannon
          count={120}
          origin={{x: 200, y: -40}}
          fadeOut
          explosionSpeed={350}
          fallSpeed={2700}
        />
      )}

      <ScrollView contentContainerStyle={{
        alignItems: "center",
        justifyContent: "flex-start",
        paddingVertical: 24
      }}>
        <View style={{
          backgroundColor: COLORS.card,
          borderRadius: 24,
          padding: 28,
          width: "92%",
          maxWidth: 430,
          alignItems: "center",
          shadowColor: "#CBD1E6",
          shadowOpacity: 0.18,
          shadowOffset: { width: 0, height: 12 },
          shadowRadius: 16,
          marginBottom: 24
        }}>
          <MaterialIcons
            name={iconType}
            size={60}
            color={iconColor}
          />
          <Text style={{
            fontSize: 35,
            fontWeight: "bold",
            color: iconColor,
            marginTop: 12,
          }}>
            Score&nbsp;
            {displayedScore} / {total}
          </Text>
          <ProgressBar value={displayedScore} total={total} />
          <Text style={{
            fontSize: 18,
            color: "#5D6A88",
            marginTop: 14,
            marginBottom: 18,
            textAlign: "center",
          }}>
            {score / total >= 0.7
              ? "Bravo !"
              : score / total >= 0.5
              ? "Pas mal !"
              : "Essaie encore ! 🚀"}
          </Text>
          <TouchableOpacity
  onPress={async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onRestart();
  }}
            style={{
              marginTop: 6,
              paddingVertical: 12,
              paddingHorizontal: 32,
              backgroundColor: "#0057FF",
              borderRadius: 18,
              shadowOpacity: 0.16,
              shadowRadius: 2,
              marginBottom: 6,
            }}>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>Rejouer</Text>
          </TouchableOpacity>
        </View>
        {}
        <View style={{
          width: "95%",
          maxWidth: 460,
        }}>
          <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12, marginLeft: 4 }}>
            ✅ Récapitulatif de tes réponses
          </Text>
          {questions.map((q, i) => {
            const user = answers[i];
            const isGood = user?.picked === q.title;
            return (
              <View key={i} style={{
                backgroundColor: "#fff",
                borderRadius: 15,
                marginBottom: 12,
                padding: 15,
                shadowColor: "#DADADA",
                shadowOpacity: 0.045,
                shadowOffset: { width: 0, height: 3 },
                shadowRadius: 6,
                borderWidth: 1,
                borderColor: isGood ? "#B8F5CF" : "#FFCBD2"
              }}>
                <Text style={{ fontWeight: "bold" }}>{`Q${i + 1}: ${q.title}`}</Text>
                <Text>
                  Ta réponse : <Text style={{ color: isGood ? COLORS.correct : COLORS.wrong, fontWeight: "bold" }}>{user?.picked}</Text>
                </Text>
                <Text>
                  Points gagnés : <Text style={{ fontWeight: 'bold' }}>{user?.points}</Text> ({user?.time?.toFixed(1)}s)
                </Text>
                {!isGood && (
                  <Text>
                    Bonne réponse : <Text style={{ color: COLORS.correct }}>{q.title}</Text>
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

const ProgressBar = ({ value, total }) => (
  <View style={{
    height: 18,
    backgroundColor: "#E8EAFC",
    borderRadius: 9,
    overflow: "hidden",
    width: "88%",
    alignSelf: "center",
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#DAE3F5",
  }}>
    <View style={{
      height: "100%",
      width: `${Math.round((value / total) * 100)}%`,
      backgroundColor: value / total >= 0.7
        ? "#52E580"
        : value / total >= 0.5
        ? "#FEC400"
        : "#FF5757",
      borderRadius: 9,
      justifyContent: "center",
      alignItems: "flex-end",
    }}>
      <Text style={{
        color: "#fff",
        fontWeight: "bold",
        fontSize: 13,
        paddingRight: 10,
      }}>
        {Math.round((value / total) * 100)}%
      </Text>
    </View>
  </View>
);

export default QuizResults;
