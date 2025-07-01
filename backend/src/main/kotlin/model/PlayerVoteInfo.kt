package com.bussab_guilherme.model

import kotlinx.serialization.Serializable

@Serializable
data class PlayerVoteInfo(
    val id: String, // Username do jogador
    val name: String, // Nome/Username do jogador
    val voted: Boolean,
    val givenScore: Float? // A nota dada pelo usuário (nullable se não votou)
)