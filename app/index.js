import React from 'react';
import { View, StatusBar } from 'react-native';
import { SONGS } from './data/songs';
import QuizQuestion from './components/QuizQuestion';

export default function App() {
  const handleAnswer = (answer) => {
    console.log('Réponse donnée :', answer);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
      <StatusBar barStyle="dark-content" />
      <QuizQuestion song={SONGS[0]} onAnswer={handleAnswer} />
    </View>
  );
}
