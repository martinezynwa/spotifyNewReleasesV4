import { Colors } from '@/ui/colors'
import { Stack } from 'expo-router'

interface Props {
  name: string
  headerTitle: string
}

export const HeaderLayout = ({ headerTitle, name }: Props) => {
  return (
    <Stack>
      <Stack.Screen
        name={name}
        options={{
          headerTitle,
          headerTransparent: true,
          headerBlurEffect: 'dark',
          headerLargeTitle: true,
          headerLargeTitleStyle: {
            color: Colors.text,
          },
          headerTitleStyle: {
            fontSize: 20,
            color: Colors.text,
          },
        }}
      />
    </Stack>
  )
}
