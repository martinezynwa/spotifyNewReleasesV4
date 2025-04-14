import { useAuth } from '@/providers/AuthProvider'
import { Text, TouchableOpacity, View } from 'react-native'
import { useLoginLogout } from '../Auth/useLoginLogout'

export const UserData = () => {
  const { session } = useAuth()

  const { handleSignOut } = useLoginLogout()

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 10,
        paddingTop: 150,
      }}
    >
      <Text>{session?.user?.email}</Text>
      <TouchableOpacity
        style={{ backgroundColor: 'red', padding: 10, borderRadius: 5 }}
        onPress={() => handleSignOut()}
      >
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}
