package com.bussab_guilherme

import com.bussab_guilherme.auth.Session
import com.bussab_guilherme.db.UserDAO
import com.bussab_guilherme.db.UserTable
import com.bussab_guilherme.marketSystem.Market
import com.bussab_guilherme.marketSystem.Round
import com.bussab_guilherme.model.PlayerRepository
import com.bussab_guilherme.model.PostgresPlayerRepository
import com.bussab_guilherme.model.PostgresTeamRepository
import com.bussab_guilherme.model.PostgresUserRepository
import com.bussab_guilherme.model.ApiResponse
import com.bussab_guilherme.model.PostgresVoteRepository
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import com.bussab_guilherme.model.User
import com.bussab_guilherme.model.Vote
import com.bussab_guilherme.model.VoteRepository
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
            get ("/players") {
                if (Market.isOpen()) {
                    call.respond(HttpStatusCode.BadRequest, "Market Open at the Moment")
                }
                val players = PostgresPlayerRepository.getAllPlayers()
                call.respond(players)
            }
            post("/register") {
                try {
                    val payload = call.receive<User>()
                    if (PostgresUserRepository.checkUsername(payload.username)) {
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
                get("/me") {
                    val principal = call.authentication.principal<UserIdPrincipal>()
                    if (principal == null) {
                        call.respond(HttpStatusCode.Unauthorized, "No authenticated user")
                        return@get
                    }
                    val user = PostgresUserRepository.getUserByUsername(principal.name)
                    if (user == null) {
                        call.respond(HttpStatusCode.NotFound, "User not found")
                        return@get
                    }
                    call.respond(user)
                }
                
                get("/profile") {
                    val principal = call.authentication.principal<UserIdPrincipal>()!!
                    call.respond(HttpStatusCode.OK, principal.name)
                }
                put("/registerPlayer") {
                    val principal = call.authentication.principal<UserIdPrincipal>()!!
                    PostgresUserRepository.registerPlayer(principal.name)
                }
                put("/deletePlayer") {
                    val principal = call.authentication.principal<UserIdPrincipal>()!!
                    PostgresUserRepository.deleteUser(principal.name)
                }
                put("/addToTeam/{playerName}") {
                    val playerName = call.parameters["playerName"]
                    if (!playerName.isNullOrEmpty()) {
                        val principal = call.authentication.principal<UserIdPrincipal>()!!
                        val user = PostgresUserRepository.getUserByUsername(principal.name)!!
                        val player = PostgresPlayerRepository.getPlayerByName(playerName)
                        
                        if (user.team != null && player != null && user.money >= player.playerPrice) {
                            PostgresTeamRepository.addPlayerToTeam(playerName, user.team!!.teamName)
                            PostgresUserRepository.updateUserMoney(principal.name, -player.playerPrice)
                            val updatedUser = PostgresUserRepository.getUserByUsername(principal.name)!!
                            
                            // MODIFICADO: Use a data class para responder
                            val response = ApiResponse(
                                message = "Player $playerName added to team ${user.team!!.teamName}",
                                newMoney = updatedUser.money
                            )
                            call.respond(HttpStatusCode.OK, response)
                            
                        } else {
                            // Verificação de erro mais específica
                            if (user.team == null) call.respond(HttpStatusCode.BadRequest, "User has no team")
                            else if (player == null) call.respond(HttpStatusCode.BadRequest, "Player not found")
                            else call.respond(HttpStatusCode.BadRequest, "Not enough money")
                        }
                    } else {
                        call.respond(HttpStatusCode.BadRequest, "Invalid Player Name")
                    }
                }
                put("/deleteFromTeam/{playerName}") {
                    val playerName = call.parameters["playerName"]
                    if (!playerName.isNullOrEmpty()) {
                        val principal = call.authentication.principal<UserIdPrincipal>()!!
                        val user = PostgresUserRepository.getUserByUsername(principal.name)!!
                        val player = PostgresPlayerRepository.getPlayerByName(playerName)
                        
                        if (user.team != null && player != null) {
                            PostgresTeamRepository.deletePlayerFromTeam(playerName, user.team!!.teamName)
                            PostgresUserRepository.updateUserMoney(principal.name, player.playerPrice)
                            val updatedUser = PostgresUserRepository.getUserByUsername(principal.name)!!

                            // MODIFICADO: Use a data class para responder
                            val response = ApiResponse(
                                message = "Player $playerName deleted from team ${user.team!!.teamName}",
                                newMoney = updatedUser.money
                            )
                            call.respond(HttpStatusCode.OK, response)
                            
                        } else {
                                if (user.team == null) call.respond(HttpStatusCode.BadRequest, "User has no team")
                                else call.respond(HttpStatusCode.BadRequest, "Player not found in team")
                        }
                    } else {
                        call.respond(HttpStatusCode.BadRequest, "Invalid Player Name")
                    }
                }
                put("/giveScoreToPlayer/{playerName}/{score}") {
                    val playerName = call.parameters["playerName"]
                    val score = call.parameters["score"]
                    val principal = call.authentication.principal<UserIdPrincipal>()!!
                    val user = PostgresUserRepository.getUserByUsername(principal.name)!!
                    if (!playerName.isNullOrEmpty() && !score.isNullOrEmpty()) {
                        val vote = Vote(user.username, playerName, score.toFloat())
                        if (!PostgresVoteRepository.containsVote(vote)) {
                            PostgresVoteRepository.addVote(vote)
                            PostgresPlayerRepository.updatePlayerScore(playerName, score.toFloat())
                            call.respond(HttpStatusCode.OK)
                        }
                        else {
                            call.respond(HttpStatusCode.BadRequest, "Voto já foi computado")
                        }
                    } else {
                        call.respond(HttpStatusCode.BadRequest, "Invalid Player Name or Score")
                    }
                }
                get("/votes") {
                    val principal = call.authentication.principal<UserIdPrincipal>()!!
                    val votes = PostgresVoteRepository.getVotesByUser(principal.name)
                    call.respond(votes)
                }
            }

            delete("/byUsername/{username}") {
                val id = call.parameters["username"]
                if (id != null && PostgresUserRepository.deleteUser(id)) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
        }
        route("api/market") {
            get ("/playerPrice/{username}") {
                val id = call.parameters["username"]
                if (id != null) {
                    val player = PostgresPlayerRepository.getPlayerByName(id)
                    if (player != null) {
                        if (Market.isOpen()) {
                            call.respond(Market.getPlayerPrice(player))
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
            get ("/allPlayersPrice") {
                if (!Market.isOpen()) {
                    call.respond(HttpStatusCode.BadRequest, "Market Not Open at the Moment")
                }
                val players = PostgresPlayerRepository.getAllPlayers()
                call.respond(Market.getPlayersValue(players))
            }
            get ("/teamScore/{teamName}") {
                val teamName = call.parameters["teamName"]
                if (!teamName.isNullOrEmpty()) {
                    val team = PostgresTeamRepository.getTeamByName(teamName)
                    if (team != null) {
                        call.respond(team.getTeamScore())
                    }
                }
            }
        }
        authenticate("adm-session") {
            route("/api/round") {
                post("/create") {
                    Round.create()
                    PostgresPlayerRepository.resetPlayersScore()
                    PostgresVoteRepository.resetVotes()
                    call.respond(HttpStatusCode.OK)
                }
                post("/over") {
                    PostgresPlayerRepository.updatePlayersPrice()
                    PostgresUserRepository.updateUsersGlobalScore()
                    Round.getCurrent().setRoundOver()
                    call.respond(HttpStatusCode.OK)
                }
            }
        }
    }
}
