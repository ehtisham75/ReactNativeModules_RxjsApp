import React, { useEffect, useState } from 'react'
import { View, Button, NativeModules, StyleSheet, Text, ToastAndroid, FlatList, TouchableOpacity, PermissionsAndroid, StatusBar } from 'react-native';
import { AppRoutes } from '../../Constants/AppRoutes';
import { Colors } from '../../Utils/Colors';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

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
        <View style={styles.container}>
            <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary_color} />

            <View style={styles.subContainer}>

                <Text style={styles.text}>Press button to send a sms.</Text>
                <TouchableOpacity onPress={() => { }} style={styles.button}>
                    <Text style={styles.buttonTitle}>Send SMS</Text>
                </TouchableOpacity>

                <View style={styles.contactBtnBox}>
                    <Text style={styles.text}>Press button to go Contacts screen.</Text>
                    <TouchableOpacity style={styles.button}
                        onPress={() => { navigation.navigate(AppRoutes.ContactScreen) }}>
                        <Text style={styles.buttonTitle}>Contact Screen</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.contactBtnBox}>
                    <Text style={styles.text}>Press button to Check Call Logs.</Text>
                    <TouchableOpacity style={styles.button}
                        onPress={() => { navigation.navigate(AppRoutes.CallLogScreen) }}>
                        <Text style={styles.buttonTitle}>Call Logs</Text>
                    </TouchableOpacity>
                </View>
            </View>


        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    subContainer: {
        flex: 1,
        marginHorizontal: '5%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        color: Colors.black_text_color
    },
    button: {
        height: hp(6),
        width: wp(60),
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        backgroundColor: Colors.primary_color,
    },
    buttonTitle: {
        fontSize: 20,
        color: Colors.white_text_color,
    },
    contactBtnBox: {
        // backgroundColor: 'plum',
        marginTop: "30%"
    }
})



