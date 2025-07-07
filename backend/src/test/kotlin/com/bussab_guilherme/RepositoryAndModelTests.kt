package com.bussab_guilherme

import com.bussab_guilherme.marketSystem.Market
import com.bussab_guilherme.marketSystem.Round
import com.bussab_guilherme.model.*
import kotlinx.coroutines.runBlocking
import org.junit.Test
import kotlin.test.*

class ModelTest {

    @Test
    fun testUser() {
        // Corrigido: Usando o construtor correto
        val user = User("testUser", "password123", player = null, team = null)
        val hashedPassword = user.hashPassword()
        assertNotEquals("password123", hashedPassword)
        assertTrue(User.verifyPassword("password123", hashedPassword))
    }

    @Test
    fun testTeam() {
        val player1 = Player("player1", 10.0f, 1, 10.0f)
        val player2 = Player("player2", 5.0f, 1, 5.0f)
        val team = Team("testTeam", listOf(player1, player2))
        assertEquals(15.0, team.getTeamScore())
    }

    @Test
    fun testVote() {
        val vote = Vote("user1", "player1", 8.5f)
        assertEquals("user1", vote.user)
        assertEquals("player1", vote.player)
        assertEquals(8.5f, vote.score)
    }
}

class MarketSystemTest {

    @Test
    fun testMarket() {
        val player = Player("marketPlayer", 0.0f, 0, 12.5f)
        assertEquals(12.5f, Market.getPlayerPrice(player))

        val players = listOf(
            Player("p1", 0.0f, 0, 10.0f),
            Player("p2", 0.0f, 0, 20.0f)
        )
        val expectedPrices = listOf("p1" to 10.0f, "p2" to 20.0f)
        assertContentEquals(expectedPrices, Market.getPlayersValue(players))
    }

    @Test
    fun testRound() = runBlocking {
        Round.create()
        assertFalse(Round.isOver())
        assertFalse(Market.isOpen())

        val player = Player("roundPlayer", 5.0f, 1, 7.0f)
        // Simular a adição de jogador, já que não temos um repositório real no teste unitário
        // PostgresPlayerRepository.addPlayer(player) 

        Round.getCurrent().setRoundOver()
        assertTrue(Round.isOver())
        assertTrue(Market.isOpen())
    }
}