import React, { useEffect, useState } from 'react'
import { View, Button, NativeModules, PermissionsAndroid, StyleSheet, Text, ToastAndroid, FlatList, StatusBar, ActivityIndicator, TextInput } from 'react-native';
import { Colors } from '../../Utils/Colors';

const { ContactsModule } = NativeModules;

const ContactScreen = () => {
    const [contacts, setContacts] = useState([]);
    const [hasPermission, setHasPermission] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchName, setSearchName] = useState("");

    useEffect(() => {
        fetchContacts();
        console.log("====== get contacts =======", contacts)
    }, [])

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    // const checkContactsPermission = async () => {
    //     try {
    //         const granted = await PermissionsAndroid.request(
    //             PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    //             {
    //                 title: "Contacts Permission",
    //                 message: "This app needs permission to access contacts.",
    //                 buttonNeutral: "Ask Me Later",
    //                 buttonNegative: "Cancel",
    //                 buttonPositive: "OK"
    //             }
    //         );
    //         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //             setHasPermission(true);
    //             fetchContacts();
    //             showToast("Contacts permission granted.");
    //         } else {
    //             setHasPermission(false);
    //             showToast("Contacts permission denied.");
    //         }
    //     } catch (err) {
    //         console.warn(err);
    //     }
    // };
    const fetchContacts = async () => {
        setLoading(true);
        try {
            const contactsArray = await ContactsModule.getContacts();
            console.log(" ============== Temp Contacts ========== ", contactsArray)
            setContacts(contactsArray);
            setLoading(false);
            showToast("Contacts Fetched Successfully.");
        } catch (error) {
            console.error('Error fetching contacts:', error);
            setLoading(false);
            showToast("Error fetching contacts.");
        }
    };

    const filterContacts = () => {
        return contacts.filter((item) =>
            item.name.toLowerCase().includes(searchName.toLowerCase())
        );
    };

    const renderContact = ({ item }) => (
        <View style={{ padding: 10 }}>
            <Text style={styles.ContactName}>{item.name}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle={"light-content"} backgroundColor={Colors.primary_color} />
            <Text style={styles.screenTitle}>Contacts</Text>
            <View style={styles.searchbox}>
                <TextInput
                    keyboardType='default'
                    placeholder={"Search Contact"}
                    placeholderTextColor={Colors.gray40}
                    value={searchName}
                    onChangeText={(txt) => { setSearchName(txt) }}
                    style={styles.searchInput}
                />
            </View>

            <View style={styles.subContainer}>
                <Text style={styles.totalContact}>Total Contacts: {contacts.length}</Text>


                {/* {hasPermission ? ( */}
                <View style={styles.listBox}>
                    {filterContacts().length > 0 ? (
                        <FlatList
                            data={filterContacts()}
                            renderItem={renderContact}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={() => {
                                <View style={styles.permissionBox}>
                                    <Text style={styles.noContactText}>No Contacts Available</Text>
                                </View>
                            }}
                        />
                    ) : (
                        <View style={styles.permissionBox}>
                            <Text style={styles.noContactText}>Empty Contact List.</Text>
                        </View>
                    )}

                </View>
                {/* ) : (
                    <View style={styles.permissionBox}>
                        <Text style={styles.permisionText}>Permission required to access contacts.</Text>
                        <Button title="Grant Permission" onPress={checkContactsPermission} />
                    </View>
                )} */}
            </View>

            {loading && (<View style={styles.loader}><ActivityIndicator size={'large'} color={'black'} /></View>)}
        </View>
    )
}
export default ContactScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    screenTitle: {
        fontSize: 20,
        color: Colors.yellow,
        fontWeight: '600',
        backgroundColor: Colors.primary_color,
        paddingHorizontal: "5%",
        paddingTop:"2%"
    },
    searchbox: {
        backgroundColor: Colors.primary_color,
        paddingHorizontal: "5%",
        paddingBottom: "5%",
        paddingTop: 5,
    },
    searchInput: {
        fontSize: 12,
        color: Colors.black_text_color,
        backgroundColor: Colors.white,
        borderRadius: 50,
        paddingVertical: 5,
        paddingHorizontal: 20,
    },
    subContainer: {
        flex: 1,
        marginHorizontal: "5%",
    },
    totalContact: {
        fontSize: 10,
        color: Colors.black,
        textAlign: 'right',
    },
    listBox: {
        flex: 1,
    },
    noContactText: {
        color: 'black',
        fontSize: 20
    },
    permissionBox: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    permisionText: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
        marginBottom: "5%",
    },
    ContactName: {
        color: Colors.black_text_color,
        fontSize: 10
    },
    loader: {
        position: 'absolute',
        height: "100%",
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
    },
})
