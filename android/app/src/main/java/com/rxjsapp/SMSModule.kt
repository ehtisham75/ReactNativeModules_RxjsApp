package com.rxjsapp

import android.telephony.SmsManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SMSModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SMSModule"
    }

    @ReactMethod
    fun sendSMS(phoneNumber: String, message: String) {
        val smsManager = SmsManager.getDefault()
        smsManager.sendTextMessage(phoneNumber, null, message, null, null)
    }
}
