package com.bussab_guilherme.model
import kotlinx.serialization.Serializable
import org.mindrot.jbcrypt.BCrypt

@Serializable
data class User(var username : String, var password : String, var playerScore : Float, var teamScore : Float, var numVotes : Int, var team : List<String>) {


    fun hashPassword() : String = BCrypt.hashpw(password, BCrypt.gensalt())

    companion object {
        fun verifyPassword(plain: String, hash : String): Boolean = BCrypt.checkpw(plain, hash)
    }
}