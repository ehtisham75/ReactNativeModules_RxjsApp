import { View, Text, ImageProps, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import moment from 'moment';
import { Colors } from '../Utils/Colors';
import { screenWidth } from '../Styles/ScreenSize';

type ChatBubbleProps = {
    userName: string,
    message: string;
    timeStamp?: any,
    senderId: string,
    showUserPicture: boolean;

};

const SendChatBubble = ({ message,timeStamp, senderId, showUserPicture }: ChatBubbleProps) => {

    // const [showUserPicture, setShowUserPicture] = useState(true);

    const formatTimestamp = (timestamp: any) => {
        const currentTimestamp = Date.now();
        const diffInMilliseconds = currentTimestamp - timestamp;

        if (diffInMilliseconds < 60000) {  // Less than a minute
            return 'Just now';
        } else if (diffInMilliseconds < 3600000) {  // Less than an hour
            const minutes = Math.floor(diffInMilliseconds / 60000);
            return `${minutes} mins`;
        } else if (moment(timestamp).isSame(currentTimestamp, 'day')) {  // Same day
            return moment(timestamp).format('hh:mm a');
        } else {  // Older than a day
            return moment(timestamp).format('MMM DD');
        }
    };

    return (
        <View style={styles.sendBubbleContainer}>

            <View style={{
                ...styles.message_time_Container,
                paddingVertical: showUserPicture ? 0 : 13,
                marginRight: showUserPicture ? 5 : 0,
                marginLeft: showUserPicture ? 0 : screenWidth.width11,
            }}>
                <View style={styles.timeBox}>
                    <Text style={styles.time}>{formatTimestamp(timeStamp)}</Text>
                </View>

                <TouchableOpacity style={styles.messageBox} activeOpacity={0.7}>
                    <Text style={styles.messageText}>{message}</Text>
                </TouchableOpacity>
            </View>

            {showUserPicture && (
                <View style={styles.userImageStyle}>
                    {/* <Image source={image || AppImages.userIcon} style={styles.userImageStyle} /> */}
                </View>
            )}

        </View>
    )
}


export default SendChatBubble;

const styles = StyleSheet.create({
    sendBubbleContainer: {
        flexDirection: "row",
    },
    message_time_Container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: Colors.gray20,
        paddingHorizontal: 10
    },
    timeBox: {
        marginRight: 7,
    },
    time: {
        fontSize: 10,
        color: Colors.black_text_color,
        // fontFamily: AppFonts.Inter.regular,
        textAlign: 'left',
    },
    messageBox: {
        flex: 1,
    },
    messageText: {
        fontSize: 14,
        color: Colors.black_text_color,
        // fontFamily: AppFonts.Inter.regular,
        textAlign: 'right',
    },
    userImageStyle: {
        width: 45,
        height: 45,
        resizeMode: "contain",
        borderRadius: 100,
        backgroundColor:"gray"
    },
});



