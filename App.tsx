import React, {useEffect, useRef, useState} from 'react';
import WebView from 'react-native-webview';
import {
  ALL_STORAGE_READ_KEY,
  ALL_STORAGE_STORE_KEY,
  WEBVIEW_URL,
  WEBVIEW_URL_MYACCOUNT,
  injectedScriptRead,
  injectedScriptStore,
} from './constants';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {logCookieValue, logLocalStorageValue, logSessionValue} from './utils';

const App: React.FC<{}> = () => {
  // Reference for the WebView component
  const webViewRef = useRef<WebView>(null);
  const [beforeLoadScriptStr, setBeforeLoadScriptStr] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const mainScript = await handleReadAsycn();
      console.log('mainScript', mainScript);
      const script = `(function () { 
          ${mainScript} 
          window.ReactNativeWebView.postMessage(JSON.stringify({
            messageType: 'WEBVIEW_LOADED_INIT',
            payload: {}
        }))
       })()`;
      // console.log('script to be loaded==>', script);
      setBeforeLoadScriptStr(script);
    };

    fetchData();
  }, []);

  // Function to handle messages from the WebView
  const handleMessage = async (event: any) => {
    const message = event.nativeEvent.data;
    try {
      const parsedMessage = JSON.parse(message);
      switch (parsedMessage['messageType']) {
        case ALL_STORAGE_READ_KEY:
          handleReadMessage(parsedMessage['payload']);
          break;
        case ALL_STORAGE_STORE_KEY:
          await handleStoreMessage(parsedMessage['payload']);
          break;
        case 'WEBVIEW_LOADED_INIT':
          reloadWebview();
        default:
          break;
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  const handleReadMessage = (data: any) => {
    data &&
      data['localstorage'] &&
      logLocalStorageValue(data['localstorage'], 'handleReadMessage');
    data &&
      data['cookies'] &&
      logCookieValue(data['cookies'], 'handleReadMessage');

    data &&
      data['session'] &&
      logSessionValue(data['session'], 'handleReadMessage');
  };

  const handleStoreMessage = async (data: any) => {
    console.log('$$$$$$$$$$$$$$$$', data['session']);
    if (data['localstorage']) {
      await AsyncStorage.setItem(
        'localstorage',
        JSON.stringify(data['localstorage']),
      );
      console.log('handleStoreMessage localstorage completed.');
    }
    if (data['cookies']) {
      await AsyncStorage.setItem('cookies', JSON.stringify(data['cookies']));
      console.log('handleStoreMessage cookies completed.');
    }
    if (data['session']) {
      await AsyncStorage.setItem('session', JSON.stringify(data['session']));
      console.log('handleStoreMessage session completed.');
    }
  };

  const handleReadAsycn = async (loadAsync: boolean = false) => {

    const localStorageString = await AsyncStorage.getItem('localstorage');
    const cookieString = await AsyncStorage.getItem('cookies');
    const sessionString = await AsyncStorage.getItem('session');

    let jsLS = '';
    let jsCookie = '';
    let jsSession = '';
    if (localStorageString) {
      jsLS = logLocalStorageValue(
        JSON.parse(localStorageString),
        'handleReadAsycn',
      );
    }
    if (cookieString) {
      jsCookie = logCookieValue(JSON.parse(cookieString), 'handleReadAsycn');
    }
    if (sessionString) {
      jsSession = logSessionValue(JSON.parse(sessionString), 'handleReadAsycn');
    }
    return `${jsLS} ${jsCookie} ${jsSession}`;
  };

  const handleRead = () => {
    // Execute JavaScript code within the WebView to trigger postMessage
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(injectedScriptRead);
    }
  };

  const handleStore = () => {
    // Execute JavaScript code within the WebView to trigger postMessage
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript(injectedScriptStore);
    }
  };

  const reloadWebview = () => {
    console.log('reloadWebview');
    // if (webViewRef) {
    //   webViewRef.current.reload();
    // }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{uri: WEBVIEW_URL}}
        style={styles.webview}
        onMessage={handleMessage} // Handle messages from WebView
        // injectedJavaScript={startInjectingScript}
        injectedJavaScriptBeforeContentLoaded={beforeLoadScriptStr}
      />
      <View style={styles.wrap}>
        <Pressable style={styles.btn} onPress={handleRead}>
          <Text style={styles.btnText}>{'READ'}</Text>
        </Pressable>
        <Pressable style={styles.btn} onPress={handleStore}>
          <Text style={styles.btnText}>{'Store'}</Text>
        </Pressable>
        <Pressable
          style={styles.btn}
          onPress={handleReadAsycn}>
          <Text style={styles.btnText}>{'Read Async'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'red',
  },
  webview: {
    height: '90%',
    width: '100%',
    backgroundColor: 'green',
  },
  wrap: {
    height: '10%',
    width: '100%',
    backgroundColor: 'grey',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: 'blue',
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: 'white',
    borderRadius: 8,
    margin: 8,
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default App;
