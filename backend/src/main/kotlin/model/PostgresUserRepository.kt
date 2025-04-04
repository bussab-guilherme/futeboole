package com.bussab_guilherme.model

import com.bussab_guilherme.db.UserDAO
import com.bussab_guilherme.db.suspendTransaction
import com.bussab_guilherme.db.daoToModel
import com.bussab_guilherme.db.UserTable
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq
import org.jetbrains.exposed.sql.deleteWhere

class PostgresUserRepository : UserRepository {
    override suspend fun getAllUsers(): List<User> = suspendTransaction {
        UserDAO.all().map(::daoToModel)
    }

    override suspend fun getUserByNusp(id: String): User? = suspendTransaction {
        UserDAO.find {(UserTable.nusp eq id)}.limit(1).map(::daoToModel).firstOrNull();
    }

    override suspend fun addUser(user: User): Unit = suspendTransaction {
        UserDAO.new {
            nusp = user.nusp
            name = user.name
            password = user.password
            score = 0.0f
        }
    }

    override suspend fun deleteUser(id: String): Boolean = suspendTransaction {
        val rowsDeleted = UserTable.deleteWhere { UserTable.nusp eq id }
        rowsDeleted == 1
    }
}