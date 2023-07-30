import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import MapView, {Marker} from 'react-native-maps';
import { StyleSheet, Text, View, Button, Pressable, Switch, Image } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, startAfter, set } from 'firebase/database';

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
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const handleSwitchToggle = () => {
    setIsSwitchOn((prevState) => !prevState);
    updateFirebaseValue(!isSwitchOn);
  };

  const updateFirebaseValue = (value) => {
    // Assuming you have a reference to your Firebase database
    const firebaseRef = ref(getDatabase(), '/door_status');
    // Set the new value in the database
    set(firebaseRef, value ? 1 : 0)
  };

  const [initialRegion, setInitialRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: 0,
    longitude: 0,
  });
  
  const [starCount, setStarCount] = useState(null);
  const [humi, setHumi] = useState(null);
  const [temp, setTemp] = useState(null);
  const [long, setLong] = useState(null);
  const [lat, setLat] = useState(null);
  const [door, setDoor] = useState(null);

  useEffect(() => {
    const updateStarCount = (count) => {
      setStarCount(count);
    };

    const updateHumi = (value) => {
      setHumi(value);
    };

    const updateTemp = (value) => {
      setTemp(value);
    };

    const updateDoor = (value) => {
      setDoor(value);
    };

    const starCountRef = ref(getDatabase(), '/hello');
    const humiRef = ref(getDatabase(), '/humidity');
    const tempRef = ref(getDatabase(), '/temperature');
    const doorRef = ref(getDatabase(), '/door_status');

    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();
      updateStarCount(data);
    });

    onValue(humiRef, (snapshot) => {
      const data = snapshot.val();
      updateHumi(data);
    });

    onValue(tempRef, (snapshot) => {
      const data = snapshot.val();
      updateTemp(data);
    });

    onValue(doorRef, (snapshot) => {
      const data = snapshot.val();
      updateDoor(data);
    });

    const firebaseRef = ref(getDatabase(), '/location');
    const unsubscribe = onValue(firebaseRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMarkerCoordinate({
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
    });
    // Clean up the Firebase listeners when the component unmounts
    return () => {
      // Turn off the listeners to avoid memory leaks
      onValue(starCountRef, null);
      onValue(humiRef, null);
      onValue(tempRef, null);
      onValue(doorRef, null);
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
      <Text style={styles.title}>CONTAG</Text>    
      </View>
        {markerCoordinate.latitude !== 0 && markerCoordinate.longitude !== 0 && (
        <MapView
          style={styles.map}
          region={{
            latitude: markerCoordinate.latitude,
            longitude: markerCoordinate.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          <Marker coordinate={markerCoordinate} pinColor="red" />
        </MapView>
      )}
        <View style={styles.column}>
          <View style={styles.row}>
            <View style={styles.column}>
            <Text style={styles.para}>TEMPERATURE</Text>
            <Text style={styles.val}>{temp}</Text>
            </View>
            <View style={{width:'15%'}}></View>
            <View style={styles.column}>
            <Text style={styles.para}>HUMIDITY</Text>
            <Text style={styles.val}>{humi}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View>
              <Pressable   style={({pressed}) => [
          {
            backgroundColor: pressed ? 'rgb(210, 230, 255)' : '#99CCFF',
          },
          styles.wrapperCustom,
        ]}>
                <Text style={{fontSize:35}}>CCTV</Text>
              </Pressable>
            </View>
            <Switch style={styles.switch}
        trackColor={{false: '#767577', true: '#81b0ff'}}
        thumbColor={isSwitchOn ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={handleSwitchToggle}
        value={isSwitchOn}
      />
            </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:'5%',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    width:'100%',
    height:'100%',
  },
  map: {
    width: '100%',
    height: '50%',
  },
  row:{
    display:'flex',
    flexDirection:'row',
  },
  column:{
    display:'flex',
    flexDirection:'column',
    marginVertical:'10%',
  },
  title:{
    fontSize:25,
    padding:5,
  },
  wrapperCustom: {
    borderRadius: 6,
    padding: 6,
  },
  switch:{
    marginLeft:'30%',
  },
  para:{
    fontSize:20
  },
  val:{
    fontSize:15
  }
});