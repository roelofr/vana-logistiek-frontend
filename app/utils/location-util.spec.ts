import { describe, test, expect } from "vitest";
import { locationToGrid } from "./location-util";

describe("location-util", () => {
  test.for([
    { lat: 52.272178562751094, lng: 4.530389243091861, cell: "A1" },
    { lat: 52.27024171695646, lng: 4.530369646782475, cell: "A9" },
    { lat: 52.26930267972685, lng: 4.537195814026859, cell: "R13" },
    { lat: 52.26812877206126, lng: 4.5403530291995935, cell: "Z18" },
    { lat: 52.266412806525636, lng: 4.54442684828723, cell: "AJ25" },
    { lat: 52.267149609068326, lng: 4.539950250979103, cell: "Y22" },
    { lat: 52.26476253256911, lng: 4.5492117937759815, cell: "AV32" },
  ])("locationToGrid($lat, $lng) -> $cell", ({ lat, lng, cell }) => {
    expect(locationToGrid({ lat, lng })).toEqual(cell);
  });
});
