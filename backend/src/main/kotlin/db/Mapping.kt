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
    var nusp = varchar("nusp", 8).uniqueIndex();
    var name = varchar("name", 50);
    var password = varchar("password", 50);
    var score = float("score").default(0.0f);
}

class UserDAO(id : EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<UserDAO>(UserTable);

    var name by UserTable.name
    var nusp by UserTable.nusp
    var password by UserTable.password  
    var score by UserTable.score
}

suspend fun <T> suspendTransaction(block: Transaction.() -> T): T = newSuspendedTransaction(Dispatchers.IO, statement = block);

fun daoToModel(dao : UserDAO) = User(
    dao.nusp,
    dao.name,
    dao.password,
    dao.score
)