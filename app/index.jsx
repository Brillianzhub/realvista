import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const index = () => {

  const handleNavigation = () => {
    router.replace('/home')
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={handleNavigation}>
        <Text>Press to Continue</Text>
      </Pressable>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})