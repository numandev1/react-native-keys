import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RNKeys from 'react-native-keys';

export default function App() {
  const [jniValue] = useState(RNKeys.secureFor('secure3'));
  const [publicValue] = useState(RNKeys.APP_NAME);

  return (
    <View style={styles.container}>
      <Text>KEY FROM SECURE (JNI): {jniValue}</Text>
      <Text>KEY FROM PUBLIC: {publicValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
