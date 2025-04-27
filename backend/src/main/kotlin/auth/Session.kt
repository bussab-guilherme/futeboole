package com.bussab_guilherme.auth

import  kotlinx.serialization.Serializable

@Serializable
data class Session(val userId: String) {

}
