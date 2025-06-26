package com.bussab_guilherme.db

import com.bussab_guilherme.model.Player
import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.sql.Transaction
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction

object PlayerTable : IntIdTable("PLAYERS") {
    var playerName = varchar("playername", 255).uniqueIndex()
    var playerScore = float("player_score").default(0.0f)
    var numVotes = integer("num_votes").default(0)
}

class PlayerDAO(id : EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<PlayerDAO>(PlayerTable);

    var playerName by PlayerTable.playerName
    var playerScore by PlayerTable.playerScore
    var numVotes by PlayerTable.numVotes
}

fun daoToModel(dao : PlayerDAO) = Player(
    dao.playerName,
    dao.playerScore,
    dao.numVotes
)