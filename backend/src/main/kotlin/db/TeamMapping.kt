package com.bussab_guilherme.db

import com.bussab_guilherme.model.Team
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.Table

object TeamTable : IntIdTable("TEAMS") {
    val teamName = varchar("teamname", 255).uniqueIndex()
}

class TeamDAO(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<TeamDAO>(TeamTable)

    var teamName by TeamTable.teamName
    var players by PlayerDAO via TeamPlayersTable
}

fun daoToModel(dao : TeamDAO) = Team(
    dao.teamName,
    dao.players.map { daoToModel(it) }
)

object TeamPlayersTable : Table("TEAM_PLAYERS") {
    val team = reference("team_id", TeamTable)
    val player = reference("player_id", PlayerTable)
    override val primaryKey = PrimaryKey(team, player)
}