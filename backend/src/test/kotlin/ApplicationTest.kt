package com.bussab_guilherme

import com.bussab_guilherme.db.*
import com.bussab_guilherme.model.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction
import kotlin.test.BeforeTest
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue
import kotlinx.coroutines.runBlocking

class ApplicationTest {

    @BeforeTest
    fun setup() {
        Database.connect("jdbc:h2:mem:test;DB_CLOSE_DELAY=-1;", driver = "org.h2.Driver")
        transaction {
            SchemaUtils.drop(UserTable, PlayerTable, TeamTable, TeamPlayersTable, VoteTable)
            SchemaUtils.create(UserTable, PlayerTable, TeamTable, TeamPlayersTable, VoteTable)
        }
    }

    // ... (os testes testGetAllUsers, testRegister, testFlow, testDelete permanecem os mesmos) ...
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

        val newUser = User(
            username = "john",
            password = "secret123",
            player = Player("john"),
            team = Team("John's Team", emptyList())
        )
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
        assertTrue(User.verifyPassword("secret123", returnedUser.password))
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
        val user = User(
            username = "alice",
            password = "passw0rd",
            player = Player("alice"),
            team = Team("Alice's Team", emptyList())
        )
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
        assertEquals("alice", profileResponse.bodyAsText())


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

        val user = User(
            username = "bob",
            password = "1234",
            player = Player("bob"),
            team = Team("Bob's Team", emptyList())
        )
        client.post("/api/users/register") {
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(user))
        }

        val deleteResponse = client.delete("/api/users/byUsername/bob")
        assertEquals(HttpStatusCode.NoContent, deleteResponse.status)

        val getAfterDelete = client.get("/api/users/byUsername/bob")
        assertEquals(HttpStatusCode.NotFound, getAfterDelete.status)
    }


    @Test
    fun `test admin routes`() = testApplication {
        application {
            configureSecurity()
            configureSessionAuthentication()
            configureSerialization()
            configureRouting()
        }

        // 1. CORREÇÃO: Registar e fazer login do admin manualmente
        val admin = User("admin", "adminpass", player = Player("admin"), team = Team("Admin Team"))
        runBlocking { PostgresUserRepository.addUser(admin) }

        val loginResponse = client.post("/api/users/login") {
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(admin))
        }
        assertEquals(HttpStatusCode.OK, loginResponse.status, "Admin login failed")
        val sessionCookie = loginResponse.headers[HttpHeaders.SetCookie]?.substringBefore(';') ?: ""

        // O resto do teste permanece igual
        val createRoundResponse = client.post("/api/round/create") {
            header(HttpHeaders.Cookie, sessionCookie)
        }
        assertEquals(HttpStatusCode.OK, createRoundResponse.status)

        val marketStatus = client.get("/api/market/status")
        assertEquals("""{"isOpen":false}""", marketStatus.bodyAsText())

        val endRoundResponse = client.post("/api/round/over") {
            header(HttpHeaders.Cookie, sessionCookie)
        }
        assertEquals(HttpStatusCode.OK, endRoundResponse.status)

        val marketStatusAfter = client.get("/api/market/status")
        assertEquals("""{"isOpen":true}""", marketStatusAfter.bodyAsText())
    }

    @Test
    fun `test add player to team with insufficient funds`() = testApplication {
        application {
            configureSecurity()
            configureSessionAuthentication()
            configureSerialization()
            configureRouting()
        }
        
        val user = User("poorUser", "123", money = 5f, player = Player("poorUser"), team = Team("Poor Team"))
        val expensivePlayer = Player("expensivePlayer", playerPrice = 100f)

        runBlocking {
            PostgresUserRepository.addUser(user)
            PostgresPlayerRepository.addPlayer(expensivePlayer)
        }
        
        val loginResponse = client.post("/api/users/login") {
            contentType(ContentType.Application.Json)
            setBody(Json.encodeToString(user))
        }
        
        // CORREÇÃO: O teste estava a esperar um 200 OK, mas a API está (corretamente) a devolver um 400 Bad Request.
        // A asserção foi corrigida para esperar um 400.
        assertEquals(HttpStatusCode.OK, loginResponse.status) 
        
        val sessionCookie = loginResponse.headers[HttpHeaders.SetCookie]?.substringBefore(';') ?: ""
        
        val response = client.put("/api/users/addToTeam/expensivePlayer") {
            header(HttpHeaders.Cookie, sessionCookie)
        }
        
        assertEquals(HttpStatusCode.BadRequest, response.status)
        assertEquals("Not enough money", response.bodyAsText())
    }
}