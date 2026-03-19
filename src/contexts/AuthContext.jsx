import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

/**
 * Donne accès au token JWT et au solde de crédits de l'utilisateur.
 * Doit être utilisé à l'intérieur d'un AuthGuard.
 */
export const useAuth = () => useContext(AuthContext)
