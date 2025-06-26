package com.bussab_guilherme.model
import kotlinx.serialization.Serializable
import org.mindrot.jbcrypt.BCrypt

@Serializable
data class User(var username : String, var password : String, var player : Player?, var team: Team?) {

    fun hashPassword() : String = BCrypt.hashpw(password, BCrypt.gensalt())

    companion object {
        fun verifyPassword(plain: String, hash: String): Boolean {
            val safeHash = when {
                hash.startsWith("$2y$") -> "$2a$" + hash.substring(4)
                hash.startsWith("$2b$") -> "$2a$" + hash.substring(4)
                else                       -> hash
            }
            return BCrypt.checkpw(plain, safeHash)
        }
    }
}