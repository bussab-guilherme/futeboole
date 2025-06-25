package com.bussab_guilherme

import com.bussab_guilherme.auth.Session
import com.bussab_guilherme.db.UserDAO
import com.bussab_guilherme.db.UserTable
import com.bussab_guilherme.marketSystem.Market
import com.bussab_guilherme.marketSystem.Round
import com.bussab_guilherme.model.PostgresUserRepository
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import com.bussab_guilherme.model.User
import io.ktor.server.auth.UserIdPrincipal
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.authentication
import io.ktor.server.sessions.clear
import io.ktor.server.sessions.sessions
import io.ktor.server.sessions.set
import org.jetbrains.exposed.sql.transactions.transaction

fun Application.configureSerialization() {
    install(ContentNegotiation) {
        json()
    }

    routing {
        route("/api/users") {
            get {
                val users = PostgresUserRepository.getAllUsers()
                call.respond(users)
            }
            get ("/byUsername/{id}") {
                val id = call.parameters["id"]
                if (id != null) {
                    val user = PostgresUserRepository.getUserByUsername(id)
                    if (user != null) {
                        call.respond(user)
                    } else {
                        call.respond(HttpStatusCode.NotFound)
                    }
                } else {
                    call.respond(HttpStatusCode.BadRequest, "Invalid Username")
                }
            }
            post("/register") {
                try {
                    val payload = call.receive<User>()
                    if (PostgresUserRepository.checkUsername(payload.username)) {
                        val hash = payload.hashPassword()
                        payload.password = hash
                        PostgresUserRepository.addUser(payload)
                        call.respond(HttpStatusCode.Created, payload)
                    } else {
                        call.respond(HttpStatusCode.Conflict, "Username is already taken")
                    }
                } catch (e: Exception) {
                    call.respond(HttpStatusCode.BadRequest, e.message ?: "Something went wrong")
                }

            }
            post("/login") {
                val payload = call.receive<User>()
                val user = transaction { UserDAO.find { UserTable.username eq payload.username}.singleOrNull() }

                if (user != null && User.verifyPassword(payload.password, user.password)) {
                    call.sessions.set(Session(user.username))
                    call.respond(HttpStatusCode.OK, "Successfully logged in")
                } else {
                    call.respond(HttpStatusCode.BadRequest, "Invalid credentials")
                }
            }
            post("/logout") {
                call.sessions.clear<Session>()
                call.respond(HttpStatusCode.OK, "Successfully logged out")
            }
            authenticate("auth-session") {
                get("/profile") {
                    val principal = call.authentication.principal<UserIdPrincipal>()!!
                    call.respond(HttpStatusCode.OK, "Hello, ${principal.name}. This is your profile.")
                }
            }

            delete("/byUsername/{id}") {
                val id = call.parameters["id"]
                if (id != null && PostgresUserRepository.deleteUser(id)) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
        }
        route("api/market") {
            get ("/userValue/{id}") {
                val id = call.parameters["id"]
                if (id != null) {
                    val user = PostgresUserRepository.getUserByUsername(id)
                    if (user != null) {
                        if (Market.isOpen()) {
                            call.respond(Market.getPlayerValue(user))
                        } else {
                            call.respond(HttpStatusCode.BadRequest, "Market Not Open at the Moment")
                        }
                    } else {
                        call.respond(HttpStatusCode.NotFound)
                    }
                } else {
                    call.respond(HttpStatusCode.BadRequest, "Invalid Username")
                }
            }
            get ("/allUsersValue") {
                if (!Market.isOpen()) {
                    call.respond(HttpStatusCode.BadRequest, "Market Not Open at the Moment")
                }
                val users = PostgresUserRepository.getAllUsers()
                call.respond(Market.getPlayersValue(users))
            }
        }
        authenticate("adm-session") {
            route("/api/round") {
                post("/create") {
                    Round.create()
                    call.respond(HttpStatusCode.OK)
                }
                post("/incrementVote") {
                    if (Round.getCurrent().incrementTotalVoteCount())
                        call.respond(HttpStatusCode.OK)
                    else
                        call.respond(HttpStatusCode.BadRequest, "Round is over")
                }
                post("/reset") {
                    if (Round.getCurrent().resetTotalVoteCount())
                        call.respond(HttpStatusCode.OK)
                    else
                        call.respond(HttpStatusCode.BadRequest, "Round is over")
                }
                post("/over") {
                    Round.getCurrent().setRoundOver()
                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}
