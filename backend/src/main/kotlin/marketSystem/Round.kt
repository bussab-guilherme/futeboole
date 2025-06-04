package com.bussab_guilherme.marketSystem

class Round {
    private var totalVoteCount: Int = 0

    fun getTotalVoteCount(): Int = totalVoteCount

    fun resetTotalVoteCount(): Boolean {
        if (isOver) return false
        totalVoteCount = 0
        return true
    }

    fun incrementTotalVoteCount(): Boolean {
        if (isOver) return false
        totalVoteCount++
        return true
    }

    fun setRoundOver() {
        if (isOver) return
        isOver = true
        Market.setOpen()
        Market.setRound(this)
    }

    companion object {
        private var current: Round = Round()
        private var isOver: Boolean = false

        fun getCurrent(): Round = current

        fun create() {
            Market.setClose()
            current = Round()
            isOver = false
        }
    }
}