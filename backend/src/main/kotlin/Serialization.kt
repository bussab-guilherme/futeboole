package com.bussab_guilherme

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
import java.sql.Connection
import java.sql.DriverManager
import org.jetbrains.exposed.sql.*
import com.bussab_guilherme.model.UserRepository
import com.bussab_guilherme.model.User
import io.ktor.serialization.*

fun Application.configureSerialization(repo : UserRepository) {
    install(ContentNegotiation) {
        json()
    }

    routing {
        route("/api/users") {
            get {
                val users = repo.getAllUsers()
                call.respond(users)
            }
            get ("/byNusp/{id}") {
                val id = call.parameters["id"]?.toString()
                if (id != null) {
                    val user = repo.getUserByNusp(id)
                    if (user != null) {
                        call.respond(user)
                    } else {
                        call.respond(HttpStatusCode.NotFound)
                    }
                } else {
                    call.respond(HttpStatusCode.BadRequest, "Invalid NUSP")
                }
            }
            post {
                try {
                    val user = call.receive<User>()
                    repo.addUser(user);
                    call.respond(HttpStatusCode.Created, user)
                } catch (e: IllegalArgumentException) {
                    call.respond(HttpStatusCode.BadRequest, "Invalid user data")
                } catch (e: JsonConvertException) {
                    call.respond(HttpStatusCode.InternalServerError, "Internal server error")
                }
            }
            // put("/byNusp/{id}") {
            //     val id = call.parameters["id"]?.toString()
            //     val user = call.receive<User>()
            //     if (id != null && repo.updateUser(user)) {
            //         call.respond(HttpStatusCode.OK, user)
            //     } else {
            //         call.respond(HttpStatusCode.NotFound)
            //     }
            // }
            delete("/{id}") {
                val id = call.parameters["id"]?.toString()
                if (id != null && repo.deleteUser(id)) {
                    call.respond(HttpStatusCode.NoContent)
                } else {
                    call.respond(HttpStatusCode.NotFound)
                }
            }
        }
    }
}
