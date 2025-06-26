package com.bussab_guilherme.model

interface TeamRepository {
    suspend fun getTeamByName(teamName : String) : Team?
    suspend fun getAllTeams() : List<Team>
    suspend fun addTeam(team : Team) : Unit
    suspend fun deleteTeam(teamName : String) : Unit
    suspend fun getTeamScore(teamName : String) : Double
    suspend fun addPlayerToTeam(playerName : String, teamName: String) : Unit
    suspend fun deletePlayerFromTeam(playerName : String, teamName: String) : Unit
}