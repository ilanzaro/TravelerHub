import { radixColors } from "@/_constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export interface MenuOption {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
}

interface MenuDropdownProps {
  visible: boolean;
  onClose: () => void;
  options: MenuOption[];
}

export default function MenuDropdown({
  visible,
  onClose,
  options,
}: MenuDropdownProps) {
  const colorScheme = useColorScheme();
  const theme = radixColors[colorScheme ?? "dark"];

  const handleOptionPress = (option: MenuOption) => {
    onClose();
    option.onPress();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={[
          styles.modalOverlay,
          { backgroundColor: theme.background["alpha-3"] },
        ]}
        activeOpacity={1}
        onPress={onClose}
      >
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.background[4],
              borderColor: theme.border[2],
              shadowColor: theme.text[3],
            },
          ]}
        >
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.dropdownItem}
              onPress={() => handleOptionPress(option)}
            >
              <Ionicons
                name={option.icon as any}
                size={16}
                color={theme.solid[1]}
              />
              <Text style={[styles.dropdownText, { color: theme.text[1] }]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 60,
    paddingLeft: 12,
  },
  dropdown: {
    width: 150,
    borderRadius: 8,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  dropdownText: {
    fontSize: 16,
  },
});
