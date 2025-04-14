import { useLogs } from '@/api/logs/log.queries'
import { Text, View } from 'react-native'

export const Logs = () => {
  const { data: logs } = useLogs()

  return (
    <View style={{ display: 'flex', gap: 8 }}>
      {logs?.map((item) => <Text key={item.id}>{item.message}</Text>)}
    </View>
  )
}
