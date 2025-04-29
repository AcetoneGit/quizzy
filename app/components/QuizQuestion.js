import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

const QuizQuestion = ({ song, onAnswer }) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [canAnswer, setCanAnswer] = useState(true);
  const [selected, setSelected] = useState(null);
  const soundRef = useRef(null);

  useEffect(() => {
    let interval;
    let timeout;

    const playSong = async () => {
      const { sound } = await Audio.Sound.createAsync(song.file);
      soundRef.current = sound;
      await sound.playAsync();
    };
    playSong();

    interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    timeout = setTimeout(() => {
      setCanAnswer(false);
      setTimeLeft(0);
      soundRef.current && soundRef.current.stopAsync();
      onAnswer(null);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      soundRef.current && soundRef.current.unloadAsync();
    };
  }, []);

  const handleAnswer = (choice) => {
    if (!canAnswer) return;
    setSelected(choice);
    setCanAnswer(false);
    onAnswer(choice);
    soundRef.current && soundRef.current.stopAsync();
  };

  const getButtonColor = (choice) => {
    if (!canAnswer) {
      if (choice === song.title) return 'limegreen';
      if (selected === choice && choice !== song.title) return 'crimson';
      return '#eee';
    }
    return '#eee';
  };

  return (
    <View>
      <Text style={{ fontSize: 24, marginBottom: 12 }}>
        Temps restant : {timeLeft}s
      </Text>
      {song.choices.map(choice => (
        <TouchableOpacity
          key={choice}
          onPress={() => handleAnswer(choice)}
          disabled={!canAnswer}
          style={{
            backgroundColor: getButtonColor(choice),
            margin: 8,
            padding: 12,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#bbb'
          }}>
          <Text style={{ color: '#333', fontSize: 18 }}>{choice}</Text>
        </TouchableOpacity>
      ))}
      {!canAnswer && (
        <Text style={{ marginTop: 16 }}>
          La bonne réponse était : <Text style={{ color: 'limegreen', fontWeight: 'bold' }}>{song.title}</Text>
        </Text>
      )}
    </View>
  );
};

export default QuizQuestion;
