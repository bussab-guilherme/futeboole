package com.bussab_guilherme.model

import kotlinx.serialization.Serializable

@Serializable
data class Player(var playerName : String, var playerScore : Float, var playerCountScore : Int, var playerPrice : Float) {
}