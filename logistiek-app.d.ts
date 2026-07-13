declare namespace OpenIDConnect {
  declare type GrantTypes =
    "authorization_code" | "refresh_token" | "client_credentials" | string;
  declare type CodeChallengeMethods = "plain" | "S256" | string;
  declare type SigningAlgorithms = "RS256" | "ES256" | string;
  declare type OidcScopes = "openid" | "profile" | "email" | "groups" | string;
  declare type PromptValues =
    "none" | "login" | "consent" | "select_account" | string;
  declare type ResponseTypes = "code" | "id_token" | "refresh_token" | string;
  declare type TokenEndpointAuthMethods =
    "client_secret_basic" | "client_secret_post" | "none" | string;

  declare interface WellKnownConfig {
    authorization_endpoint: string;
    authorization_response_iss_parameter_supported: boolean;
    claims_supported: string[];
    code_challenge_methods_supported: CodeChallengeMethods[];
    device_authorization_endpoint: string;
    end_session_endpoint: string;
    grant_types_supported: GrantTypes[];
    id_token_signing_alg_values_supported: SigningAlgorithms[];
    introspection_endpoint: string;
    issuer: string;
    jwks_uri: string;
    prompt_values_supported: PromptValues[];
    response_types_supported: ResponseTypes[];
    scopes_supported: OidcScopes[];
    subject_types_supported: string[];
    token_endpoint: string;
    token_endpoint_auth_methods_supported: TokenEndpointAuthMethods[];
    userinfo_endpoint: string;
  }
}
