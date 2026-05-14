import * as SQLite from 'expo-sqlite';

/**
 * SQLite local cache for bookings (`cached_bookings` table).
 * Provides offline / fallback display per assessment spec.
 */

const DB_NAME = 'smart_mechanic.db';

export interface CachedBookingRow {
  id: number;
  bookingId: string;
  mechanicName: string;
  serviceType: string;
  status: string;
  bookingDate: string;
  synced: number;
}

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
    const db = await dbPromise;
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS cached_bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        bookingId TEXT NOT NULL UNIQUE,
        mechanicName TEXT NOT NULL,
        serviceType TEXT NOT NULL,
        status TEXT NOT NULL,
        bookingDate TEXT NOT NULL,
        synced INTEGER NOT NULL DEFAULT 0
      );
    `);
  }
  return dbPromise;
}

/** Create or replace a cached booking row (upsert by bookingId). */
export async function upsertCachedBooking(row: Omit<CachedBookingRow, 'id'>): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO cached_bookings (bookingId, mechanicName, serviceType, status, bookingDate, synced)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(bookingId) DO UPDATE SET
       mechanicName = excluded.mechanicName,
       serviceType = excluded.serviceType,
       status = excluded.status,
       bookingDate = excluded.bookingDate,
       synced = excluded.synced;`,
    [
      row.bookingId,
      row.mechanicName,
      row.serviceType,
      row.status,
      row.bookingDate,
      row.synced,
    ]
  );
}

/** Read all cached bookings ordered by date descending. */
export async function getAllCachedBookings(): Promise<CachedBookingRow[]> {
  const db = await getDb();
  return db.getAllAsync<CachedBookingRow>(
    `SELECT id, bookingId, mechanicName, serviceType, status, bookingDate, synced
     FROM cached_bookings ORDER BY bookingDate DESC;`
  );
}

/** Mark a row as synced with Firestore (1 = synced, 0 = pending). */
export async function markBookingSynced(bookingId: string, synced: 0 | 1): Promise<void> {
  const db = await getDb();
  await db.runAsync(`UPDATE cached_bookings SET synced = ? WHERE bookingId = ?;`, [
    synced,
    bookingId,
  ]);
}

/** Delete cached booking (e.g. after user removes locally — optional). */
export async function deleteCachedBooking(bookingId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM cached_bookings WHERE bookingId = ?;`, [bookingId]);
}

/** Returns rows that still need cloud sync. */
export async function getUnsyncedCachedBookings(): Promise<CachedBookingRow[]> {
  const db = await getDb();
  return db.getAllAsync<CachedBookingRow>(
    `SELECT id, bookingId, mechanicName, serviceType, status, bookingDate, synced
     FROM cached_bookings WHERE synced = 0 ORDER BY bookingDate ASC;`
  );
}
