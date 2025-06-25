package com.bussab_guilherme

import com.bussab_guilherme.db.UserTable
import com.bussab_guilherme.model.User
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class ApplicationTest {

    @BeforeTest
    fun setup() {
        Database.connect(
            "jdbc:h2:mem:test;DB_CLOSE_DELAY=-1;",
            driver = "org.h2.Driver"
        )
        transaction {
            SchemaUtils.create(UserTable)
        }
    }

    @Test
    fun testGetAllUsers() = testApplication {
        application {
            configureSecurity()
            configureSessionAuthentication()
            configureSerialization()
            configureRouting()
        }

        val response = client.get("/api/users")
        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals(
            ContentType.Application.Json.withCharset(Charsets.UTF_8).toString(),
            response.contentType()?.toString()
        )
        assertEquals("[]", response.bodyAsText())
    }

    @Test
    fun testRegister() = testApplication {
        application {
            configureSecurity()
            configureSessionAuthentication()
            configureSerialization()
            configureRouting()
        }

        val newUser = User(username = "john", password = "secret123", playerScore = 0.0f, teamScore = 0.0f, numVotes = 0, team = emptyList())
        val jsonBody = Json.encodeToString(newUser)

        val regResponse = client.post("/api/users/register") {
            contentType(ContentType.Application.Json)
            setBody(jsonBody)
        }
        assertEquals(HttpStatusCode.Created, regResponse.status)

        val getResponse = client.get("/api/users/byUsername/john")
        assertEquals(HttpStatusCode.OK, getResponse.status)

        val returnedUser = Json.decodeFromString<User>(getResponse.bodyAsText())
        assertEquals("john", returnedUser.username)
        assertTrue(returnedUser.password.isNotEmpty() && User.verifyPassword("secret123", returnedUser.password))
    }

    @Test
    fun testFlow() = testApplication {
        application {
            configureSecurity()
            configureSessionAuthentication()
            configureSerialization()
            configureRouting()
        }

        // register
        val user = User(username = "alice", password = "passw0rd", playerScore = 0.0f, teamScore = 0.0f, numVotes = 0, team = emptyList())
        client.post("/api/users/register") {
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(user))
        }

        // login
        val loginResponse = client.post("/api/users/login") {
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(user))
        }
        assertEquals(HttpStatusCode.OK, loginResponse.status)
        val rawCookie = loginResponse.headers[HttpHeaders.SetCookie] ?: error("Missing Set-Cookie header")
        val sessionCookie = rawCookie.substringBefore(';')

        // authorized
        val profileResponse = client.get("/api/users/profile") {
            header(HttpHeaders.Cookie, sessionCookie)
        }
        assertEquals(HttpStatusCode.OK, profileResponse.status)
        assertEquals("Hello, alice. This is your profile.", profileResponse.bodyAsText())

        // logout
        val logoutResponse = client.post("/api/users/logout") {
            header(HttpHeaders.Cookie, sessionCookie)
        }
        assertEquals(HttpStatusCode.OK, logoutResponse.status)

        // unauthorized
        val postLogoutProfile = client.get("/api/users/profile")
        assertEquals(HttpStatusCode.Unauthorized, postLogoutProfile.status)
    }

    @Test
    fun testDelete() = testApplication {
        application {
            configureSecurity()
            configureSessionAuthentication()
            configureSerialization()
            configureRouting()
        }

        val user = User(username = "bob", password = "1234", playerScore = 0.0f, teamScore = 0.0f, numVotes = 0, team = emptyList())
        client.post("/api/users/register") {
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(user))
        }

        val deleteResponse = client.delete("/api/users/byUsername/bob")
        assertEquals(HttpStatusCode.NoContent, deleteResponse.status)

        val getAfterDelete = client.get("/api/users/byUsername/bob")
        assertEquals(HttpStatusCode.NotFound, getAfterDelete.status)
    }
}
