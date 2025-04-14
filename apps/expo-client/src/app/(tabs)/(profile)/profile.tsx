import { UserData } from '@/components/User'
import { View } from 'react-native'

export default function ProfileScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <UserData />
    </View>
  )
}
