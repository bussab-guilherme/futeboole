package com.bussab_guilherme.db

import com.bussab_guilherme.model.Player
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object PlayerTable : IntIdTable("PLAYERS") {
    var playerName = varchar("playername", 255).uniqueIndex()
    var playerScore = float("player_score").default(0.0f)
    var playerCountScore = integer("player_count_score").default(0)
    var playerPrice = float("player_price").default(7.0f)
}

class PlayerDAO(id : EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<PlayerDAO>(PlayerTable);

    var playerName by PlayerTable.playerName
    var playerScore by PlayerTable.playerScore
    var playerCountScore by PlayerTable.playerCountScore
    var playerPrice by PlayerTable.playerPrice
}

fun daoToModel(dao : PlayerDAO) = Player(
    dao.playerName,
    dao.playerScore,
    dao.playerCountScore,
    dao.playerPrice
)