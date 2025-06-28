package com.bussab_guilherme.model

import com.bussab_guilherme.db.PlayerDAO
import com.bussab_guilherme.db.PlayerTable
import com.bussab_guilherme.db.PlayerTable.playerName
import com.bussab_guilherme.db.TeamDAO
import com.bussab_guilherme.db.TeamTable
import com.bussab_guilherme.db.UserDAO
import com.bussab_guilherme.db.suspendTransaction
import com.bussab_guilherme.db.daoToModel
import com.bussab_guilherme.db.UserTable
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere

object PostgresUserRepository : UserRepository {

    override suspend fun getAllUsers(): List<User> = suspendTransaction {
        UserDAO.all().orderBy(UserTable.globalScore to SortOrder.DESC).map(::daoToModel)
    }

    override suspend fun getUserByUsername(id: String): User? = suspendTransaction {
        UserDAO.find { (UserTable.username eq id) }.limit(1).map(::daoToModel).firstOrNull();
    }

    override suspend fun addUser(user: User): Unit = suspendTransaction {
    UserDAO.new {
        username = user.username
        password = user.hashPassword()

        user.player?.let { playerData ->
            // Garante que o nome do jogador não seja vazio
            if (playerData.playerName.isNotBlank()) {
                this.player = PlayerDAO.new {
                    playerName = playerData.playerName
                }
            }
        }

        user.team?.let { teamData ->
            if (teamData.teamName.isNotBlank()) {
                this.team = TeamDAO.new {
                    teamName = teamData.teamName
                }
            }
        }
    }
}

    override suspend fun checkUsername(id: String): Boolean {
        return suspendTransaction { UserDAO.find { (UserTable.username eq id) }.empty() }
    }

    override suspend fun deleteUser(id: String): Boolean = suspendTransaction {
        val rowsDeleted = UserTable.deleteWhere { UserTable.username eq id }
        rowsDeleted == 1
    }

    override suspend fun registerPlayer(username: String) = suspendTransaction {
        val userDao = UserDAO.find { UserTable.username eq username }.first()
        userDao.player = PlayerDAO.new { playerName = username }
    }

    override suspend fun deletePlayer(username: String) = suspendTransaction {
        val userDao = UserDAO.find { UserTable.username eq username }.first()
        userDao.player.delete()
    }

    override suspend fun updateUsersGlobalScore(): Unit = suspendTransaction {
        UserDAO.all().forEach { user ->
            val teamScore = daoToModel(user).team?.getTeamScore() ?: 0.0
            user.globalScore += teamScore.toFloat()
        }
    }

    override suspend fun updateUserMoney(username: String, amount: Float): Unit = suspendTransaction {
        UserDAO.find { UserTable.username eq username }.first().money += amount
    }

    override suspend fun updateUserPlayersVoted(username: String, playerName: String) : Unit = suspendTransaction {
        UserDAO.find { UserTable.username eq username }.first().playersVoted = UserDAO.find { UserTable.username eq username }.first().playersVoted.plus(playerName)
    }

    override suspend fun resetUsersPlayersVoted() : Unit = suspendTransaction {
        UserDAO.all().forEach { user ->
            user.playersVoted = emptyList()
        }
    }
}
