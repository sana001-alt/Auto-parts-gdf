# React Native & Hermes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-dontwarn com.facebook.react.**

# Firebase & Google Play Services
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }

# Community & Navigation Native Modules
-keep class com.reactnativecommunity.** { *; }
-keep class com.swmansion.** { *; }

# OkHttp / Networking
-keep class okhttp3.** { *; }
-dontwarn okhttp3.**
-dontwarn okio.**
