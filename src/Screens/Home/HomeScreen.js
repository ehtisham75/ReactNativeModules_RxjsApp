import React from 'react'
import { View, Button, NativeModules, StyleSheet, Text, ToastAndroid } from 'react-native';

const { SMSModule } = NativeModules;


const HomeScreen = () => {
    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const handleSendSMS = () => {
        const phoneNumber = '03001112220';
        const message = 'Hello from React Native!';

        SMSModule.sendSMS(phoneNumber, message);
        showToast("Message sent.")
    };


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <View>
                <Text>Press button to send a sms.</Text>
                <Button title="Send SMS" onPress={handleSendSMS} />
            </View>

        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})
