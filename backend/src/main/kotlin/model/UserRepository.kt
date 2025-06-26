package com.bussab_guilherme.model

interface UserRepository {
    suspend fun getUserByUsername(id: String): User?
    suspend fun getAllUsers(): List<User>
    suspend fun addUser(user: User)
    suspend fun checkUsername(id: String): Boolean
    suspend fun deleteUser(id: String): Boolean
    suspend fun registerPlayer(username : String) : Unit
    suspend fun deletePlayer(username : String) : Unit
    suspend fun updateUsersGlobalScore() : Unit
    suspend fun updateUserMoney(username : String, amount : Float) : Unit
    suspend fun updateUserPlayersVoted(username : String, playerName : String) : Unit
    suspend fun resetUsersPlayersVoted() : Unit
}