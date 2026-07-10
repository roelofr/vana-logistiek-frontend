import type { Location } from "~/types";

// Source - https://stackoverflow.com/a/75068548
// Posted by Lionel Rowe
// Retrieved 2026-07-08, License - CC BY-SA 4.0

/** @param {number} number */
const divmodExcel = (number: number): [number, number] => {
  const modulo = Math.floor(number / 26);
  const remainder = number % 26;

  return remainder === 0 ? [modulo - 1, remainder + 26] : [modulo, remainder];
};

const uppercaseAlphas = Array(26)
  .fill(null)
  .map((_, iterator) => String.fromCodePoint("A".codePointAt(0)! + iterator));

/** @param {number} number */
const toExcelCol = (number: number): string => {
  const chars = [];

  let remainder;
  while (number > 0) {
    [number, remainder] = divmodExcel(number);
    chars.unshift(uppercaseAlphas[remainder - 1]);
  }
  return chars.join("");
};

// End of https://stackoverflow.com/a/75068548

const toLocationObject = (lat: number, lng: number): Location => ({ lat, lng });

const northWest = toLocationObject(52.27230055771997, 4.530162470773064);
const southEast = toLocationObject(52.264857685195665, 4.549056498403218);
const lngDensity = (southEast.lng - northWest.lng) / 48; // Cols
const latDensity = (southEast.lat - northWest.lat) / 32; // Rows

export function locationToGrid(current: Location) {
  const lat = (current.lat - northWest.lat) / latDensity;
  const lng = (current.lng - northWest.lng) / lngDensity;
  //
  // lat += lng / 32;
  // lng -= lat / 48;

  return `${toExcelCol(Math.round(lng))}${Math.round(lat)}`;
}
