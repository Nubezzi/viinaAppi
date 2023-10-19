import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [grams, setGrams] = useState(0);
  const [gender, setGender] = useState(true);
  const [weight, setWeight] = useState(100);
  const [weightPlaceholder, setWeightPlaceholder] = useState("Paino (kg)");
  const [bac, setBac] = useState(null);
  const [highestBac, setHighestBac] = useState(0);
  const [highestBacStat, setHighestBacStat] = useState(0);
  const [showSettings, setShowSettings] = useState(true);
  const [settingsViewed, setSettingsViewed] = useState(false);
  const [firstDrinkTime, setFirstDrinkTime] = useState(null);
  const [lastDrinkTime, setLastDrinkTime] = useState(null);
  const [drinkCount, setDrinkCount] = useState(0);
  const [sendNotifications, setSendNotifications] = useState(true);

  useEffect(() => {
    const registerForPushNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Notification permissions are required for this feature.');
        return;
      }
    };
    registerForPushNotifications();
  }, []);

  const scheduleNotification = async (message) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hei ootko nyt juonu varmasti tarpeeks?',
        body: message,
      },
      trigger: null,
    });
    setHighestBac(bac)
    const timer = setTimeout(() => {
      setSendNotifications(true);
    }, 300000); // 300000 milliseconds = 5 minutes

    return () => clearTimeout(timer)
  };

  

  useEffect(() => {
    const interval = setInterval(() => {
      const burnedGrams = weight / 10 / 360;
      const remainingGrams = Math.max(0, grams - burnedGrams);
      setGrams(remainingGrams);
      calculateBAC(remainingGrams);
    }, 10000);
    return () => clearInterval(interval);
  }, [grams, weight]);

  const calculateBAC = (remainingGrams) => {
    const liquidVolumeFactor = gender ? 0.75 : 0.66;
    let bac = remainingGrams / (liquidVolumeFactor * weight);
    if(bac < 0.01){
      bac = null
    }else {
      setBac(bac.toFixed(2));
    }
    
    if (bac > highestBac){
      setHighestBac(bac.toFixed(2))
      setHighestBacStat(bac.toFixed(2))
    }
    if(sendNotifications){
      if(highestBac > 3 && bac < 3 ){
        scheduleNotification(`AJKSÖ FKFKAJND, pormillet laksenenu alle 3: ${bac.toFixed(2)}‰`)
        setSendNotifications(false)
      }
      if(highestBac > 2.5 && bac < 2.5 ){
        scheduleNotification(`JUO LISÄÄ TAI MUUTEN POLIISI VIE VANKILAAN. prollet alle 2: ${bac.toFixed(2)}‰`)
        setSendNotifications(false)
      }
      if(highestBac > 2.1 && bac < 2 ){
        scheduleNotification(`KALJAA KONEESEEN. Romilletaso on alle 2: ${bac.toFixed(2)}‰`)
        setSendNotifications(false)
      }
      if(highestBac > 1.6 && bac < 1.5 ){
        scheduleNotification(`Juoppas lisää. Romilletaso on laskenut alle 1.5: ${bac.toFixed(2)}‰`)
        setSendNotifications(false)
      }
      if(highestBac > 1.1 && bac < 1 ){
        scheduleNotification(`Luulin et olit juomamiehiö, vittuuks mennään jo alle 1‰: ${bac.toFixed(2)}‰`)
        setSendNotifications(false)
      }
      if(highestBac > 0.7 && bac < 0.5 ){
        scheduleNotification(`VITTU LISÄÄ KALJAA KONEESEEN JA VÄHÄ HÄTÄSEE. tasot jo alle 0.5: ${bac.toFixed(2)}‰`)
        setSendNotifications(false)
      }
    }
    
  };

  const resetInfo= () => {
    setGrams(0)
    setFirstDrinkTime(null)
    setLastDrinkTime(null)
    setDrinkCount(0)
    setBac(null)
    setHighestBac(0)
    setHighestBacStat(0)
    setSendNotifications(true)
  }

  const removeDrink = () => {
    const newGrams = 12;
    if(grams < 12){
      setGrams(0)
      calculateBAC(0)
    }else{
      setGrams(grams - newGrams);
      calculateBAC(grams - newGrams);
    }
    if(drinkCount < 1){
      setDrinkCount(0)
    }else{
      setDrinkCount(drinkCount - 1);
    }
    
  };

  const addDrink = () => {
    const newGrams = 12;
    setGrams(grams + newGrams);
    calculateBAC(grams + newGrams);
    setDrinkCount(drinkCount + 1);
    setLastDrinkTime(Date.now());
    if (firstDrinkTime === null) {
      setFirstDrinkTime(Date.now());
    }
  };

  const addHalfDrink = () => {
    const newGrams = 6;
    setGrams(grams + newGrams);
    calculateBAC(grams + newGrams);
    setDrinkCount(drinkCount + 0.5);
    setLastDrinkTime(Date.now());
    if (firstDrinkTime === null) {
      setFirstDrinkTime(Date.now());
    }
  };

  const addQuarterDrink = () => {
    const newGrams = 3;
    setGrams(grams + newGrams);
    calculateBAC(grams + newGrams);
    setDrinkCount(drinkCount + 0.25);
    setLastDrinkTime(Date.now());
    if (firstDrinkTime === null) {
      setFirstDrinkTime(Date.now());
    }
  };

  const testNotification = () => {
    scheduleNotification("testi")
  }

  const addDoubleDrink = () => {
    const newGrams = 24;
    setGrams(grams + newGrams);
    calculateBAC(grams + newGrams);
    setDrinkCount(drinkCount + 2);
    setLastDrinkTime(Date.now());
    if (firstDrinkTime === null) {
      setFirstDrinkTime(Date.now());
    }
  };

  useEffect(() => {
    console.log(showSettings)
    console.log(settingsViewed)
  }, [showSettings, settingsViewed])

  const returnToMain = () => {
    setShowSettings(false)
    setSettingsViewed(true)
    setWeightPlaceholder(String(weight))
  }

  function showSettingsPage() {
    if(!settingsViewed){
      return true
    }else if(showSettings){
      return true
    }else {
      return false
    }
  }

  return (
    <View style={styles.container}>
      {showSettingsPage() ? (
        <View style={styles.settingsContainer}>
          <Text style={styles.label}>Sukupuoli: {gender ? 'mies' : 'nainen'}</Text>
          <Switch style={styles.switch} value={gender} onValueChange={val => setGender(val)} />
          <TextInput inputMode='numeric' style={styles.input} placeholder={weightPlaceholder} placeholderTextColor='#7894ad' onChangeText={text => setWeight(parseFloat(text))} keyboardType='numeric' />
          <TouchableOpacity style={styles.button} onPress={resetInfo}><Text style={styles.buttonText}>Resetoi juodut annokset ja niiden statsit</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={returnToMain}><Text style={styles.buttonText}>Juomaan!</Text></TouchableOpacity>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          {bac !== null && <Text style={styles.bac}>romillet: {bac} ‰</Text>}
          {bac !== null && <Text style={styles.label}>korkeimmat romillet: {highestBacStat} ‰</Text>}
          <Text style={styles.label}>juomia tuhottu: {drinkCount}</Text>
          <Text style={styles.label}>ekasta juomasta aikaa: {firstDrinkTime ? ((Date.now() - firstDrinkTime) / 60000).toFixed(0) + ' min' : 'N/A'}</Text>
          <Text style={styles.label}>vikasta juomasta aikaa: {lastDrinkTime ? ((Date.now() - lastDrinkTime) / 60000).toFixed(0) + ' min' : 'N/A'}</Text>
          <Text style={styles.label}>palamattomia grammoja: {grams > 0 ? (grams.toFixed(2) + ' g') : 'N/A'}</Text>
          <TouchableOpacity style={styles.button} onPress={addDrink}><Text style={styles.buttonText}>Lisää juoma</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={addDoubleDrink}><Text style={styles.buttonText}>Lisää 2 juomaa</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={addHalfDrink}><Text style={styles.buttonText}>Lisää puolikas juoma</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={addQuarterDrink}><Text style={styles.buttonText}>Lisää 1/4 juoma</Text></TouchableOpacity>
          {drinkCount != 0 && <TouchableOpacity style={styles.button} onPress={removeDrink}><Text style={styles.buttonText}>Poista yks juoma</Text></TouchableOpacity>}
          <TouchableOpacity style={styles.button} onPress={testNotification}><Text style={styles.buttonText}>notif testi</Text></TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setShowSettings(true)}><Text style={styles.buttonText}>asetukset</Text></TouchableOpacity>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({

  bac: {
    fontSize: 30,
    marginBottom: 10,
    color: '#bcd5eb',
  },
  container: {
    flex: 1,
    backgroundColor: '#292929',
    color: '#bcd5eb',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#292929',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#bcd5eb',
    padding: 20
  },
  settingsContainer: {
    flex: 1,
    backgroundColor: '#292929',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#bcd5eb',
    padding: 20
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#bcd5eb',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: '80%',
    color: '#bcd5eb',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
    color: '#bcd5eb',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    color: '#bcd5eb',
  },
  switch: {
    marginBottom: 20,
    color: '#bcd5eb',
  }
});