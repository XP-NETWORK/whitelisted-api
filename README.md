# whitelisted-api
API for storing whitelisted XP.NETWORK Bridge contracts\

# Routes

**GET /:chain** - Returns list of whitelisted contracts for given chain if stored. :chain - can be chain name or nonce (ex. - /polygon || /7)

**POST /:chain (protected)** - Saves whitelisted contracts for given chain. Body example :
    
    
    {
          "0x7a0505eEb4C1e24c03dE65db421985b0427547f6": {
              "name" : "Albus", 
              "symbol" : "Dumbldore"
          },
            "0xbA1D8dCedFB1E0D0Dd1291108D114949026A75a7": {
              "name" : "Diamond"
          }
    }
    
**DELETE /:chain (protected)** - Deletes specific contracts for given chain. Body example:

      {
           "contracts": ["0x7a0505eeb4c1e24c03de65db421985b0427547f6", "0xbA1D8dCedFB1E0D0Dd1291108D114949026A75a7"]
      }

**DELETE /drop/:chain (protected)** - Deletes all contracts for given chain.
