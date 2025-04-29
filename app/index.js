import React, { useState } from "react";
import { View, SafeAreaView, Button } from "react-native";
import QuizQuestion from "./components/QuizQuestion";
import QuizResults from "./components/QuizResults";

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

  if (questionIdx === SONGS.length && showReview) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F1F4FF" }}>
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
