import React, { useEffect, useState } from 'react'
import { View, Button, NativeModules, PermissionsAndroid, StyleSheet, Text, ToastAndroid, FlatList, StatusBar, ActivityIndicator, TextInput } from 'react-native';
import { Colors } from '../../Utils/Colors';

const { CallLogModule } = NativeModules;

const CallLogScreen = () => {
    const [contacts, setContacts] = useState([]);
    const [hasPermission, setHasPermission] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchContact, setSearchContact] = useState("");

    useEffect(() => {
        fetchCallLogs();
    }, [])

    const showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };

    const fetchCallLogs = async () => {
        setLoading(true);
        try {
            const callLogTempArray = await CallLogModule.getCallLogs();
            console.log(" ============== Call Logs ========== ", callLogTempArray)
            setContacts(callLogTempArray);
            setLoading(false);
            showToast("Call Log Fetched Successfully.");
        } catch (error) {
            console.error('Error fetching call log:', error);
            setLoading(false);
            showToast("Error fetching call log.");
        }
    };

    const filterContacts = () => {
        return contacts.filter((item) => item.number.includes(searchContact));
    };

    const renderCallLogItem = ({ item }) => (
        <View style={{ padding: 10 }}>
            <Text style={styles.ContactName}>{item.number}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle={"light-content"} backgroundColor={Colors.primary_color} />
            <Text style={styles.screenTitle}>Call Logs</Text>
            <View style={styles.searchbox}>
                <TextInput
                    keyboardType='numeric'
                    placeholder={"Search Contact"}
                    placeholderTextColor={Colors.gray40}
                    value={searchContact}
                    onChangeText={(txt) => { setSearchContact(txt) }}
                    style={styles.searchInput}
                    autoFocus={true}
                />
            </View>

            <View style={styles.subContainer}>

                <View style={styles.listBox}>
                    {filterContacts().length > 0 ? (
                        <FlatList
                            data={filterContacts()}
                            renderItem={renderCallLogItem}
                            keyExtractor={(item, index) => index.toString()}
                            ListEmptyComponent={() => {
                                <View style={styles.permissionBox}>
                                    <Text style={styles.noContactText}>No Calls.</Text>
                                </View>
                            }}
                        />
                    ) : (
                        <View style={styles.permissionBox}>
                            <Text style={styles.noContactText}>No Calls</Text>
                        </View>
                    )}

                </View>
            </View>

            {loading && (<View style={styles.loader}><ActivityIndicator size={'large'} color={'black'} /></View>)}
        </View>
    )
}
export default CallLogScreen;

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
        paddingTop: "2%"
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
