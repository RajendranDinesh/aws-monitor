import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type KeyValueTextProps = {
  keyName: string;
  value: string | undefined;
  customKeyStyle?: object;
  customValueStyle?: object;
};

const KeyValueText: React.FC<KeyValueTextProps> = ({ keyName, value, customKeyStyle, customValueStyle }) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.keyText, customKeyStyle]}>{keyName}:</Text>
      <Text style={[styles.valueText, customValueStyle]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  keyText: {
    fontWeight: 'bold',
    marginRight: 5,
    color: '#333',
  },
  valueText: {
    fontSize: 16,
    color: '#666',
  },
});

export default KeyValueText;
