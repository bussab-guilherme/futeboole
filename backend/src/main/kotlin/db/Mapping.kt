package com.bussab_guilherme.db

import kotlinx.coroutines.Dispatchers
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.sql.Transaction
import org.jetbrains.exposed.sql.transactions.experimental.newSuspendedTransaction
import com.bussab_guilherme.model.User

object UserTable : IntIdTable("USERS") {
    var username = varchar("username", 255).uniqueIndex()
    var password = varchar("password", 60)
    var playerScore = float("player_score").default(0.0f)
    var teamScore = float("team_score").default(0.0f)
    var numVotes = integer("num_votes").default(0)
    val team = array<String>("team").default(emptyList())
}

class UserDAO(id : EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<UserDAO>(UserTable);

    var username by UserTable.username
    var password by UserTable.password
    var playerScore by UserTable.playerScore
    var teamScore by UserTable.teamScore
    var numVotes by UserTable.numVotes
    var team by UserTable.team
}

suspend fun <T> suspendTransaction(block: Transaction.() -> T): T = newSuspendedTransaction(Dispatchers.IO, statement = block)

fun daoToModel(dao : UserDAO) = User(
    dao.username,
    dao.password,
    dao.playerScore,
    dao.teamScore,
    dao.numVotes,
    dao.team
)