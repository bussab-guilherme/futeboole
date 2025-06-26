package com.bussab_guilherme

import com.bussab_guilherme.db.PlayerDAO
import com.bussab_guilherme.db.PlayerTable
import com.bussab_guilherme.db.TeamPlayersTable
import com.bussab_guilherme.db.TeamTable
import com.bussab_guilherme.db.UserTable
import com.bussab_guilherme.model.Player
import com.bussab_guilherme.model.PostgresUserRepository
import com.bussab_guilherme.model.Team
import com.bussab_guilherme.model.User
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.coroutines.launch
import java.sql.Connection
import java.sql.DriverManager
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.StdOutSqlLogger
import org.jetbrains.exposed.sql.addLogger
import org.jetbrains.exposed.sql.transactions.transaction

fun Application.configureDatabases(recreate: Boolean = false) {
    Database.connect(
        "jdbc:postgresql://localhost:5432/main_db",
        user = "postgres",
        password = "password"
    )

    transaction {
        addLogger(StdOutSqlLogger)
        if (recreate) {
            SchemaUtils.drop(UserTable)
            SchemaUtils.drop(TeamPlayersTable)
            SchemaUtils.drop(PlayerTable)
            SchemaUtils.drop(TeamTable)
        }
        SchemaUtils.createMissingTablesAndColumns(UserTable)
        SchemaUtils.createMissingTablesAndColumns(PlayerTable)
        SchemaUtils.createMissingTablesAndColumns(TeamTable)
        SchemaUtils.createMissingTablesAndColumns(TeamPlayersTable)
    }

    val adminUsername = "admin"
    val adminEmail = "bucho@bussab"
    this.launch {
        if (recreate || !PostgresUserRepository.checkUsername(adminUsername)) {
            val adminUser = User(
                username = adminUsername,
                password = adminEmail,
                player = Player(adminUsername, 0.0f, 0),
                team = Team("adminTeam", emptyList())
            )
            PostgresUserRepository.addUser(adminUser)
        }
    }
}

