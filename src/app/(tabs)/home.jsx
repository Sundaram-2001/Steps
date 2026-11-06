import { useState } from 'react';
import { Text, View } from 'react-native';

export default function Home() {
  const [steps,setSteps]=useState(0)
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{steps}</Text>
    </View>
  );
}