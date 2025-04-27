package com.bussab_guilherme.model

interface UserRepository {
    suspend fun getUserByUsername(id: String): User?
    suspend fun getAllUsers(): List<User>
    suspend fun addUser(user: User)
    suspend fun checkUsername(id: String): Boolean
    suspend fun deleteUser(id: String): Boolean
}