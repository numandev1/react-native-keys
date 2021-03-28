import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import JniKeys from 'react-native-keys';

export default function App() {
  const [result, setResult] = useState('');
  useEffect(() => {
    (async () => {
      const value = await JniKeys.getKey('younas');
      setResult(value);
      console.log(value, 'test');
    })();
  }, []);
  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
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
