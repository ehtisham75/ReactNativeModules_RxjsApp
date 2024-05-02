import React, { useEffect, useState } from 'react'
import { View, Button, NativeModules, PermissionsAndroid, StyleSheet, Text, ToastAndroid, FlatList } from 'react-native';

const { ContactsModule } = NativeModules;

const ContactScreen = () => {
    const [contacts, setContacts] = useState([]);
    const [hasPermission, setHasPermission] = useState(false);

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const checkContactsPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    title: "Contacts Permission",
                    message: "This app needs permission to access contacts.",
                    buttonNeutral: "Ask Me Later",
                    buttonNegative: "Cancel",
                    buttonPositive: "OK"
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setHasPermission(true);
                fetchContacts();
            } else {
                setHasPermission(false);
                showToast("Contacts permission denied.");
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const fetchContacts = async () => {
        try {
            const contactsArray = await ContactsModule.getContacts();
            console.log("====== get contacts =======", contactsArray)
            setContacts(contactsArray);
        } catch (error) {
            console.error('Error fetching contacts:', error);
        }
    };

    const renderContact = ({ item }) => (
        <View style={{ padding: 10 }}>
            <Text>{item.name}</Text>
        </View>
    );

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {hasPermission ? (
                <View style={{}}>
                    <FlatList
                        data={contacts}
                        renderItem={renderContact}
                        keyExtractor={(index) => index.toString()}
                    />
                </View>
            ) : (
                <View>
                    <Text>Permission required to access contacts.</Text>
                    <Button title="Grant Permission" onPress={checkContactsPermission} />
                </View>
            )}
        </View>
    )
}

export default ContactScreen;
