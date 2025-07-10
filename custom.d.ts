import {HankoAuthElementProps, HankoEventsElementProps, HankoProfileElementProps} from "@teamhanko/hanko-elements";
import {DefaultSession} from "next-auth";
import {JWT as BaseJWT} from "@auth/core/jwt"

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "hanko-auth": HankoAuthElementProps;
            "hanko-login": HankoAuthElementProps;
            "hanko-registration": HankoAuthElementProps;
            "hanko-profile": HankoProfileElementProps;
            "hanko-events": HankoEventsElementProps;
        }
    }
}

declare module "next-auth" {
    interface Session {
        user: {
            jwt: string;
            roles: string[];
        } & DefaultSession["user"]
    }
}

declare module "@auth/core/jwt" {
    interface JWT extends BaseJWT {
        jwt: string;
        roles: string[];
        given_name: string;
    }
}
