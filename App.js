import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, Text, View } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyC1eKSV7e9L_nQMYEkPmD2qjcwNAALS1rU",
  authDomain: "smartcontainerapp.firebaseapp.com",
  projectId: "smartcontainerapp",
  storageBucket: "smartcontainerapp.appspot.com",
  messagingSenderId: "1086527239265",
  appId: "1:1086527239265:web:94cd36d5f08a3245cf6620",
  databaseURL: "https://smartcontainerapp-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();

export default function App() {
  const initialRegion = {
    latitude: 4.378394489589697, // Replace with the latitude of the location you want to zoom into
    longitude: 113.97738162630306, // Replace with the longitude of the location you want to zoom into
    latitudeDelta: 0.001, // The amount of latitude to be displayed on the map
    longitudeDelta: 0.001, // The amount of longitude to be displayed on the map
  };
  const markerCoordinate = {
    latitude: 37.78825, // Replace with the latitude of the marker location
    longitude: -122.4324, // Replace with the longitude of the marker location
  };
  const [starCount, setStarCount] = useState(null);

  useEffect(() => {
    const postId = 'hello'; // Replace 'your-post-id' with the actual post ID

    // Define the function to update the star count
    const updateStarCount = (count) => {
      setStarCount(count);
    };

    const starCountRef = ref(db, '/hello');
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      updateStarCount(data);
    });

    // Clean up the Firebase listener when the component unmounts
    return () => {
      // Turn off the listener to avoid memory leaks
      onValue(starCountRef, null);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.border}>
      <Text style={styles.title}>Your Mum's Box</Text>
      </View>
      <View style={styles.border}>
      <Text>Star Count: {starCount !== null ? starCount : 'Loading...'}</Text>
      </View>
      <MapView style={styles.map} initialRegion={initialRegion}>
      <Marker coordinate={markerCoordinate} pinColor="red" />
        </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  title:{
    fontSize:50,
    padding:25,
  },
  border:{
    borderWidth:5,
  }
});