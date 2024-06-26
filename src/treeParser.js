// This takes a base64 encoded xdr object with its type, and turns it into an
// object with more detailed information suitable for use in the tree view.

// This code was originally taken from the XDR Viewer <https://github.com/stellar/xdr-viewer>
// by the Stellar Development Foundation (SDF) under Apache-2.0.
// It includes later modifications made by the SDF as part of the Stellar Laboratory
// <https://github.com/stellar/laboratory> which have an ambiguous licensing status.

// Node.js adaptation by Alex Olieman <https://keybase.io/alioli>

import {
  xdr,
  StrKey,
  Keypair,
  Operation,
} from "@stellar/stellar-sdk";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import functionsIn from "lodash/functionsIn";
import includes from "lodash/includes";
import without from "lodash/without";
import { scValByType } from "./sorobanXdrUtils";
import { Buffer } from 'node:buffer';

export default function extrapolateFromXdr(input, type) {
  // TODO: Check to see if type exists
  // TODO: input validation

  function buildTreeFromObject(object, anchor, name) {
    anchor.type = name;

    if (isArray(object)) {
      parseArray(anchor, object);
    } else if (!hasChildren(object)) {
      anchor.value = getValue(object, name);
    } else if (object.switch) {
      parseArm(anchor, object);
    } else {
      parseNormal(anchor, object);
    }
  }

  function parseArray(anchor, object) {
    anchor.value = `Array[${object.length}]`;
    anchor.nodes = [];
    for (var i = 0; i < object.length; i++) {
      anchor.nodes.push({});
      buildTreeFromObject(
        object[i],
        anchor.nodes[anchor.nodes.length - 1],
        "[" + i + "]",
      );
    }
  }

  function parseArm(anchor, object) {
    anchor.value = "[" + object.switch().name + "]";
    if (isString(object.arm())) {
      anchor.nodes = [{}];
      buildTreeFromObject(
        // Soroban or Classic
        scValByType(object) ?? object[object.arm()](),
        anchor.nodes[anchor.nodes.length - 1],
        object.arm(),
      );
    }
  }

  function parseNormal(anchor, object) {
    anchor.nodes = [];
    without(functionsIn(object), "toXDR").forEach(function (name) {
      anchor.nodes.push({});
      buildTreeFromObject(
        object[name](),
        anchor.nodes[anchor.nodes.length - 1],
        name,
      );
    });
  }

  function hasChildren(object) {
    // string
    if (isString(object)) {
      return false;
    }
    // node buffer
    if (object && Buffer.isBuffer(object)) {
      return false;
    }
    var functions = functionsIn(object);
    if (functions.length == 0) {
      return false;
    }
    // int64
    if (
      includes(functions, "getLowBits") &&
      includes(functions, "getHighBits")
    ) {
      return false;
    }
    return true;
  }

  const amountFields = [
    "amount",
    "startingBalance",
    "sendMax",
    "sendAmount",
    "destMin",
    "destAmount",
    "limit",
  ];

  function getValue(object, name) {
    if (includes(amountFields, name)) {
      return {
        type: "amount",
        value: {
          parsed: Operation._fromXDRAmount(object),
          raw: object.toString(),
        },
      };
    }

    if (name === "hint") {
      // strkey encoding is using base32 encoding. Encoded public key consists of:
      //
      //  * 1 byte version byte (0x30 encoded as `G`)
      //  * 32 bytes public key
      //  * 2 bytes checksum
      //
      // Because base32 symbols are 5-bit, more than one symbol is needed to represent a single byte.
      // Signature Hint is the last 4 bytes of the public key. So we need to try to show as many 5-bit
      // chunks as possible included between bytes 30 and 33 (included).
      //
      // byte 1: ##### ###
      // byte 2:          ## ##### #
      // byte 3:                    #### ####
      // byte 4:                             # ##### ##
      // byte 5:                                       ### #####  <---------- 40 bits / full alignment
      // byte 6:                                                ##### ###
      // byte 7:                                                         ## ##### #
      //
      // .....
      //
      // byte 26: ##### ###
      // byte 27:          ## ##### #
      // byte 28:                    #### ####                    full b32 symbols
      // byte 29:                             # ##### ##    |--------------------------|
      // byte 30:                                       ### 48###                      |
      // byte 31:                  Signature Hint start |        49### 50#             |    Signature Hint end
      // byte 32:                                                         ## 51### 5   |    |
      // byte 33:                                                                   2### 53##
      // byte 34:                                                                            # 54### 55
      // byte 35:                                                                                      ### 56###
      //
      let hintBytes = Buffer.from(object, "base64");
      let partialPublicKey = Buffer.concat([Buffer.alloc(28).fill(0), hintBytes]);
      let keypair = new Keypair({
        type: "ed25519",
        publicKey: partialPublicKey,
      });
      let partialPublicKeyString =
        "G" +
        Buffer.alloc(46).fill("_").toString() +
        keypair.publicKey().substr(47, 5) +
        Buffer.alloc(4).fill("_").toString();
      return { type: "code", value: partialPublicKeyString };
    }

    if (name === "ed25519" || name === "sourceAccountEd25519") {
      var address = StrKey.encodeEd25519PublicKey(object);
      return { type: "code", value: address };
    }

    if (
      name === "assetCode"
      || name === "assetCode4"
      || name === "assetCode12"
    ) {
      return object.toString();
    }

    if (name === "contractId" && object) {
      return StrKey.encodeContract(object);
    }

    if (name === "functionName" || name === "sym") {
      return object.toString();
    }

    if (
      name === "durability"
      || name === "type"
      || name === "map"
    ) {
      return object;
    }

    if (object && Buffer.isBuffer(object)) {
      return {
        type: "code",
        raw: object,
        value: Buffer.from(object).toString("base64"),
      };
    }

    if (typeof object === "undefined") {
      return;
    }

    // getValue is a leaf in the recursive xdr extrapolating function meaning that
    // whatever this function returns will be in the final result as-is.
    // Therefore, we want them in string format so that it displayable in React.
    // One example of why we need this is that UnsignedHyper values won't get
    // displayed unless we convert it to a string.
    if (typeof object.toString === "function") {
      return object.toString();
    }

    throw new Error(
      "Not implemented: Encountered value type in XDR that does not have a toString method",
    );
  }

  let xdrObject;
  try {
    xdrObject = xdr[type].fromXDR(input, "base64");
  } catch (error) {
    throw new Error(`Input XDR could not be parsed as ${type}`);
  }

  let tree = [{}];
  buildTreeFromObject(xdrObject, tree[0], type);
  return tree;
}
