package com.bussab_guilherme.model

interface VoteRepository {
    suspend fun getVotesByUser(user : String) : List<Vote>
    suspend fun addVote(vote : Vote) : Unit
    suspend fun deleteVote(vote : Vote) : Unit
    suspend fun resetVotes() : Unit
    suspend fun containsVote(vote : Vote) : Boolean
}