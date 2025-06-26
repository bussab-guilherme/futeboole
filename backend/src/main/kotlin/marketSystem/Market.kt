package com.bussab_guilherme.marketSystem

import com.bussab_guilherme.model.Player
import com.bussab_guilherme.model.User

class Market {
    companion object {
        private var isOpen : Boolean = false
        private var round : Round = Round()

        fun isOpen() : Boolean = isOpen
        fun setOpen() { isOpen = true }
        fun setClose() { isOpen = false }
        fun setRound(round : Round) { Market.round = round }

        fun getPlayerValue(player: Player) : Float {
            val prevValue = player.playerScore
            val votes = player.numVotes.toFloat()
            val totalVotes = round.getTotalVoteCount().toFloat()
            if (totalVotes == 0f) return prevValue
            val voteShare = votes / totalVotes
            return prevValue * (0.7f + voteShare)
        }

        fun getPlayersValue(players: List<Player>): List<Float> {
            val totalVotes = round.getTotalVoteCount().toFloat()

            if (totalVotes == 0f) {
                return players.map { it.playerScore }
            }

            return players.map { user ->
                val prevValue = user.playerScore
                val votes = user.numVotes.toFloat()
                val voteShare = votes / totalVotes
                prevValue * (0.7f + voteShare)
            }
        }
    }

}