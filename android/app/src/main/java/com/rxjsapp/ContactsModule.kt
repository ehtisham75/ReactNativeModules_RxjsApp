package com.rxjsapp

import android.annotation.SuppressLint
import android.content.ContentResolver
import android.database.Cursor
import android.provider.ContactsContract
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments

class ContactsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ContactsModule"
    }

    @SuppressLint("Range")
    @ReactMethod
    fun getContacts(): WritableArray {
        val contactsArray: WritableArray = Arguments.createArray()

        val contentResolver: ContentResolver = reactApplicationContext.contentResolver
        val cursor: Cursor? = contentResolver.query(ContactsContract.Contacts.CONTENT_URI, null, null, null, null)

        cursor?.let {
            if (it.count > 0) {
                while (it.moveToNext()) {
                    val contactMap: WritableMap = Arguments.createMap()
                    val id: String = it.getString(it.getColumnIndex(ContactsContract.Contacts._ID))
                    val name: String = it.getString(it.getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME))

                    contactMap.putString("id", id)
                    contactMap.putString("name", name)

                    contactsArray.pushMap(contactMap)
                }
            }
            it.close()
        }

        return contactsArray
    }
}
