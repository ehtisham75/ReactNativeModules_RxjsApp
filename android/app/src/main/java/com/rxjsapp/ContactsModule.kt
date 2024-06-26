package com.rxjsapp

import android.Manifest
import android.content.ContentResolver
import android.content.pm.PackageManager
import android.database.Cursor
import android.provider.ContactsContract
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener

class ContactsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), PermissionListener {

    private var promise: Promise? = null

    companion object {
        const val PERMISSION_REQUEST_CODE = 101
    }

    override fun getName(): String {
        return "ContactsModule"
    }

    @ReactMethod
    fun getContacts(promise: Promise) {
        this.promise = promise
        if (checkPermissions()) {
            fetchContacts()
        } else {
            requestPermissions()
        }
    }

    private fun checkPermissions(): Boolean {
        val currentActivity = currentActivity ?: return false
        val permissionStatus = currentActivity.checkSelfPermission(Manifest.permission.READ_CONTACTS)
        return permissionStatus == PackageManager.PERMISSION_GRANTED
    }

    private fun requestPermissions() {
        val currentActivity = currentActivity ?: return
        (currentActivity as? PermissionAwareActivity)?.requestPermissions(
            arrayOf(Manifest.permission.READ_CONTACTS),
            PERMISSION_REQUEST_CODE,
            this
        )
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray): Boolean {
        if (requestCode == PERMISSION_REQUEST_CODE) {
            val isPermissionGranted = grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED
            if (isPermissionGranted) {
                fetchContacts()
            } else {
                promise?.reject("PERMISSION_DENIED", "Permission denied for accessing contacts.")
            }
            return true
        }
        return false
    }


    private fun fetchContacts() {
        val contactsArray: WritableArray = Arguments.createArray()
        val contentResolver: ContentResolver = reactApplicationContext.contentResolver
        val cursor: Cursor? = contentResolver.query(
            ContactsContract.Contacts.CONTENT_URI,
            null,
            null,
            null,
            null
        )

        cursor?.use {
            while (it.moveToNext()) {
                val contactMap = Arguments.createMap()
                val id: String? = it.getString(it.getColumnIndex(ContactsContract.Contacts._ID))
                val name: String? = it.getString(it.getColumnIndex(ContactsContract.Contacts.DISPLAY_NAME))
                if (name != null) {
                    contactMap.putString("id", id ?: "")
                    contactMap.putString("name", name)
                    contactsArray.pushMap(contactMap)
                }
            }
        }
        promise?.resolve(contactsArray)
    }
}