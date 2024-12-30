## links
### Key Management
- randomness -> private keys
- private keys -> public keys
- public keys -> addresses | chains
- addresses -> tokens

## General Statements
- tokens map to value based on a chosen "base currency", which is usually USD
- In order to understand this value, you need to use service APIs
- general "account mapping"
    - address
        - tokens
            - value (historical)
            - ticker name
            - common name
            - amount
        - storage type
        - access type
        - txn history
        - tags
        - notes
        - related addresses


## Dashboard Views
- portfolio view: Shows the overall value and distribution of the user's portfolio. Gives financial view and historical performance views of the entire portfolio or slices of the portfolio
- access view: Shows the mechanisms of access to the entire portfolio
- provenance view: Shows how the portfolio gets passed on under criteria set by user

## Versions
### V1
- manually entered addresses
- manually chosen chains
- automatically discover and save tokens (both fungible and NFT) from previously chosen addresses and chains
- automatically discover current and historical value of known tokens
- handles only fungible token values automatically, manually handles NFT values
- shows portfolio overview of known tokens and their values
- maps manual grouping of addresses based on key management solution (storage and access)
    - seed phrase
        - hardware wallet
        - mobile wallet
        - desktop/browser wallet
        - multisig
    - keystore
    - private key
- manually describes provenance of address groups

### V2
- activity alerts
- dead man switches