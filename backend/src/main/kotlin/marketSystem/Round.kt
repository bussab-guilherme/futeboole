package com.bussab_guilherme.marketSystem

class Round {
    fun setRoundOver() {
        if (isOver) return
        isOver = true
        Market.setOpen()
        Market.setRound(this)
    }

    companion object {
        private var current: Round = Round()
        private var isOver: Boolean = true

        fun getCurrent(): Round = current
        fun isOver(): Boolean = isOver
        
        fun create() {
            Market.setClose()
            current = Round()
            isOver = false
        }
    }
}