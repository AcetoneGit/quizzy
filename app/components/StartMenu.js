import React from "react";
import { View, Text, Modal } from "react-native";
import * as Haptics from "expo-haptics";
import { TouchableWithoutFeedback, Animated } from "react-native";

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
export default function StartMenu({ visible, onStart, onShowRules }) {
  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={{
        flex: 1, backgroundColor: "rgba(28,38,70,0.97)",
        justifyContent: "center", alignItems: "center"
      }}>
        <Text style={{
          color: "#fff", fontSize: 32, marginBottom: 44, fontWeight: "bold"
        }}>🎶 QUIZ MUSICAL</Text>
        <AnimatedButton
          onPress={async () => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); onStart(); }}
          style={{
            backgroundColor: "#0057FF", borderRadius: 18, paddingVertical: 18, paddingHorizontal: 65,
            marginVertical: 10, elevation: 5, shadowColor: "#0057FF", shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 5 }
          }}>
          <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold", letterSpacing: 1.4 }}>Lancer le Quiz</Text>
        </AnimatedButton>
        <AnimatedButton
          onPress={async () => { await Haptics.selectionAsync(); onShowRules(); }}
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
