import { createContext, useContext, useMemo, useReducer } from 'react'
import { readJson, writeJson, removeKey } from '../lib/storage.js'
import { isValidEmail, validatePassword, validateRequired } from '../lib/validators.js'

const USERS_KEY = 'dvd.users'
const SESSION_KEY = 'dvd.sessionUser'

const AuthContext = createContext(null)

function getInitialState() {
  return {
    user: readJson(SESSION_KEY, null),
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.user }
    case 'LOGOUT':
      return { ...state, user: null }
    default:
      return state
  }
}

function getUsers() {
  return readJson(USERS_KEY, [])
}

function setUsers(users) {
  writeJson(USERS_KEY, users)
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState)

  const api = useMemo(() => {
    return {
      user: state.user,
      isAuthed: Boolean(state.user),
      register: ({ name, email, password }) => {
        const err =
          validateRequired(name, 'Name') ||
          validateRequired(email, 'Email') ||
          validateRequired(password, 'Password')
        if (err) return { ok: false, error: err }
        if (!isValidEmail(email)) return { ok: false, error: 'Enter a valid email.' }

        const pwErrors = validatePassword(password)
        if (pwErrors.length) return { ok: false, error: pwErrors[0] }

        const users = getUsers()
        const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
        if (existing) return { ok: false, error: 'Email already registered.' }

        const newUser = { id: `user-${users.length + 1}`, name, email, password }
        setUsers([...users, newUser])

        const sessionUser = { id: newUser.id, name: newUser.name, email: newUser.email }
        writeJson(SESSION_KEY, sessionUser)
        dispatch({ type: 'LOGIN', user: sessionUser })
        return { ok: true }
      },
      login: ({ email, password }) => {
        const err =
          validateRequired(email, 'Email') || validateRequired(password, 'Password')
        if (err) return { ok: false, error: err }
        if (!isValidEmail(email)) return { ok: false, error: 'Enter a valid email.' }

        const users = getUsers()
        const match = users.find(
          (u) =>
            u.email.toLowerCase() === email.toLowerCase() && String(u.password) === String(password),
        )
        if (!match) return { ok: false, error: 'Invalid credentials.' }

        const sessionUser = { id: match.id, name: match.name, email: match.email }
        writeJson(SESSION_KEY, sessionUser)
        dispatch({ type: 'LOGIN', user: sessionUser })
        return { ok: true }
      },
      logout: () => {
        removeKey(SESSION_KEY)
        dispatch({ type: 'LOGOUT' })
      },
      // Convenience for test setup and demos.
      seedDemoUser: () => {
        const users = getUsers()
        const demoEmail = 'demo.user@example.com'
        const already = users.find((u) => u.email.toLowerCase() === demoEmail)
        if (!already) {
          setUsers([
            ...users,
            { id: `user-${users.length + 1}`, name: 'Demo User', email: demoEmail, password: 'DemoPass1' },
          ])
        }
        return { email: demoEmail, password: 'DemoPass1' }
      },
    }
  }, [state.user])

  return <AuthContext.Provider value={api}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

