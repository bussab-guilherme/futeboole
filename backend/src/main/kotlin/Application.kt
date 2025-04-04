package com.bussab_guilherme

import io.ktor.server.application.*
import com.bussab_guilherme.model.PostgresUserRepository

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    val repo = PostgresUserRepository();

    configureSecurity()
    configureSerialization(repo)
    configureDatabases()
    configureRouting()
}
