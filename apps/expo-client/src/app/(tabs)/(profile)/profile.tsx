import { Logs } from '@/components/Settings'
import { UserData } from '@/components/User'
import { View } from 'react-native'

export default function ProfileScreen() {
  return (
    <View
      style={{
        alignItems: 'flex-start',
        gap: 4,
        paddingHorizontal: 8,
      }}
    >
      <UserData />
      <Logs />
    </View>
  )
}
