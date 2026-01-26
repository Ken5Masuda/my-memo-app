import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatDate, formatRelativeTime, countCharacters } from "./date";

describe("formatDate", () => {
  it("Dateオブジェクトを正しくフォーマットする", () => {
    const date = new Date(2026, 0, 23); // 2026年1月23日
    expect(formatDate(date)).toBe("2026年1月23日");
  });

  it("ISO文字列を正しくフォーマットする", () => {
    const dateStr = "2026-01-23T10:00:00.000Z";
    const result = formatDate(dateStr);
    // タイムゾーンによって日付が変わる可能性があるため、年と月だけチェック
    expect(result).toContain("2026年");
    expect(result).toContain("月");
    expect(result).toContain("日");
  });

  it("無効な日付の場合はエラーメッセージを返す", () => {
    expect(formatDate("invalid")).toBe("無効な日付");
    expect(formatDate(new Date("invalid"))).toBe("無効な日付");
  });
});

describe("formatRelativeTime", () => {
  beforeEach(() => {
    // 現在時刻を固定（2026年1月23日 15:00:00）
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 23, 15, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("60秒未満は「たった今」を返す", () => {
    const date = new Date(2026, 0, 23, 14, 59, 30); // 30秒前
    expect(formatRelativeTime(date)).toBe("たった今");
  });

  it("60分未満は「○分前」を返す", () => {
    const date = new Date(2026, 0, 23, 14, 55, 0); // 5分前
    expect(formatRelativeTime(date)).toBe("5分前");
  });

  it("24時間未満は「○時間前」を返す", () => {
    const date = new Date(2026, 0, 23, 12, 0, 0); // 3時間前
    expect(formatRelativeTime(date)).toBe("3時間前");
  });

  it("1日前は「昨日」を返す", () => {
    const date = new Date(2026, 0, 22, 15, 0, 0); // 1日前
    expect(formatRelativeTime(date)).toBe("昨日");
  });

  it("7日未満は「○日前」を返す", () => {
    const date = new Date(2026, 0, 20, 15, 0, 0); // 3日前
    expect(formatRelativeTime(date)).toBe("3日前");
  });

  it("7日以上は日付をフォーマットして返す", () => {
    const date = new Date(2026, 0, 10, 15, 0, 0); // 13日前
    expect(formatRelativeTime(date)).toBe("2026年1月10日");
  });

  it("無効な日付の場合はエラーメッセージを返す", () => {
    expect(formatRelativeTime("invalid")).toBe("無効な日付");
  });
});

describe("countCharacters", () => {
  it("日本語文字を正しくカウントする", () => {
    expect(countCharacters("こんにちは")).toBe(5);
  });

  it("英数字を正しくカウントする", () => {
    expect(countCharacters("Hello123")).toBe(8);
  });

  it("絵文字を1文字としてカウントする", () => {
    expect(countCharacters("👍")).toBe(1);
    expect(countCharacters("Hello👍World")).toBe(11);
  });

  it("複合絵文字を1文字としてカウントする", () => {
    // 家族絵文字（複数のコードポイントで構成）
    expect(countCharacters("👨‍👩‍👧‍👦")).toBe(1);
  });

  it("空文字列は0を返す", () => {
    expect(countCharacters("")).toBe(0);
  });

  it("混合文字列を正しくカウントする", () => {
    // Hello(5) + 世界(2) + 🌍(1) = 8
    expect(countCharacters("Hello世界🌍")).toBe(8);
  });
});
