import {Hanko, register} from "@teamhanko/hanko-elements";

const hankoApi = process.env.NEXT_PUBLIC_HANKO_API_URL || "";

export function createHanko() {
    return new Hanko(hankoApi)
}

export function registerHanko() {
    return register(hankoApi)
}
