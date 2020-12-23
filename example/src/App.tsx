import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import JniKeys from 'react-native-jni-keys';

export default function App() {
  React.useEffect(() => {
    (async ()=>{
      console.log(await JniKeys.getKey('iqbal'), 'JniKeys');
    })()
  }, []);
  return (
    <View style={styles.container}>
      <Text>Result: </Text>
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
