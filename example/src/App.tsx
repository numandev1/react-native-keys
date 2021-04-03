import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Keys from 'react-native-keys';

export default function App() {
  const [jniValue, setJniValue] = useState('');
  const [publicValue, setPublicValue] = useState('');
  useEffect(() => {
    (async () => {
      const value1 = await Keys.secureFor('secure2');
      setJniValue(value1);
      const value2 = Keys.APP_ID;
      setPublicValue(value2);
    })();
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
