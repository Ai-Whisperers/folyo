/**
 * Database connection module declarations
 */

import { Mongoose } from 'mongoose'

export function connectDB(): Promise<Mongoose>
