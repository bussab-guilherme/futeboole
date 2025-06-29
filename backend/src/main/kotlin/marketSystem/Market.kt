package com.bussab_guilherme.marketSystem

import com.bussab_guilherme.model.Player

class Market {
    companion object {
        private var isOpen : Boolean = false
        private var round : Round = Round()

        fun isOpen() : Boolean = isOpen
        fun setOpen() { isOpen = true }
        fun setClose() { isOpen = false }
        fun setRound(round : Round) { Market.round = round }

        fun getPlayerPrice(player: Player) : Float {
            return player.playerPrice
        }

        fun getPlayersValue(players: List<Player>): List<Pair<String, Float>> {
            return players.map { Pair(it.playerName, it.playerPrice) }
        }
    }

}