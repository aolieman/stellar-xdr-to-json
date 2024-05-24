"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scValByType = void 0;
const stellar_sdk_1 = require("@stellar/stellar-sdk");
const scValByType = (scVal) => {
    switch (scVal.switch()) {
        case stellar_sdk_1.xdr.ScValType.scvAddress(): {
            const address = scVal.address();
            const addressType = address.switch();
            if (addressType.name === "scAddressTypeAccount") {
                return stellar_sdk_1.StrKey.encodeEd25519PublicKey(address.accountId().ed25519());
            }
            return stellar_sdk_1.StrKey.encodeContract(address.contractId());
        }
        case stellar_sdk_1.xdr.ScValType.scvBool(): {
            return scVal.b();
        }
        case stellar_sdk_1.xdr.ScValType.scvBytes(): {
            return scVal.bytes().toJSON().data;
        }
        case stellar_sdk_1.xdr.ScValType.scvContractInstance(): {
            const instance = scVal.instance();
            return instance.executable().wasmHash()?.toString("base64");
        }
        case stellar_sdk_1.xdr.ScValType.scvError(): {
            const error = scVal.error();
            return error.value();
        }
        case stellar_sdk_1.xdr.ScValType.scvTimepoint():
        case stellar_sdk_1.xdr.ScValType.scvDuration():
        case stellar_sdk_1.xdr.ScValType.scvI128():
        case stellar_sdk_1.xdr.ScValType.scvI256():
        case stellar_sdk_1.xdr.ScValType.scvI32():
        case stellar_sdk_1.xdr.ScValType.scvI64():
        case stellar_sdk_1.xdr.ScValType.scvU128():
        case stellar_sdk_1.xdr.ScValType.scvU256():
        case stellar_sdk_1.xdr.ScValType.scvU32():
        case stellar_sdk_1.xdr.ScValType.scvU64(): {
            return (0, stellar_sdk_1.scValToNative)(scVal).toString();
        }
        case stellar_sdk_1.xdr.ScValType.scvLedgerKeyNonce():
        case stellar_sdk_1.xdr.ScValType.scvLedgerKeyContractInstance(): {
            if (scVal.switch().name === "scvLedgerKeyNonce") {
                const val = scVal.nonceKey().nonce();
                return val.toString();
            }
            return scVal.value();
        }
        case stellar_sdk_1.xdr.ScValType.scvMap(): {
            const native = (0, stellar_sdk_1.scValToNative)(scVal);
            Object.keys(native).forEach((key) => {
                if (typeof native[key] === "bigint") {
                    native[key] = native[key].toString();
                }
            });
            return native;
        }
        case stellar_sdk_1.xdr.ScValType.scvString():
        case stellar_sdk_1.xdr.ScValType.scvSymbol(): {
            const native = (0, stellar_sdk_1.scValToNative)(scVal);
            if (native.constructor === "Uint8Array") {
                return native.toString();
            }
            return native;
        }
        case stellar_sdk_1.xdr.ScValType.scvVoid(): {
            return null;
        }
        default:
            return null;
    }
};
exports.scValByType = scValByType;
//# sourceMappingURL=sorobanXdrUtils.js.map