import React, { useEffect, useState } from 'react'
import { View, Button, NativeModules, StyleSheet, Text, ToastAndroid, FlatList, TouchableOpacity, PermissionsAndroid } from 'react-native';
import { AppRoutes } from '../../Constants/AppRoutes';

const { SMSModule } = NativeModules;


const HomeScreen = ({ navigation }) => {
    const [hasPermission, setHasPermission] = useState(false);


    const checkSMSPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.SEND_SMS,
                {
                    title: "SMS Permission",
                    message: "This app needs permission to send SMS.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setHasPermission(true);
                handleSendSMS();
            } else {
                setHasPermission(false);
                showToast("SMS permission denied.");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const handleSendSMS = () => {
        if (hasPermission) {
            const phoneNumber = '03001112220';
            const message = 'Hello from React Native!';

            SMSModule.sendSMS(phoneNumber, message);
            showToast("Message sent.");
        } else {
            showToast("SMS permission not granted.");
        }
    };

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <View>
                <Text style={{
                    fontSize: 20,
                    color: 'black'
                }}>Press button to send a sms.</Text>

                <TouchableOpacity
                    // onPress={}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                        backgroundColor: "lightblue",
                        paddingHorizontal: 30,
                        paddingVertical: 10,
                    }}>
                    <Text style={{
                        fontSize: 20,
                        color: 'black',
                    }}>Send SMS</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => { navigation.navigate(AppRoutes.ContactScreen) }}
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10,
                        backgroundColor: "red",
                        paddingHorizontal: 30,
                        paddingVertical: 10,
                    }}>
                    <Text style={{
                        fontSize: 20,
                        color: 'black',
                    }}>Contact Screen</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({})



