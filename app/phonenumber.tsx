import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const FidgetSpinnerLoader = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1200,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.spinner, animatedStyle]}>
        {/* Center bearing */}
        <View style={styles.centerBearing}>
          <View style={styles.bearingInner} />
        </View>
        
        {/* Three spinner arms */}
        <View style={[styles.arm, styles.arm1]} />
        <View style={[styles.arm, styles.arm2]} />
        <View style={[styles.arm, styles.arm3]} />
        
        {/* Three weights */}
        <View style={[styles.weight, styles.weight1]} />
        <View style={[styles.weight, styles.weight2]} />
        <View style={[styles.weight, styles.weight3]} />
      </Animated.View>
    </View>
  );
};

export default FidgetSpinnerLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 200,
    height: 200,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBearing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    borderWidth: 8,
    borderColor: '#95a5a6',
    position: 'absolute',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bearingInner: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    backgroundColor: '#e74c3c',
  },
  arm: {
    position: 'absolute',
    width: 80,
    height: 20,
    backgroundColor: '#7f8c8d',
    borderRadius: 10,
  },
  arm1: {
    transform: [{ rotate: '0deg' }, { translateY: -40 }],
  },
  arm2: {
    transform: [{ rotate: '120deg' }, { translateY: -40 }],
  },
  arm3: {
    transform: [{ rotate: '240deg' }, { translateY: -40 }],
  },
  weight: {
    position: 'absolute',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    borderWidth: 3,
    borderColor: '#2c3e50',
    backgroundColor: '#34495e',
  },
  weight1: {
    transform: [{ translateY: -90 }],
  },
  weight2: {
    transform: [{ rotate: '120deg' }, { translateY: -90 }],
  },
  weight3: {
    transform: [{ rotate: '240deg' }, { translateY: -90 }],
  },
});