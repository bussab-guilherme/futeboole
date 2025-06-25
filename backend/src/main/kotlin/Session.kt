package com.bussab_guilherme

import com.bussab_guilherme.auth.Session
import com.bussab_guilherme.model.PostgresUserRepository

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.auth.*
import io.ktor.server.response.*
import io.ktor.server.sessions.*

fun Application.configureSessionAuthentication() {
    val secure = environment.config.propertyOrNull("ktor.deployment.secureCookie")?.getString()?.toBoolean() ?: false
    install(Sessions) {
        cookie<Session>("SESSION") {
            cookie.httpOnly = true
            cookie.extensions["SameSite"] = "lax"
            cookie.secure = secure

        }
    }

    install(Authentication) {
        session<Session>("auth-session") {
            validate { session ->
                PostgresUserRepository.getUserByUsername(session.userId)?.let { UserIdPrincipal(it.username) }
            }
            challenge {

                call.respond(HttpStatusCode.Unauthorized)
                //call.respondRedirect("/login");
            }
        }
        session<Session>("adm-session") {
            validate { session ->
                if (session.userId == "admin") UserIdPrincipal(session.userId)
                else null
            }
            challenge {
                call.respond(HttpStatusCode.Unauthorized, "Admin credentials required")
            }
        }
    }
}