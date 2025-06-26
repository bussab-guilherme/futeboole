package com.bussab_guilherme.model

import com.bussab_guilherme.db.PlayerDAO
import com.bussab_guilherme.db.PlayerTable
import com.bussab_guilherme.db.TeamDAO
import com.bussab_guilherme.db.TeamTable
import com.bussab_guilherme.db.daoToModel
import com.bussab_guilherme.db.suspendTransaction
import org.jetbrains.exposed.sql.SizedCollection
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere

object PostgresTeamRepository : TeamRepository {
    override suspend fun getTeamByName(teamName: String): Team? = suspendTransaction {
        TeamDAO.find { TeamTable.teamName eq teamName }.limit(1).map(::daoToModel).firstOrNull()
    }

    override suspend fun getAllTeams(): List<Team> = suspendTransaction {
        TeamDAO.all().map(::daoToModel).sortedBy { it.getTeamScore() }
    }

    override suspend fun addTeam(team: Team): Unit = suspendTransaction {
        TeamDAO.new {
            teamName = team.teamName
        }
    }

    override suspend fun deleteTeam(teamName: String): Unit = suspendTransaction {
        val rowsDeleted = TeamTable.deleteWhere { TeamTable.teamName eq teamName }
        rowsDeleted == 1
    }

    override suspend fun getTeamScore(teamName: String): Double = suspendTransaction {
        TeamDAO.find { TeamTable.teamName eq teamName }.map(::daoToModel).first().getTeamScore()
    }

    override suspend fun addPlayerToTeam(playerName: String, teamName: String): Unit = suspendTransaction {
        val teamDao = TeamDAO.find { TeamTable.teamName eq  teamName }.first()
        val playerDao = PlayerDAO.find { PlayerTable.playerName eq playerName }.first()

        teamDao.players = SizedCollection(teamDao.players.toList().plus(playerDao))
    }

    override suspend fun deletePlayerFromTeam(playerName: String, teamName: String): Unit = suspendTransaction {
        val teamDao = TeamDAO.find { TeamTable.teamName eq  teamName }.first()
        val playerDao = PlayerDAO.find { PlayerTable.playerName eq playerName }.first()

        teamDao.players = SizedCollection(teamDao.players.toList().minus(playerDao))
    }
}