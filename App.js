import React, {useState, useEffect} from 'react';

import * as Location from 'expo-location';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [offset, setOffset] = useState(1);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [lat, setLat] = useState(0);
  const [log, setLog] = useState(0);
 

  const getloc = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    
    setLocation(location);
    let lat = location.coords.latitude;
    setLat(lat);
    setLog(location.coords.longitude);
  }
  useEffect(() => {
  getloc();
}, []);

console.log(lat);
let text = 'Waiting..';
if (errorMsg) {
  text = errorMsg;
} else if (location) {
  text = JSON.stringify(location);
  
}
  useEffect(() => getData(), []);
  const getData = () => {
    console.log('getData');
    setLoading(true);
    //Service to get the data from the server to render
    fetch('http://dev.virtualearth.net/REST/V1/Routes/LocalInsights?waypoint='+lat+','+log+'&TravelMode=Driving&Optimize=time&MaxTime=30&TimeUnit=Minute&type=Hospitals&key=Akm-NUKYwLBqtU3z7n7uftlnRXC6iv55a9VqDZEkxLas1QkYTQeOTn3Isr0MRP9w')
      //Sending the currect offset with get request
      .then((response) => response.json())
      .then((responseJson) => {
        //Successful response
        setOffset(offset + 1);
      console.log(responseJson.resourceSets[0].resources[0].categoryTypeResults[0].entities);
        setDataSource(responseJson.resourceSets[0].resources[0].categoryTypeResults[0].entities);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderFooter = () => {
    return (
      //Footer View with Load More button
      <SafeAreaView style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={getData}
          //On Click of button load more data
          style={styles.loadMoreBtn}>
          <Text style={styles.btnText}>Load Nearby Hospitals</Text>
          {loading ? (
            <ActivityIndicator
              color="white"
              style={{marginLeft: 8}} />
          ) : null}
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  const ItemView = ({item}) => {
    return (
      // Flat List Item
      <Text
        style={{fontSize:18}}
        onPress={() => getItem(item)}>
          
        {item.entityName}
        
      </Text>
    );
  };

  const ItemSeparatorView = () => {
    return (
      // Flat List Item Separator
      <View
        style={{
          height: 2,
          width: '100%',
          backgroundColor: '#C8C8C8',
        }}
      />
    );
  };

  const getItem = (item) => {
    //Function for click on an item
    alert();
  };

  return (
    
    <SafeAreaView style={{flex: 1}}>
     
      <View style={styles.container}>
      <Text style={{padding:"4%",alignItems: 'center',fontWeight: 'bold',fontSize:15}}>Hospitals in 30 mins by driving</Text>
      
        <FlatList
          data={dataSource}
          
          ItemSeparatorComponent={ItemSeparatorView}
          enableEmptySections={true}
          renderItem={ItemView}
          ListFooterComponent={renderFooter}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
  },
  footer: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  loadMoreBtn: {
    padding: 10,
    backgroundColor: '#800000',
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default App;