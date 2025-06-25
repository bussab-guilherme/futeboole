package com.bussab_guilherme

import io.ktor.server.application.*
import com.bussab_guilherme.model.PostgresUserRepository
import io.ktor.http.HttpStatusCode
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.request.ContentTransformationException
import io.ktor.server.request.uri

fun main(args: Array<String>) {
    io.ktor.server.netty.EngineMain.main(args)
}

fun Application.module() {
    configureSecurity()
    configureSessionAuthentication()
    configureSerialization()
    configureDatabases()
    configureRouting()
}
