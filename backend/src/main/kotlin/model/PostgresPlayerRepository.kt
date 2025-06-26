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
            playerCountScore = 0
            playerPrice = player.playerPrice
        }
    }

    override suspend fun deletePlayer(playerName: String): Unit = suspendTransaction {
        val rowsDeleted = PlayerTable.deleteWhere { PlayerTable.playerName eq playerName }
        rowsDeleted == 1
    }

    override suspend fun updatePlayerScore(playerName: String, scoreToAdd: Float) : Unit = suspendTransaction {
        val score = PlayerDAO.find { PlayerTable.playerName eq playerName }.first().playerScore
        val countScore = PlayerDAO.find { PlayerTable.playerName eq playerName }.first().playerCountScore
        val newScore = (score * countScore + scoreToAdd) / (countScore + 1)
        PlayerDAO.find { PlayerTable.playerName eq playerName }.first().playerScore = newScore
        PlayerDAO.find { PlayerTable.playerName eq playerName }.first().playerCountScore = countScore + 1
    }

    override suspend fun resetPlayersScore() = suspendTransaction {
        PlayerDAO.all().forEach { player ->
            player.playerScore = 0.0f
            player.playerCountScore = 0
        }
    }

    override  suspend fun updatePlayersPrice() : Unit = suspendTransaction {
        val dummy = 2.0f
        PlayerDAO.all().forEach { player ->
            val diff = PlayerDAO.find { PlayerTable.playerName eq player.playerName }.first().playerScore - 5.0f
            val newValue = 1.0f.coerceAtLeast(dummy * diff + PlayerDAO.find { PlayerTable.playerName eq player.playerName }.first().playerPrice)
            PlayerDAO.find { PlayerTable.playerName eq player.playerName }.first().playerPrice = newValue
        }
    }
}