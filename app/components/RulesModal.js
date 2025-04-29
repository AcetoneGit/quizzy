import React from "react";
import { View, Text, Modal } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function RulesModal({ visible, onClose }) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{
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
            1. Écoute l'extrait proposé{"\n"}
            2. Sélectionne ta réponse{"\n"}
            3. Tu as 10 secondes par question{"\n"}
            4. Obtiens un maximum de points !{"\n"}
            (Le score dépend de la rapidité){'\n'}
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: "#0057FF",
              borderRadius: 8,
              paddingVertical: 10, paddingHorizontal: 28,
              marginTop: 8
            }}>
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
