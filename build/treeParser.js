"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const stellar_sdk_1 = require("@stellar/stellar-sdk");
const isArray_1 = tslib_1.__importDefault(require("lodash/isArray"));
const isString_1 = tslib_1.__importDefault(require("lodash/isString"));
const functionsIn_1 = tslib_1.__importDefault(require("lodash/functionsIn"));
const includes_1 = tslib_1.__importDefault(require("lodash/includes"));
const without_1 = tslib_1.__importDefault(require("lodash/without"));
const sorobanXdrUtils_1 = require("./sorobanXdrUtils");
const node_buffer_1 = require("node:buffer");
function extrapolateFromXdr(input, type) {
    function buildTreeFromObject(object, anchor, name) {
        anchor.type = name;
        if ((0, isArray_1.default)(object)) {
            parseArray(anchor, object);
        }
        else if (!hasChildren(object)) {
            anchor.value = getValue(object, name);
        }
        else if (object.switch) {
            parseArm(anchor, object);
        }
        else {
            parseNormal(anchor, object);
        }
    }
    function parseArray(anchor, object) {
        anchor.value = `Array[${object.length}]`;
        anchor.nodes = [];
        for (var i = 0; i < object.length; i++) {
            anchor.nodes.push({});
            buildTreeFromObject(object[i], anchor.nodes[anchor.nodes.length - 1], "[" + i + "]");
        }
    }
    function parseArm(anchor, object) {
        anchor.value = "[" + object.switch().name + "]";
        if ((0, isString_1.default)(object.arm())) {
            anchor.nodes = [{}];
            buildTreeFromObject((0, sorobanXdrUtils_1.scValByType)(object) ?? object[object.arm()](), anchor.nodes[anchor.nodes.length - 1], object.arm());
        }
    }
    function parseNormal(anchor, object) {
        anchor.nodes = [];
        (0, without_1.default)((0, functionsIn_1.default)(object), "toXDR").forEach(function (name) {
            anchor.nodes.push({});
            buildTreeFromObject(object[name](), anchor.nodes[anchor.nodes.length - 1], name);
        });
    }
    function hasChildren(object) {
        if ((0, isString_1.default)(object)) {
            return false;
        }
        if (object && node_buffer_1.Buffer.isBuffer(object)) {
            return false;
        }
        var functions = (0, functionsIn_1.default)(object);
        if (functions.length == 0) {
            return false;
        }
        if ((0, includes_1.default)(functions, "getLowBits") &&
            (0, includes_1.default)(functions, "getHighBits")) {
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
        if ((0, includes_1.default)(amountFields, name)) {
            return {
                type: "amount",
                value: {
                    parsed: stellar_sdk_1.Operation._fromXDRAmount(object),
                    raw: object.toString(),
                },
            };
        }
        if (name === "hint") {
            let hintBytes = node_buffer_1.Buffer.from(object, "base64");
            let partialPublicKey = node_buffer_1.Buffer.concat([node_buffer_1.Buffer.alloc(28).fill(0), hintBytes]);
            let keypair = new stellar_sdk_1.Keypair({
                type: "ed25519",
                publicKey: partialPublicKey,
            });
            let partialPublicKeyString = "G" +
                node_buffer_1.Buffer.alloc(46).fill("_").toString() +
                keypair.publicKey().substr(47, 5) +
                node_buffer_1.Buffer.alloc(4).fill("_").toString();
            return { type: "code", value: partialPublicKeyString };
        }
        if (name === "ed25519" || name === "sourceAccountEd25519") {
            var address = stellar_sdk_1.StrKey.encodeEd25519PublicKey(object);
            return { type: "code", value: address };
        }
        if (name === "assetCode"
            || name === "assetCode4"
            || name === "assetCode12") {
            return object.toString();
        }
        if (name === "contractId" && object) {
            return stellar_sdk_1.StrKey.encodeContract(object);
        }
        if (name === "functionName" || name === "sym") {
            return object.toString();
        }
        if (name === "durability"
            || name === "type"
            || name === "map") {
            return object;
        }
        if (object && node_buffer_1.Buffer.isBuffer(object)) {
            return {
                type: "code",
                raw: object,
                value: node_buffer_1.Buffer.from(object).toString("base64"),
            };
        }
        if (typeof object === "undefined") {
            return;
        }
        if (typeof object.toString === "function") {
            return object.toString();
        }
        throw new Error("Not implemented: Encountered value type in XDR that does not have a toString method");
    }
    let xdrObject;
    try {
        xdrObject = stellar_sdk_1.xdr[type].fromXDR(input, "base64");
    }
    catch (error) {
        throw new Error(`Input XDR could not be parsed as ${type}`);
    }
    let tree = [{}];
    buildTreeFromObject(xdrObject, tree[0], type);
    return tree;
}
exports.default = extrapolateFromXdr;
//# sourceMappingURL=treeParser.js.map