# stellar-xdr-to-json

Tree parser for Stellar XDR types that renders to JSON.

## Installation

This is a nodejs project and it requires a recent version of `node` and `npm` to be installed.
Clone this git repository, `cd` into the root directory, and then:

```bash
npm install
```

## Usage (CLI)

```bash
Usage: xdr2json [options] <xdr-string>

Render a Stellar XDR object as JSON

Arguments:
  xdr-string         Base64-encoded XDR object

Options:
  -V, --version      output the version number
  -t, --type <TYPE>  An XDR type known to the Stellar SDK
  -h, --help         display help for command

```

### Example: TransactionResult

```bash
$ ./xdr2json -t TransactionResult "AAAAAAAAAyAAAAAAAAAACAAAAAAAAAAGAAAAAAAAAAAAAAAGAAAAAAAAAAAAAAACAAAAAAAAAAMAAAABAAAAAGlGp1Oga7HVj7QdMsa3STXHtQ2l4/7klQbxlw0tdMTnAAAAADLUAzgAAAAAAAAAABMCdHgAAAABQVFVQQAAAABblC5TrDPI/QqAzHwbGoXX2DipxBl3qtGLOvBX+OM98AAAAAU1Kg8EAAAAAQAAAAByW/uudcHA3/AcxxN4oyupHyfxRZIKRGRMqMVTs6HOmgAAAAAy1D27AAAAAVVTREMAAAAAO5kROA7+mIugqJAOsc/kTzZvfb6Ua+0HckD39iTfFcUAAAAAAg5ItgAAAAAAAAAABfXg/gAAAAEAAAAAclv7rnXBwN/wHMcTeKMrqR8n8UWSCkRkTKjFU7OhzpoAAAAAMtQ69gAAAAFVU0RDAAAAADuZETgO/piLoKiQDrHP5E82b32+lGvtB3JA9/Yk3xXFAAAAAASALsoAAAAAAAAAAA0Mk3oAAAAAzNjlZXCoavHPjAtx8kdrx3kK6RBMpMCapu+/qv9YD4oAAAABVVNEQwAAAAA7mRE4Dv6Yi6CokA6xz+RPNm99vpRr7QdyQPf2JN8VxQAAAAAGjneAAAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAAAAAAABUAAAAAAAAAAAAAAAEAAAAAAAAAAAAAABUAAAAAAAAAAA==" | jq
```

Output:

```json
[
  {
    "type": "TransactionResult",
    "nodes": [
      {
        "type": "feeCharged",
        "value": "800"
      },
      {
        "type": "result",
        "value": "[txSuccess]",
        "nodes": [
          {
            "type": "results",
            "value": "Array[8]",
            "nodes": [
              {
                "type": "[0]",
                "value": "[opInner]",
                "nodes": [
                  {
                    "type": "tr",
                    "value": "[changeTrust]",
                    "nodes": [
                      {
                        "type": "changeTrustResult",
                        "value": "[changeTrustSuccess]"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "[1]",
                "value": "[opInner]",
                "nodes": [
                  {
                    "type": "tr",
                    "value": "[changeTrust]",
                    "nodes": [
                      {
                        "type": "changeTrustResult",
                        "value": "[changeTrustSuccess]"
                      }
                    ]
                  }
                ]
              },
              ...
              {
                "type": "[6]",
                "value": "[opInner]",
                "nodes": [
                  {
                    "type": "tr",
                    "value": "[payment]",
                    "nodes": [
                      {
                        "type": "paymentResult",
                        "value": "[paymentSuccess]"
                      }
                    ]
                  }
                ]
              },
              {
                "type": "[7]",
                "value": "[opInner]",
                "nodes": [
                  {
                    "type": "tr",
                    "value": "[setTrustLineFlags]",
                    "nodes": [
                      {
                        "type": "setTrustLineFlagsResult",
                        "value": "[setTrustLineFlagsSuccess]"
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "type": "ext",
        "value": "[undefined]"
      }
    ]
  }
]
```

### Example: LedgerEntryData

```bash
$ ./xdr2json --type=LedgerEntryData "AAAABgAAAAAAAAAB98TUovvETXhgkPRvscangUGHQDzOu6rfr1L/+eFPTXgAAAAUAAAAAQAAABMAAAABAAAAAQAAAAMAAAAPAAAACE1FVEFEQVRBAAAAEQAAAAEAAAADAAAADwAAAAdkZWNpbWFsAAAAAAMAAAAHAAAADwAAAARuYW1lAAAADgAAAD9DWU5PUFM6R0FLWEs1UllQTkNONVg0QTVSQlhNVTRBWElXQU1SU0tBNkk2S0ZOUkNaWjJERkxQMk5CWVFXNE4AAAAADwAAAAZzeW1ib2wAAAAAAA4AAAAGQ1lOT1BTAAAAAAAQAAAAAQAAAAEAAAAPAAAABUFkbWluAAAAAAAAEgAAAAH8xy7XKkStt9WH1LS+PNbElvR2ZGkgj7j6gQPoL95y5AAAABAAAAABAAAAAQAAAA8AAAAJQXNzZXRJbmZvAAAAAAAAEAAAAAEAAAACAAAADwAAAApBbHBoYU51bTEyAAAAAAARAAAAAQAAAAIAAAAPAAAACmFzc2V0X2NvZGUAAAAAAA4AAAAMQ1lOT1BTAAAAAAAAAAAADwAAAAZpc3N1ZXIAAAAAAA0AAAAgFXV2OHtE3t+A7EN2U4C6LAZGSgeR5RWxFnOhlW/TQ4g=" | jq
```

Output:

```json
[
  {
    "type": "LedgerEntryData",
    "value": "[contractData]",
    "nodes": [
      {
        "type": "contractData",
        "nodes": [
          {
            "type": "ext",
            "value": "[undefined]"
          },
          {
            "type": "contract",
            "value": "[scAddressTypeContract]",
            "nodes": [
              {
                "type": "contractId",
                "value": "CD34JVFC7PCE26DASD2G7MOGU6AUDB2AHTHLXKW7V5JP76PBJ5GXRJBW"
              }
            ]
          },
          {
            "type": "key",
            "value": "[scvLedgerKeyContractInstance]"
          },
          {
            "type": "durability",
            "value": {
              "name": "persistent",
              "value": 1
            }
          },
          {
            "type": "val",
            "value": "[scvContractInstance]",
            "nodes": [
              {
                "type": "instance",
                "nodes": [
                  {
                    "type": "executable",
                    "value": "[contractExecutableStellarAsset]"
                  },
                  {
                    "type": "storage",
                    "value": "Array[3]",
                    "nodes": [
                      {
                        "type": "[0]",
                        "nodes": [
                          {
                            "type": "key",
                            "value": "[scvSymbol]",
                            "nodes": [
                              {
                                "type": "sym",
                                "value": "METADATA"
                              }
                            ]
                          },
                          {
                            "type": "val",
                            "value": "[scvMap]",
                            "nodes": [
                              {
                                "type": "map",
                                "value": {
                                  "decimal": 7,
                                  "name": "CYNOPS:GAKXK5RYPNCN5X4A5RBXMU4AXIWAMRSKA6I6KFNRCZZ2DFLP2NBYQW4N",
                                  "symbol": "CYNOPS"
                                }
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "[1]",
                        "nodes": [
                          {
                            "type": "key",
                            "value": "[scvVec]",
                            "nodes": [
                              {
                                "type": "vec",
                                "value": "Array[1]",
                                "nodes": [
                                  {
                                    "type": "[0]",
                                    "value": "[scvSymbol]",
                                    "nodes": [
                                      {
                                        "type": "sym",
                                        "value": "Admin"
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            "type": "val",
                            "value": "[scvAddress]",
                            "nodes": [
                              {
                                "type": "address",
                                "value": "CD6MOLWXFJCK3N6VQ7KLJPR423CJN5DWMRUSBD5Y7KAQH2BP3ZZOI5S4"
                              }
                            ]
                          }
                        ]
                      },
                      {
                        "type": "[2]",
                        "nodes": [
                          {
                            "type": "key",
                            "value": "[scvVec]",
                            "nodes": [
                              {
                                "type": "vec",
                                "value": "Array[1]",
                                "nodes": [
                                  {
                                    "type": "[0]",
                                    "value": "[scvSymbol]",
                                    "nodes": [
                                      {
                                        "type": "sym",
                                        "value": "AssetInfo"
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          },
                          {
                            "type": "val",
                            "value": "[scvVec]",
                            "nodes": [
                              {
                                "type": "vec",
                                "value": "Array[2]",
                                "nodes": [
                                  {
                                    "type": "[0]",
                                    "value": "[scvSymbol]",
                                    "nodes": [
                                      {
                                        "type": "sym",
                                        "value": "AlphaNum12"
                                      }
                                    ]
                                  },
                                  {
                                    "type": "[1]",
                                    "value": "[scvMap]",
                                    "nodes": [
                                      {
                                        "type": "map",
                                        "value": {
                                          "asset_code": "CYNOPS\u0000\u0000\u0000\u0000\u0000\u0000",
                                          "issuer": {
                                            "type": "Buffer",
                                            "data": [21,117,118,56,123,68,222,223,128,236,67,118,83,128,186,44,6,70,74,7,145,229,21,177,22,115,161,149,111,211,67,136]
                                          }
                                        }
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]

```

## Development

The main logic is located in `src/` and it is compiled to CommonJS in the `build/` dir with `tsc`. For stand-alone usage, the `xdr2json` convenience script may be used, or the compiled JS can be imported from the build dir. If your own project includes a build process, it could make sense to incorporate the source files directly.
