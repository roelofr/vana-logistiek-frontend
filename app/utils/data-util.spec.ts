import { describe, it, expect } from "vitest";

import { expand, expandMap } from "./data-util";

interface DataUtilUser {
  id: number;
  name: string;
}

type DataUtilUserRef = DataUtilUser | number;

interface DataUtilRow {
  id: number;
  row: string;
  user?: DataUtilUserRef;
  users?: DataUtilUserRef[];
}

describe("DataUtil", () => {
  const user1 = { id: 1, name: "John" };
  const user2 = { id: 2, name: "Jane" };

  describe("converts singular objects", () => {
    const input: DataUtilRow[] = [
      { id: 1, row: "one", user: user1 },
      { id: 2, row: "two", user: 1 },
      { id: 3, row: "three", user: user2 },
      { id: 4, row: "four", user: 2 },
    ];

    const expected: DataUtilRow[] = [
      { id: 1, row: "one", user: user1 },
      { id: 2, row: "two", user: user1 },
      { id: 3, row: "three", user: user2 },
      { id: 4, row: "four", user: user2 },
    ];

    it("expands with `expand`", () => {
      expect(expand(input, ["user"])).to.deep.equal(expected);
    });

    it("expands with `expandMap`", () => {
      expect(input.map(expandMap<DataUtilRow>(["user"]))).to.deep.equal(
        expected,
      );
    });
  });

  describe("List of objects", () => {
    const input: DataUtilRow[] = [
      { id: 1, row: "one", users: [user1] },
      { id: 2, row: "two", users: [1, user2] },
      { id: 3, row: "three", users: [2] },
      { id: 4, row: "four", users: [1, 2] },
    ];

    const expected: DataUtilRow[] = [
      { id: 1, row: "one", users: [user1] },
      { id: 2, row: "two", users: [user1, user2] },
      { id: 3, row: "three", users: [user2] },
      { id: 4, row: "four", users: [user1, user2] },
    ];

    it("expands with `expand`", () => {
      expect(expand(input, ["users"])).to.deep.equal(expected);
    });

    it("expands with `expandMap`", () => {
      expect(input.map(expandMap<DataUtilRow>(["users"]))).to.deep.equal(
        expected,
      );
    });
  });

  describe("Aliassing", () => {
    const input: DataUtilRow[] = [
      { id: 1, row: "one", user: user1, users: [1, user2] },
      { id: 2, row: "two", user: 2, users: [1] },
    ];

    const expected: DataUtilRow[] = [
      { id: 1, row: "one", user: user1, users: [user1, user2] },
      { id: 2, row: "two", user: user2, users: [user1] },
    ];

    it("expands with `expand`", () => {
      expect(expand(input, [["user", "users"]])).to.deep.equal(expected);
    });

    it("expands with `expandMap`", () => {
      expect(
        input.map(expandMap<DataUtilRow>([["user", "users"]])),
      ).to.deep.equal(expected);
    });
  });
});
