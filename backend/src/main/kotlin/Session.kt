package com.bussab_guilherme

import com.bussab_guilherme.auth.Session
import com.bussab_guilherme.model.PostgresUserRepository
import io.ktor.server.application.*
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.UserIdPrincipal
import io.ktor.server.auth.session
import io.ktor.server.response.respondRedirect
import io.ktor.server.sessions.Sessions
import io.ktor.server.sessions.cookie

fun Application.configureSessionAuthentication() {
    install(Sessions) {
        cookie<Session>("SESSION") {
            cookie.httpOnly = true
            cookie.extensions["SameSite"] = "lax"
            cookie.secure = this@configureSessionAuthentication.environment.config.property("ktor.deployment.secureCookie").getString().toBoolean()
        }
    }

    install(Authentication) {
        session<Session>("auth-session") {
            validate { session ->
                PostgresUserRepository.getUserByUsername(session.userId)?.let { UserIdPrincipal(it.username) }
            }
            challenge {
                call.respondRedirect("/login");
            }
        }
    }
}