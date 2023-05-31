import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import RNKeys from 'react-native-keys';

export default function App() {
  const [jniValue, setJniValue] = useState('');
  const [publicValue, setPublicValue] = useState('');
  useEffect(() => {
    const value1 = RNKeys.secureFor('secure3');
    console.log(value1, 'value1');
    setJniValue(value1);
    const value2 = RNKeys.APP_NAME;
    setPublicValue(value2);
  }, []);
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
