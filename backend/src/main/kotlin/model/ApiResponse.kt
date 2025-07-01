package com.bussab_guilherme.model
import kotlinx.serialization.Serializable

@Serializable
data class ApiResponse(
    val message: String,
    val newMoney: Float 
)