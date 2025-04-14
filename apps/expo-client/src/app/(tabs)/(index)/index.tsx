import { ManualFetch } from '@/components/Settings'
import { StyleSheet, View } from 'react-native'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ManualFetch />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    paddingTop: 150,
  },
})
