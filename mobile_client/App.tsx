import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  Modal,
  Pressable,
  ActivityIndicator,
  Keyboard,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import RNFetchBlob from 'rn-fetch-blob';
import {Buffer} from 'buffer';
import {MenuProvider,Menu, MenuOptions, MenuOption, MenuTrigger} from 'react-native-popup-menu';


const App = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [serverIp, setServerIp] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getServerIp = async () => {
      try {
        const storedIp = await AsyncStorage.getItem('serverIp');
        if (storedIp !== null) {
          setServerIp(storedIp);
        }
      } catch (error) {
        console.log('Error getting stored server IP:', error);
      }
    };

    getServerIp();
  }, []);

  const generateImage = async () => {
    Keyboard.dismiss(); 
    try {
      setLoading(true); // Show the activity indicator
      const response = await axios.post(`http://${serverIp}:5000/generate/`, {
        prompt,
      });
      const guid = response.data.guid;

      let imageResponse = await axios.get(`http://${serverIp}:5000/image/`, {
        params: {guid},
        responseType: 'arraybuffer',
        headers: {
          'cache-control': 'no-cache',
        },
      });

      let base64Image = Buffer.from(imageResponse.data, 'binary').toString(
        'base64',
      );
      setGeneratedImage(`data:image/png;base64,${base64Image}`);
    } catch (error) {
      console.log('Error generating image:', error);
    } finally {
      setLoading(false); // Hide the activity indicator
    }
  };

  const saveServerIp = async () => {
    try {
      await AsyncStorage.setItem('serverIp', serverIp);
      setSettingsVisible(false);
    } catch (error) {
      console.log('Error saving server IP:', error);
    }
  };

  const saveImageToGallery = async () => {
    // Save the image to the photo gallery
  };

  const onImageLongPress = (e) => {
    showMenu({
      rect: {x: e.nativeEvent.pageX, y: e.nativeEvent.pageY, width: 0, height: 0},
      onSelectMenuItem: (menuItem) => {
        if (menuItem === 'save') {
          saveImageToGallery();
        }
      },
      menuItems: [{title: 'Save to Gallery', actionKey: 'save'}],
    });
  };

  return (
    <MenuProvider>
      <View style={styles.contentContainer}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.title}>Intranet Image Generator</Text>
          <View style={styles.settingsContainer}>
            <Menu>
              <MenuTrigger>
                <Text style={styles.menuTriggerText}>⋮</Text>
              </MenuTrigger>
              <MenuOptions>
                <MenuOption onSelect={() => setSettingsVisible(true)}>
                  <Text>Settings</Text>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
        </View>


      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={prompt}
          onChangeText={setPrompt}
          placeholder="Enter a prompt"
        />
        <TouchableOpacity style={styles.button} onPress={generateImage}>
          <Text style={styles.buttonText}>Generate</Text>
        </TouchableOpacity>
      </View>
        {loading && (
          <ActivityIndicator
            style={styles.activityIndicator}
            size="large"
            color="#0000ff"
          />
        )}

        {generatedImage !== '' && !loading && (
          <Image
            style={styles.image}
            source={{uri: generatedImage}}
            resizeMode="contain"
          />
        )}

      <Modal
        animationType="slide"
        transparent
        visible={settingsVisible}
        onRequestClose={() => setSettingsVisible(false)}>
        <View style={styles.modalView}>
          <Text>Server IP:</Text>
          <TextInput
            style={[styles.serverIpInput]}
            value={serverIp}
            onChangeText={setServerIp}
            keyboardType="numbers-and-punctuation"
          />
          <Button title="Save" onPress={saveServerIp} />
          <Button title="Cancel" onPress={() => setSettingsVisible(false)} />
        </View>
      </Modal>
    </View>
    </View>
  </MenuProvider>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  serverIpInput: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    flexDirection: 'row',
    padding: 10,
    width: '100%',   
  },
  settingsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  menuTriggerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  activityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  image: {
    width: '100%',
    height: '75%',
  },
  menuTrigger: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
  },
});

export default App;