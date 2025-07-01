package com.bussab_guilherme.model
import kotlinx.serialization.Serializable

@Serializable
data class Team(
    var teamName: String,
    var players: List<Player> = emptyList() // VALOR PADRÃO ADICIONADO
) {
    fun getTeamScore(): Double {
        return players.sumOf { it.playerScore.toDouble() }
    }
}