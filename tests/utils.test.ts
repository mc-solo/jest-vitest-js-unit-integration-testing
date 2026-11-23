import { describe, expect, it } from "vitest";
import {
  calculateDiscount,
  chunkArray,
  formatPrice,
  isValidEmail,
  slugify,
} from "../src/utils";
import cases from "../test-data/expected-values.json";
import usersData from "../test-data/users.json";
import snapshots from "../test-data/snapshots.json";

describe("formatPrice", () => {
  it("formats a whole number with two decimals", () => {
    const c = cases.formatPrice[0];
    expect(formatPrice(c.input)).toBe(c.expected);
  });

  it("formats a decimal and rounds to two decimals", () => {
    const [first, second] = cases.formatPrice.slice(1, 3);
    expect(formatPrice(first.input)).toBe(first.expected);
    expect(formatPrice(second.input)).toBe(second.expected);
  });

  it("formats zero", () => {
    const c = cases.formatPrice[3];
    expect(formatPrice(c.input)).toBe(c.expected);
  });

  it("throws for non-finite amounts", () => {
    expect(() => formatPrice(NaN)).toThrow("finite");
    expect(() => formatPrice(Infinity)).toThrow("finite");
  });
});

describe("slugify", () => {
  it("lowercases and replaces spaces with dashes", () => {
    const c = cases.slugify[0];
    expect(slugify(c.input)).toBe(c.expected);
  });

  it("removes punctuation and collapses repeated dashes", () => {
    const c = cases.slugify[1];
    expect(slugify(c.input)).toBe(c.expected);
  });

  it("trims leading and trailing dashes", () => {
    const c = cases.slugify[2];
    expect(slugify(c.input)).toBe(c.expected);
  });

  it("returns an empty string for empty input", () => {
    const c = cases.slugify[3];
    expect(slugify(c.input)).toBe(c.expected);
  });
});

describe("isValidEmail", () => {
  it("accepts a normal email", () => {
    for (const user of usersData.validUsers) {
      expect(isValidEmail(user.email)).toBe(true);
    }
  });

  it("rejects missing @, missing domain dot, and spaces", () => {
    for (const email of usersData.invalidEmails.slice(0, 5)) {
      expect(isValidEmail(email)).toBe(false);
    }
  });

  it("rejects empty string and a domain starting or ending with a dot", () => {
    for (const email of usersData.invalidEmails.slice(5, 8)) {
      expect(isValidEmail(email)).toBe(false);
    }
  });

  it("rejects more than one @", () => {
    const email = usersData.invalidEmails[8];
    expect(isValidEmail(email)).toBe(false);
  });
});

describe("calculateDiscount", () => {
  it("applies a 20% discount", () => {
    const c = cases.calculateDiscount[0];
    expect(calculateDiscount(c.price, c.percent)).toBe(c.expected);
  });

  it("returns the full price at 0% and 0 at 100%", () => {
    const [zero, full] = cases.calculateDiscount.slice(1, 3);
    expect(calculateDiscount(zero.price, zero.percent)).toBe(zero.expected);
    expect(calculateDiscount(full.price, full.percent)).toBe(full.expected);
  });

  it("rounds the result to two decimals", () => {
    const c = cases.calculateDiscount[3];
    expect(calculateDiscount(c.price, c.percent)).toBe(c.expected);
  });

  it("throws for invalid price or percent", () => {
    expect(() => calculateDiscount(-1, 10)).toThrow();
    expect(() => calculateDiscount(10, -5)).toThrow();
    expect(() => calculateDiscount(10, 101)).toThrow();
  });
});

describe("chunkArray", () => {
  it("splits an array into even chunks", () => {
    const c = cases.chunkArray;
    expect(chunkArray(c.evenInput, c.evenSize)).toEqual(c.evenExpected);
  });

  it("keeps a smaller remainder chunk", () => {
    const c = cases.chunkArray;
    expect(chunkArray(c.numbers, c.evenSize)).toEqual(c.remainderExpected);
  });

  it("returns one chunk when size is larger than the array", () => {
    const c = cases.chunkArray;
    expect(chunkArray([1, 2], 10)).toEqual(c.oversizeExpected);
  });

  it("returns an empty array for empty input", () => {
    expect(chunkArray([], 3)).toEqual([]);
  });

  it("throws for a non-positive or non-integer size", () => {
    expect(() => chunkArray([1], 0)).toThrow();
    expect(() => chunkArray([1], -1)).toThrow();
    expect(() => chunkArray([1], 1.5)).toThrow();
  });
});

// Snapshot tests: the outputs for the cases in
// test-data/snapshots.json are recorded in
// tests/__snapshots__/utils.test.ts.snap on the first run and
// compared on every run after that. If a snapshot mismatches, the
// code changed its output on purpose (update with `vitest -u`) or
// by accident (fix the code, not the snapshot).
describe("snapshots", () => {
  it("matches the snapshot for formatPrice outputs", () => {
    expect(
      snapshots.formatPrice.map((c) => formatPrice(c.input)),
    ).toMatchSnapshot();
  });

  it("matches the snapshot for slugify outputs", () => {
    expect(
      snapshots.slugify.map((c) => slugify(c.input)),
    ).toMatchSnapshot();
  });

  it("matches the snapshot for calculateDiscount outputs", () => {
    expect(
      snapshots.calculateDiscount.map((c) =>
        calculateDiscount(c.price, c.percent),
      ),
    ).toMatchSnapshot();
  });

  it("matches the snapshot for chunkArray output", () => {
    const c = snapshots.chunkArray;
    expect(chunkArray(c.input, c.size)).toMatchSnapshot();
  });
});
