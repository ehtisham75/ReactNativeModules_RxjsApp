// import React, { useEffect, useState } from 'react'
// import { View, Button, NativeModules, StyleSheet, Text, ToastAndroid, FlatList, TouchableOpacity, PermissionsAndroid, StatusBar } from 'react-native';
// import { AppRoutes } from '../../Constants/AppRoutes';
// import { Colors } from '../../Utils/Colors';
// import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

// const { SMSModule } = NativeModules;


// const HomeScreen = ({ navigation }) => {
//     const [hasPermission, setHasPermission] = useState(false);

//     const checkSMSPermission = async () => {
//         try {
//             const granted = await PermissionsAndroid.request(
//                 PermissionsAndroid.PERMISSIONS.SEND_SMS,
//                 {
//                     title: "SMS Permission",
//                     message: "This app needs permission to send SMS.",
//                     buttonNeutral: "Ask Me Later",
//                     buttonNegative: "Cancel",
//                     buttonPositive: "OK"
//                 }
//             );
//             if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//                 setHasPermission(true);
//                 handleSendSMS();
//             } else {
//                 setHasPermission(false);
//                 showToast("SMS permission denied.");
//             }
//         } catch (err) {
//             console.warn(err);
//         }
//     };

//     const handleSendSMS = () => {
//         if (hasPermission) {
//             const phoneNumber = '03001112220';
//             const message = 'Hello from React Native!';

//             SMSModule.sendSMS(phoneNumber, message);
//             showToast("Message sent.");
//         } else {
//             showToast("SMS permission not granted.");
//         }
//     };

//     const showToast = (message) => {
//         ToastAndroid.show(message, ToastAndroid.SHORT);
//     };

//     return (
//         <View style={styles.container}>
//             <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary_color} />

//             <View style={styles.subContainer}>

//                 <Text style={styles.text}>Press button to send a sms.</Text>
//                 <TouchableOpacity onPress={() => { }} style={styles.button}>
//                     <Text style={styles.buttonTitle}>Send SMS</Text>
//                 </TouchableOpacity>

//                 <View style={styles.contactBtnBox}>
//                     <Text style={styles.text}>Press button to go Contacts screen.</Text>
//                     <TouchableOpacity style={styles.button}
//                         onPress={() => { navigation.navigate(AppRoutes.ContactScreen) }}>
//                         <Text style={styles.buttonTitle}>Contact Screen</Text>
//                     </TouchableOpacity>
//                 </View>

//                 <View style={styles.contactBtnBox}>
//                     <Text style={styles.text}>Press button to Check Call Logs.</Text>
//                     <TouchableOpacity style={styles.button}
//                         onPress={() => { navigation.navigate(AppRoutes.CallLogScreen) }}>
//                         <Text style={styles.buttonTitle}>Call Logs</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>


//         </View>
//     )
// }

// export default HomeScreen

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'white',
//     },
//     subContainer: {
//         flex: 1,
//         marginHorizontal: '5%',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     text: {
//         fontSize: 20,
//         color: Colors.black_text_color
//     },
//     button: {
//         height: hp(6),
//         width: wp(60),
//         alignItems: 'center',
//         justifyContent: 'center',
//         alignSelf: 'center',
//         borderRadius: 8,
//         backgroundColor: Colors.primary_color,
//     },
//     buttonTitle: {
//         fontSize: 20,
//         color: Colors.white_text_color,
//     },
//     contactBtnBox: {
//         // backgroundColor: 'plum',
//         marginTop: "30%"
//     }
// })









import { Animated, FlatList, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useRef, useState } from 'react';
import { Colors } from '../../Utils/Colors';
import SendChatBubble from '../../Components/SendChatBubble';
import ReceiveChatBubble from '../../Components/ReceiveChatBubble';
import axios from 'axios';

const HomeScreen = ({ route }) => {
    const scrollViewRef = useRef();
    const scrollY = useRef(new Animated.Value(0)).current;
    const currentDate = new Date();
    const timestampFromDate = currentDate.getTime();
    const [message, setMessage] = useState("");
    const [messageList, setMessageList] = useState([
        {
            senderId: "0090",
            message: 'Hello, how can I assist you?',
            timestamp: timestampFromDate,
            userName: "ChatGPT",
        },
    ]);

    const myUserData = {
        id: '01100',
        myName: 'Ali',
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        // Append the user message to the messageList
        const newMessage = {
            senderId: myUserData.id,
            message: message,
            timestamp: new Date().getTime(),
            userName: myUserData.myName,
        };
        setMessageList((prev) => [...prev, newMessage]);
        setMessage("");  // Clear input after sending the message

        // Call OpenAI API
        try {
            const apiKey = '';  // Replace with your actual API key
            const response = await axios.post(
                'https://api.openai.com/v1/chat/completions',
                {
                    model: 'gpt-3.5-turbo',  //  Specify your model
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: message },
                    ],
                    max_tokens: 150,
                    temperature: 0.7,
                },
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const aiMessage = {
                senderId: '0010',  // ChatGPT's sender ID
                message: response.data.choices[0].message.content,
                timestamp: new Date().getTime(),
                userName: 'ChatGPT',
            };

            // Append AI's message to the messageList
            setMessageList((prev) => [...prev, aiMessage]);

            console.log("============== response ===========>> ", response.data);

        } catch (error) {
            console.error("Error fetching data from OpenAI: ", error.response ? error.response.data : error.message);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary_color} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}>

                <Animated.ScrollView ref={scrollViewRef}
                    onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                        { useNativeDriver: true }
                    )}
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: "5.5%",
                        paddingTop: 10,
                        backgroundColor: Colors.white_background,
                    }}>

                    <FlatList
                        data={messageList}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => {
                            const isSender = item.senderId === myUserData.id;
                            return (
                                <View style={{ marginVertical: 5 }}>
                                    {isSender ? (
                                        <SendChatBubble
                                            userName={item.userName}
                                            message={item.message}
                                            timeStamp={item.timestamp}
                                            senderId={item.senderId}
                                        />
                                    ) : (
                                        <ReceiveChatBubble
                                            userName={item.userName}
                                            message={item.message}
                                            timeStamp={item.timestamp}
                                            senderId={item.senderId}
                                        />
                                    )}
                                </View>
                            );
                        }}
                    />

                </Animated.ScrollView>

                <View style={[
                    styles.containerBox,
                    Platform.OS === 'ios' ? { marginBottom: 25 } : { marginBottom: 5 }
                ]}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Write here..."
                            placeholderTextColor={Colors.gray40}
                            cursorColor={Colors.black}
                            value={message}
                            onChangeText={(text) => setMessage(text)}
                            style={styles.textInput}
                        />
                    </View>

                    <TouchableOpacity activeOpacity={0.7} style={styles.sendButton}
                        onPress={handleSendMessage}>
                        <Text style={styles.okButton}>OK</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAvoidingView>
        </View>
    );
}

export default HomeScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    containerBox: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: "5%",
        paddingVertical: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.gray30,
        borderRadius: 15,
        marginRight: 8,
        paddingRight: 3,
        flex: 1,
    },
    textInput: {
        flex: 1,
        color: Colors.black_text_color,
        paddingVertical: Platform.OS === 'ios' ? 14 : 10,
        paddingHorizontal: 10,
        paddingLeft: 20,
    },
    sendButton: {
        backgroundColor: Colors.orange,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        width: 46,
        height: 46,
    },
    okButton: {
        textAlign: "center",
        color: Colors.white_text_color,
        fontSize: 18,
    }
});












// import { Animated, FlatList, Image, KeyboardAvoidingView, Platform, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
// import React, { useRef, useState } from 'react'
// import { Colors } from '../../Utils/Colors'
// import SendChatBubble from '../../Components/SendChatBubble'
// import ReceiveChatBubble from '../../Components/ReceiveChatBubble'

// const HomeScreen = ({ route }) => {
//     const scrollViewRef = useRef();
//     const scrollY = useRef(new Animated.Value(0)).current;
//     const currentDate = new Date();
//     const timestampFromDate = currentDate.getTime();
//     const [message, setMessage] = useState("");

//     const myUserData = {
//         id: '01100',
//         myName: 'Ali',
//     };

//     const [messageList, setMessageList] = useState([
//         {
//             senderId: "0090",
//             message: 'Hello, how are you?',
//             timestamp: timestampFromDate,
//             userName: "Chat gpt",
//         },
//         {
//             senderId: myUserData.id,
//             message: 'I need your support.',
//             timestamp: timestampFromDate,
//             userName: myUserData.myName,
//         },
//     ]);


//     return (
//         <View style={styles.container}>
//             <StatusBar barStyle={'light-content'} backgroundColor={Colors.primary_color} />


//             <KeyboardAvoidingView
//                 style={{ flex: 1, }}
//                 behavior={Platform.OS === "ios" ? "padding" : undefined}>

//                 <Animated.ScrollView ref={scrollViewRef}
//                     onContentSizeChange={(contentWidth, contentHeight) => {
//                         scrollViewRef.current.scrollToEnd({ animated: true });
//                     }}
//                     onScroll={Animated.event(
//                         [{ nativeEvent: { contentOffset: { y: scrollY } } }],
//                         { useNativeDriver: true }
//                     )}
//                     contentContainerStyle={{
//                         flexGrow: 1,
//                         paddingHorizontal: "5.5%",
//                         paddingTop: 10,
//                         backgroundColor: Colors.white_background,
//                     }}>

//                     <FlatList
//                         data={messageList}
//                         scrollEnabled={false}
//                         showsVerticalScrollIndicator={false}
//                         keyExtractor={(item, index) => index.toString()}
//                         renderItem={({ item, index }) => {
//                             const isSender = item?.senderId === myUserData?.id;

//                             return (
//                                 <View style={{ marginVertical: 5 }}>
//                                     {isSender ? (
//                                         <SendChatBubble
//                                             userName={item.userName}
//                                             message={item.message}
//                                             timeStamp={item.timestamp}
//                                             senderId={item.senderId}
//                                         />
//                                     ) : (
//                                         <ReceiveChatBubble
//                                             userName={item.userName}
//                                             message={item.message}
//                                             timeStamp={item.timestamp}
//                                             senderId={item.senderId}
//                                         />
//                                     )}
//                                 </View>
//                             );
//                         }}
//                     />

//                 </Animated.ScrollView>

//                 <View style={[
//                     styles.containerBox,
//                     Platform.OS == 'ios' ?
//                         { marginBottom: isKeyboardVisible ? 7 : 25 }
//                         :
//                         { marginBottom: 5 }
//                 ]}>
//                     <View style={styles.inputContainer}>
//                         <TextInput
//                             placeholder="Write here..."
//                             placeholderTextColor={Colors.gray40}
//                             cursorColor={Colors.black}
//                             value={message}
//                             onChangeText={(text) => setMessage(text)}
//                             style={styles.textInput}
//                         />
//                     </View>

//                     <TouchableOpacity activeOpacity={0.7} style={styles.sendButton}
//                         onPress={() => { handleSendMessage() }}>

//                         <Text style={styles.okButton}>OK</Text>
//                         {/* <Image
//                                 source={AppImages.sendIcon}
//                                 style={styles.sendIcon}
//                             /> */}
//                     </TouchableOpacity>
//                 </View>

//             </KeyboardAvoidingView>

//         </View>
//     )
// }

// export default HomeScreen

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'white',
//     },
//     subContainer: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: "red"
//     },
//     text: {
//         fontSize: 20,
//         color: Colors.black_text_color
//     },

//     containerBox: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "space-between",
//         paddingHorizontal: "5%",
//         paddingVertical: 10,
//     },
//     inputContainer: {
//         flexDirection: "row",
//         alignItems: "center",
//         backgroundColor: Colors.gray30,
//         borderRadius: 15,
//         marginRight: 8,
//         paddingRight: 3,
//         flex: 1,
//     },
//     textInput: {
//         flex: 1,
//         color: Colors.black_text_color,
//         paddingVertical: Platform.OS == 'ios' ? 14 : 10,
//         paddingHorizontal: 10,
//         paddingLeft: 20,
//     },
//     sendButton: {
//         backgroundColor: Colors.orange,
//         borderRadius: 100,
//         alignItems: "center",
//         justifyContent: "center",
//         alignSelf: "center",
//         width: 46,
//         height: 46,
//     },
//     okButton: {
//         textAlign: "center",
//         color: Colors.white_text_color,
//         fontSize: 18,
//     },
//     sendIcon: {
//         width: 24,
//         height: 24,
//         resizeMode: "contain",
//         tintColor: Colors.primary_color,
//     },
// })