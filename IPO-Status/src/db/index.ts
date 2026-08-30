import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const initDB = async () => {
  db = await SQLite.openDatabaseAsync('ipostatus.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      pan TEXT NOT NULL UNIQUE
    );
  `);
};

export interface Account {
  id: number;
  name: string;
  pan: string;
}

export const getAccounts = async (): Promise<Account[]> => {
  if (!db) return [];
  return await db.getAllAsync<Account>('SELECT * FROM accounts');
};

export const addAccount = async (name: string, pan: string): Promise<number | undefined> => {
  if (!db) return;
  const result = await db.runAsync('INSERT INTO accounts (name, pan) VALUES (?, ?)', [name, pan]);
  return result.lastInsertRowId;
};

export const editAccount = async (id: number, name: string, pan: string): Promise<void> => {
  if (!db) return;
  await db.runAsync('UPDATE accounts SET name = ?, pan = ? WHERE id = ?', [name, pan, id]);
};

export const deleteAccount = async (id: number): Promise<void> => {
  if (!db) return;
  await db.runAsync('DELETE FROM accounts WHERE id = ?', [id]);
};
