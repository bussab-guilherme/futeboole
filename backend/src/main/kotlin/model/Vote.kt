package com.bussab_guilherme.model

import kotlinx.serialization.Serializable

@Serializable
data class Vote(var user : String, var player : String, var score : Float) {
}