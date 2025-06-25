package com.bussab_guilherme.model

import com.bussab_guilherme.db.UserDAO
import com.bussab_guilherme.db.suspendTransaction
import com.bussab_guilherme.db.daoToModel
import com.bussab_guilherme.db.UserTable
import org.h2.util.SortedProperties
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere

object PostgresUserRepository : UserRepository {

    override suspend fun getAllUsers(): List<User> = suspendTransaction {
        UserDAO.all().orderBy(UserTable.teamScore to SortOrder.DESC).map(::daoToModel)
    }

    override suspend fun getUserByUsername(id: String): User? = suspendTransaction {
        UserDAO.find {(UserTable.username eq id)}.limit(1).map(::daoToModel).firstOrNull();
    }

    override suspend fun addUser(user: User): Unit = suspendTransaction {
        UserDAO.new {
            username = user.username
            password = user.password
            playerScore = user.playerScore
            teamScore = user.teamScore
            numVotes = user.numVotes
            team = user.team
        }
    }

    override suspend fun checkUsername(id: String): Boolean {
        return suspendTransaction { UserDAO.find {(UserTable.username eq id)}.empty() }
    }

    override suspend fun deleteUser(id: String): Boolean = suspendTransaction {
        val rowsDeleted = UserTable.deleteWhere { UserTable.username eq id }
        rowsDeleted == 1
    }
}