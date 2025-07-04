package com.bussab_guilherme.model

interface PlayerRepository {
    suspend fun getPlayerByName(playerName : String) : Player?
    suspend fun getAllPlayers() : List<Player>
    suspend fun addPlayer(player : Player) : Unit
    suspend fun deletePlayer(playerName : String) : Unit
    suspend fun updatePlayerScore(playerName : String, scoreToAdd : Float) : Unit
    suspend fun resetPlayersScore() : Unit
    suspend fun updatePlayersPrice() : Unit
}