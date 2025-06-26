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
    var globalScore = float("global_score").default(0.0f)
    var money = float("money").default(15.0f)
    var player = reference("player", PlayerTable)
    var team = reference("team", TeamTable)
    var playersVoted = array<String>("players_voted").default(emptyList())
}

class UserDAO(id : EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<UserDAO>(UserTable);

    var username by UserTable.username
    var password by UserTable.password
    var globalScore by UserTable.globalScore
    var money by UserTable.money
    var player by PlayerDAO referencedOn UserTable.player
    var team by TeamDAO referencedOn UserTable.team
    var playersVoted by UserTable.playersVoted
}

suspend fun <T> suspendTransaction(block: Transaction.() -> T): T = newSuspendedTransaction(Dispatchers.IO, statement = block)

fun daoToModel(dao : UserDAO) = User(
    dao.username,
    dao.password,
    dao.globalScore,
    dao.money,
    daoToModel(dao.player),
    daoToModel(dao.team),
    dao.playersVoted.toList()
)