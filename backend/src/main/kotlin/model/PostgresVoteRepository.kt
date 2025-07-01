package com.bussab_guilherme.model

import com.bussab_guilherme.db.VoteDAO
import com.bussab_guilherme.db.VoteTable
import com.bussab_guilherme.db.daoToModel
import com.bussab_guilherme.db.suspendTransaction
import org.jetbrains.exposed.sql.and

object PostgresVoteRepository : VoteRepository {
    override suspend fun getVotesByUser(user: String): List<Vote> = suspendTransaction {
        VoteDAO.find { VoteTable.user eq user }.map(::daoToModel)
    }

    override suspend fun addVote(vote: Vote) : Unit = suspendTransaction {
        VoteDAO.new {
            user = vote.user
            player = vote.player
            score = vote.score
        }
    }

    override suspend fun deleteVote(vote: Vote) : Unit = suspendTransaction {
        VoteDAO.find { VoteTable.user eq vote.user and (VoteTable.player eq vote.player) }.first().delete()
    }

    override suspend fun resetVotes() : Unit = suspendTransaction {
        VoteDAO.all().forEach { vote ->
            vote.delete()
        }
    }

    override suspend fun containsVote(vote: Vote): Boolean = suspendTransaction {
        VoteDAO.find { VoteTable.user eq vote.user and (VoteTable.player eq vote.player) }.firstOrNull() != null
    }
}