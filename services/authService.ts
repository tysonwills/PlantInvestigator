
import { User } from '../types';

const DB_KEY = 'flora_db_users';
const SESSION_KEY = 'flora_session';

interface UserDB {
  [email: string]: User & { password?: string };
}

export const authService = {
  getUsers(): UserDB {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : {};
  },

  saveUsers(users: UserDB) {
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  },

  signUp(email: string, password: string): User {
    const users = this.getUsers();
    if (users[email]) throw new Error("User already exists");
    
    const newUser: User & { password?: string } = {
      email,
      password,
      isPremium: false,
      isAuthenticated: true
    };
    
    users[email] = newUser;
    this.saveUsers(users);
    this.setSession(newUser);
    return newUser;
  },

  login(email: string, password: string): User {
    const users = this.getUsers();
    const user = users[email];
    
    if (!user || user.password !== password) {
      throw new Error("Invalid email or password");
    }
    
    const sessionUser = { ...user, isAuthenticated: true };
    this.setSession(sessionUser);
    return sessionUser;
  },

  setSession(user: User) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  getSession(): User | null {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  upgradeUser(email: string): User {
    const users = this.getUsers();
    if (users[email]) {
      users[email].isPremium = true;
      this.saveUsers(users);
      const updated = { ...users[email], isAuthenticated: true };
      this.setSession(updated);
      return updated;
    }
    throw new Error("User not found");
  }
};
