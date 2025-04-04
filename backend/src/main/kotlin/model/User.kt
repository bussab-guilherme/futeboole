package com.bussab_guilherme.model
import kotlinx.serialization.Serializable

@Serializable
data class User(var nusp : String, var name : String, var password : String, var score : Float) {

}