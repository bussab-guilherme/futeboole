package com.bussab_guilherme

import com.bussab_guilherme.db.*
import com.bussab_guilherme.model.*
import kotlinx.coroutines.runBlocking
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.SizedCollection
import org.jetbrains.exposed.sql.transactions.transaction
import org.junit.Before
import org.junit.Test
import kotlin.test.assertEquals
import kotlin.test.assertNotNull
import kotlin.test.assertNull
import kotlin.test.assertTrue

class RepositoryTests {

    @Before
    fun setup() {
        Database.connect("jdbc:h2:mem:test;DB_CLOSE_DELAY=-1;", driver = "org.h2.Driver")
        transaction {
            SchemaUtils.drop(UserTable, PlayerTable, TeamTable, TeamPlayersTable, VoteTable)
            SchemaUtils.create(UserTable, PlayerTable, TeamTable, TeamPlayersTable, VoteTable)
        }
    }

    @Test
    fun `test team and player repository interactions`() = runBlocking {
        // 1. Setup
        PostgresPlayerRepository.addPlayer(Player("player1", playerPrice = 10f))
        PostgresPlayerRepository.addPlayer(Player("player2", playerPrice = 5f))
        PostgresTeamRepository.addTeam(Team("Test Team"))
        PostgresTeamRepository.addPlayerToTeam("player1", "Test Team")
        PostgresTeamRepository.addPlayerToTeam("player2", "Test Team")

        val fetchedTeam = PostgresTeamRepository.getTeamByName("Test Team")
        assertNotNull(fetchedTeam)
        assertEquals(2, fetchedTeam.players.size)

        // 2. CORREÇÃO: Remover a associação dos jogadores antes de apagar o time
        transaction {
            val teamDao = TeamDAO.find { TeamTable.teamName eq "Test Team" }.first()
            teamDao.players = SizedCollection(emptyList()) // Limpa a lista de jogadores
        }

        // 3. Agora o delete deve funcionar
        PostgresTeamRepository.deleteTeam("Test Team")
        val deletedTeam = PostgresTeamRepository.getTeamByName("Test Team")
        assertNull(deletedTeam)
    }
}