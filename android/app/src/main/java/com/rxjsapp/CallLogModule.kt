package com.rxjsapp

import android.Manifest
import android.content.ContentResolver
import android.content.pm.PackageManager
import android.database.Cursor
import android.provider.CallLog
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener

class CallLogModule(reactContext: ReactApplicationContext) :ReactContextBaseJavaModule(reactContext), PermissionListener {
    private var promise: Promise? = null

    companion object {
        const val PERMISSION_REQUEST_CODE = 101
    }

    override fun getName(): String {
        return "CallLogModule"
    }

    @ReactMethod
    fun getCallLogs(promise: Promise) {
        this.promise = promise
        if (checkPermissions()) {
            fetchCallLogs()
        } else {
            requestPermissions()
        }
    }

    private fun checkPermissions(): Boolean {
        val currentActivity = currentActivity ?: return false
        val permissionStatus = currentActivity.checkSelfPermission(Manifest.permission.READ_CALL_LOG)
        return permissionStatus == PackageManager.PERMISSION_GRANTED
    }

    private fun requestPermissions() {
        val currentActivity = currentActivity ?: return
        (currentActivity as? PermissionAwareActivity)?.requestPermissions(
            arrayOf(Manifest.permission.READ_CALL_LOG),
            ContactsModule.PERMISSION_REQUEST_CODE,
            this
        )
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray): Boolean {
        if (requestCode == ContactsModule.PERMISSION_REQUEST_CODE) {
            val isPermissionGranted = grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED
            if (isPermissionGranted) {
                fetchCallLogs()
            } else {
                promise?.reject("PERMISSION_DENIED", "Permission denied for accessing contacts.")
            }
            return true
        }
        return false
    }

    private fun fetchCallLogs() {
        val logsTempArray: WritableArray = Arguments.createArray()
        val contentResolver: ContentResolver = reactApplicationContext.contentResolver
        val cursor: Cursor? = contentResolver.query(
            CallLog.Calls.CONTENT_URI,
            null,
            null,
            null,
            null
        )

        cursor?.use {
            while (it.moveToNext()) {
                val callLogMap = Arguments.createMap()
                val id: String? = it.getString(it.getColumnIndex(CallLog.Calls._ID))
                val number: String? = it.getString(it.getColumnIndex(CallLog.Calls.NUMBER))
                if (number != null) {
                    callLogMap.putString("id", id ?: "")
                    callLogMap.putString("number", number)
                    logsTempArray.pushMap(callLogMap)
                }
            }
        }
        promise?.resolve(logsTempArray)
    }
}