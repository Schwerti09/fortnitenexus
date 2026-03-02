const BASE_URL = "https://clawguru.org";

export const TOTAL_URLS = 100_000;
export const BATCH_SIZE = 200;

/**
 * URL #35,001 is at index 35,000 (0-based).
 * The first daily batch starts here and advances by BATCH_SIZE each day.
 */
export const START_INDEX = 35_000;

/**
 * 8 years × 12,500 CVEs each = 100,000 URLs.
 * URL format: https://clawguru.org/solutions/fix-cve-{year}-{nnnnn}
 */
const YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
const PER_YEAR = TOTAL_URLS / YEARS.length; // 12,500

/** Returns the URL at the given absolute index in the 100k list (wraps around). */
export function getUrlAtIndex(index: number): string {
  const i = ((index % TOTAL_URLS) + TOTAL_URLS) % TOTAL_URLS;
  const yearIdx = Math.floor(i / PER_YEAR);
  const n = (i % PER_YEAR) + 1;
  return `${BASE_URL}/solutions/fix-cve-${YEARS[yearIdx]}-${String(n).padStart(5, "0")}`;
}

/**
 * Computes today's starting offset (0-based index into the 100k list).
 * Uses INDEX_START_DATE env var (YYYY-MM-DD, UTC) to determine day 0;
 * defaults to 2026-03-02 if not set.
 * On day 0 the offset equals START_INDEX; each subsequent day it advances by BATCH_SIZE.
 */
export function getDailyOffset(): number {
  const startDateStr = process.env.INDEX_START_DATE ?? "2026-03-02";
  const startMs = new Date(`${startDateStr}T00:00:00Z`).getTime();
  const now = new Date();
  const todayMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const daysSinceStart = Math.max(0, Math.floor((todayMs - startMs) / 86_400_000));
  return (START_INDEX + daysSinceStart * BATCH_SIZE) % TOTAL_URLS;
}

/**
 * Returns the 200 URLs scheduled for today's indexing run.
 * Each day's batch is guaranteed to be distinct from all previous days' batches
 * within a full 500-day cycle (100,000 / 200 = 500 days).
 */
export function getNextBatch(): string[] {
  const offset = getDailyOffset();
  return Array.from({ length: BATCH_SIZE }, (_, i) => getUrlAtIndex(offset + i));
}
