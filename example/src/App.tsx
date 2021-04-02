import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Keys from 'react-native-keys';

export default function App() {
  const [result, setResult] = useState('');
  useEffect(() => {
    (async () => {
      const value = await Keys.secureFor('secure2');
      setResult(value);
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
