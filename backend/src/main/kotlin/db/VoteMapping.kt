package com.bussab_guilherme.db

import com.bussab_guilherme.model.Vote
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable

object VoteTable : IntIdTable("VOTES") {
    var user = varchar("user", 255)
    var player = varchar("player", 255)
    var score = float("score").default(0.0f)
}

class VoteDAO(id : EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<VoteDAO>(VoteTable)
    var user by VoteTable.user
    var player by VoteTable.player
    var score by VoteTable.score
}

fun daoToModel(dao : VoteDAO)  = Vote(
    dao.user,
    dao.player,
    dao.score
)
