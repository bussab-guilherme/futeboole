package com.bussab_guilherme.model
import kotlinx.serialization.Serializable

@Serializable
data class Player(
    var playerName: String,
    var playerScore: Float = 0.0f,          // VALOR PADRÃO ADICIONADO
    var playerCountScore: Int = 0,          // VALOR PADRÃO ADICIONADO
    var playerPrice: Float = 0.0f           // VALOR PADRÃO ADICIONADO
)