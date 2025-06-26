package com.bussab_guilherme.model

import com.bussab_guilherme.db.PlayerDAO
import com.bussab_guilherme.db.PlayerTable
import com.bussab_guilherme.db.daoToModel
import com.bussab_guilherme.db.suspendTransaction
import org.jetbrains.exposed.sql.SortOrder
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere

object PostgresPlayerRepository : PlayerRepository {
    override suspend fun getPlayerByName(playerName: String): Player? = suspendTransaction {
        PlayerDAO.find { PlayerTable.playerName eq playerName }.limit(1).map(::daoToModel).firstOrNull()
    }

    override suspend fun getAllPlayers(): List<Player> = suspendTransaction {
        PlayerDAO.all().orderBy(PlayerTable.playerScore to SortOrder.DESC).map(::daoToModel)
    }

    override suspend fun addPlayer(player: Player): Unit = suspendTransaction {
        PlayerDAO.new {
            playerName = player.playerName
            playerScore = player.playerScore
            numVotes = player.numVotes
        }
    }

    override suspend fun deletePlayer(playerName: String): Unit = suspendTransaction {
        val rowsDeleted = PlayerTable.deleteWhere { PlayerTable.playerName eq playerName }
        rowsDeleted == 1
    }
}