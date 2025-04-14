import { useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { useManualFetch } from '../../api/releases/release.mutations'

export const ManualFetch = () => {
  const [dayLimit, setDayLimit] = useState(1)

  const { mutate: manualFetch, isPending } = useManualFetch(dayLimit)

  const handleDayChange = (increment: boolean) => {
    setDayLimit((prev) => {
      if (increment) {
        return Math.min(14, prev + 1)
      }
      return Math.max(1, prev - 1)
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.dayLimitContainer}>
        <TouchableOpacity
          onPress={() => handleDayChange(false)}
          style={styles.dayButton}
          disabled={dayLimit <= 1}
        >
          <Text
            style={[styles.dayButtonText, dayLimit <= 1 && styles.disabledText]}
          >
            -
          </Text>
        </TouchableOpacity>

        <Text style={styles.dayLimitText}>{dayLimit}</Text>

        <TouchableOpacity
          onPress={() => handleDayChange(true)}
          style={styles.dayButton}
          disabled={dayLimit >= 14}
        >
          <Text
            style={[
              styles.dayButtonText,
              dayLimit >= 14 && styles.disabledText,
            ]}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => manualFetch()}
        style={[styles.fetchButton, isPending && styles.fetchButtonDisabled]}
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color='#ffffff' />
        ) : (
          <Text style={styles.fetchButtonText}>Manual Fetch</Text>
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 20,
  },
  dayLimitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 8,
    width: '100%',
    maxWidth: 200,
    alignSelf: 'center',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dayButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  disabledText: {
    color: '#999',
  },
  dayLimitText: {
    fontSize: 24,
    fontWeight: '600',
    marginHorizontal: 20,
    minWidth: 30,
    textAlign: 'center',
  },
  fetchButton: {
    backgroundColor: '#1DB954',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  fetchButtonDisabled: {
    opacity: 0.7,
  },
  fetchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
})
