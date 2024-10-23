// src/app/models/user.model.ts

export interface User {
    _id: string;          // Unique identifier for the user
    name: string;        // Full name of the user
    email: string;       // Email address of the user
    phone: string;       // Phone number of the user
    address?: string[];  // Optional address field (array of strings)
  }



  