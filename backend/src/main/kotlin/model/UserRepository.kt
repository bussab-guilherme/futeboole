package com.bussab_guilherme.model

interface UserRepository {
    suspend fun getUserByNusp(id: String): User?
    suspend fun getAllUsers(): List<User>
    suspend fun addUser(user: User)
    //suspend fun updateUser(user: User): Boolean
    suspend fun deleteUser(id: String): Boolean
}