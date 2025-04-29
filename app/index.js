import React, { useState } from "react";
import {
  View, SafeAreaView, Button, Text, Modal,
  TouchableWithoutFeedback, Animated, TouchableOpacity
} from "react-native";
import QuizQuestion from "./components/QuizQuestion";
import QuizResults from "./components/QuizResults";
import StepBar from "./components/StepBar";
import * as Haptics from "expo-haptics";

const SONGS = [
  {
    title: "Peugeot",
    choices: ["Renault", "Peugeot", "Lamborghini", "Ford"],
    audio: require("../assets/audio/test.wav"),
  },
  {
    title: "Âne",
    choices: ["Âne", "Chenille", "Perpignan", "Groseille"],
    audio: require("../assets/audio/donkey.wav"),
  },
  {
    title: "Oiseau",
    choices: ["Oiseau", "Girafe", "Narval", "Lémurien"],
    audio: require("../assets/audio/bird.wav"),
  },
  {
    title: "Âne",
    choices: ["1", "2", "3", "Âne"],
    audio: require("../assets/audio/donkey.wav"),
  },
];

function AnimatedButton({ onPress, style, children }) {
  const anim = React.useRef(new Animated.Value(1)).current;
  return (
    <TouchableWithoutFeedback
      onPressIn={() => Animated.spring(anim, { toValue: 0.92, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(anim, { toValue: 1, useNativeDriver: true }).start()}
      onPress={onPress}
    >
      <Animated.View style={[{ transform: [{ scale: anim }] }, style]}>
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

function RulesScreen({ onBack }) {
  return (
    <SafeAreaView style={{
      flex: 1, backgroundColor: "rgba(241,244,255,0.96)",
      justifyContent: "center", alignItems: "center", padding: 25
    }}>
      <View style={{
        backgroundColor: "#fff", borderRadius: 15, padding: 25, alignItems: "center", width: "94%"
      }}>
        <Text style={{ fontSize: 24, color: "#0057FF", fontWeight: "bold", marginBottom: 12 }}>
          Règles du jeu
        </Text>
        <Text style={{ fontSize: 16, color: "#232C4E", marginBottom: 17 }}>
          1. Écoute l'extrait musical proposé{"\n"}
          2. Sélectionne la bonne réponse{"\n"}
          3. Tu as 10 secondes par question{"\n"}
          4. Gagne un max de points selon ta rapidité !{"\n"}
        </Text>
        <AnimatedButton
          onPress={onBack}
          style={{
            backgroundColor: "#0057FF",
            borderRadius: 8,
            paddingVertical: 10, paddingHorizontal: 28,
            marginTop: 8
          }}>
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Retour</Text>
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
}

function StartMenu({ visible, onStart, onShowRules }) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={{
        flex: 1, backgroundColor: "rgba(28,38,70,0.97)",
        justifyContent: "center", alignItems: "center"
      }}>
        <Text style={{
          color: "#fff", fontSize: 32, marginBottom: 44, fontWeight: "bold"
        }}>🎶 QUIZZY</Text>
        <AnimatedButton
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            onStart();
          }}
          style={{
            backgroundColor: "#0057FF", borderRadius: 18, paddingVertical: 18, paddingHorizontal: 65,
            marginVertical: 10, elevation: 5, shadowColor: "#0057FF", shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 5 }
          }}>
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold", letterSpacing: 1.4 }}>Lancer le Quiz</Text>
        </AnimatedButton>
        <AnimatedButton
          onPress={async () => {
            await Haptics.selectionAsync();
            onShowRules();
          }}
          style={{
            backgroundColor: "#F1F4FF", borderRadius: 14, paddingVertical: 13, paddingHorizontal: 30,
            marginTop: 13, elevation: 2, shadowColor: "#0057FF", shadowOpacity: 0.11, shadowRadius: 5, shadowOffset: { width: 0, height: 3 }
          }}>
          <Text style={{ color: "#0057FF", fontSize: 15, fontWeight: "bold" }}>Règles du jeu</Text>
        </AnimatedButton>
      </View>
    </Modal>
  );
}

export default function App() {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [menuVisible, setMenuVisible] = useState(true);
  const [rulesScreen, setRulesScreen] = useState(false);

  const handleAnswer = (choice, elapsed) => {
    setAnswered(true);
    let addedScore = 0;
    if (choice === SONGS[questionIdx].title) {
      if (elapsed <= 3)      addedScore = 25;
      else if (elapsed <= 6) addedScore = 22;
      else if (elapsed <= 8) addedScore = 20;
      else                   addedScore = 15;
    }
    setUserAnswers([...userAnswers, { choice, points: addedScore, elapsed }]);
    setScore(prev => prev + addedScore);
  };

  const handleNext = () => {
    setAnswered(false);
    if (questionIdx + 1 < SONGS.length) {
      setQuestionIdx(curr => curr + 1);
    }
  };

  const handleRestart = () => {
    setQuestionIdx(0);
    setAnswered(false);
    setScore(0);
    setUserAnswers([]);
    setShowReview(false);
    setMenuVisible(true);
  };

  if (menuVisible) {
    if (rulesScreen) {
      return <RulesScreen onBack={() => setRulesScreen(false)} />;
    }
    return (
      <StartMenu
        visible={menuVisible}
        onStart={() => setMenuVisible(false)}
        onShowRules={() => setRulesScreen(true)}
      />
    );
  }

  if (questionIdx === SONGS.length && showReview) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F1F4FF" }}>
        <Button title="Retour menu" onPress={handleRestart} />
      </SafeAreaView>
    );
  }

  if (questionIdx === SONGS.length) {
    return (
      <QuizResults
        score={score}
        total={SONGS.length * 25}
        answers={userAnswers.map((ua, idx) => ({
          picked: ua.choice,
          points: ua.points,
          max: 25,
          time: ua.elapsed
        }))}
        questions={SONGS}
        onRestart={handleRestart}
        onReview={() => setShowReview(true)}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F1F4FF" }}>
      <StepBar current={questionIdx} total={SONGS.length} />
      <QuizQuestion
        key={questionIdx}
        song={SONGS[questionIdx]}
        duration={10}
        onAnswer={handleAnswer}
        disabled={answered}
      />
      {answered && (
        <View style={{ alignItems: "center" }}>
          <Button
            title={
              questionIdx + 1 < SONGS.length
                ? "Question suivante"
                : "Voir résultat"
            }
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              if (questionIdx + 1 < SONGS.length) {
                handleNext();
              } else {
                setQuestionIdx(questionIdx + 1);
              }
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
