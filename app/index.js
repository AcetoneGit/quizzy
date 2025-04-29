import React, { useState } from "react";
import { View, SafeAreaView, Button, Text, ScrollView } from "react-native";
import QuizQuestion from "./components/QuizQuestion";

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
  }
];

export default function App() {
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showReview, setShowReview] = useState(false);

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
  };

  if (questionIdx === SONGS.length) {
    if (showReview) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView>
            <Text style={{ fontSize: 24, textAlign: "center", margin: 16 }}>Review de tes réponses</Text>
            {SONGS.map((q, i) => (
              <View key={i} style={{ margin: 8, padding: 8, borderWidth: 1, borderColor: "#ccc" }}>
                <Text style={{ fontWeight: "bold" }}>{`Q${i + 1}: ${q.title}`}</Text>
                <Text>Ta réponse : <Text style={{ color: userAnswers[i].choice === q.title ? "green" : "red" }}>{userAnswers[i].choice}</Text></Text>
                <Text>Points gagnés : <Text style={{ fontWeight: 'bold' }}>{userAnswers[i].points}</Text> ({userAnswers[i].elapsed.toFixed(1)}s)</Text>
                {userAnswers[i].choice !== q.title && (
                  <Text>Bonne réponse : <Text style={{ color: "green" }}>{q.title}</Text></Text>
                )}
              </View>
            ))}
            <View style={{ margin: 16 }}>
              <Button title="Rejouer" onPress={handleRestart} />
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 32, fontWeight: "bold", margin: 24 }}>Quiz terminé !</Text>
        <Text style={{ fontSize: 24, margin: 8 }}>
          Score {" "}
          <Text style={{ color: "green" }}>
            {score} / 100
          </Text>
        </Text>
        <Button title="Voir mes réponses" onPress={() => setShowReview(true)} />
        <Button title="Rejouer" onPress={handleRestart} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
            onPress={
              questionIdx + 1 < SONGS.length
                ? handleNext
                : () => setQuestionIdx(questionIdx + 1)
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
}
