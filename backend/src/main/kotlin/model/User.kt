package com.bussab_guilherme.model
import kotlinx.serialization.Serializable
import org.mindrot.jbcrypt.BCrypt

@Serializable
data class User(var username : String, var password : String, var globalScore : Float, var money : Float, var player : Player?, var team: Team?, var playersVoted : List<String> ) {

    fun hashPassword() : String = BCrypt.hashpw(password, BCrypt.gensalt())

    companion object {
        fun verifyPassword(plain: String, hash: String): Boolean {
            return BCrypt.checkpw(plain, hash)
        }
    }
}