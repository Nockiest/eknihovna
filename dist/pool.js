"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let pool;
// console.log(process.env.NODE_ENV === 'production')
// if (process.env.NODE_ENV === 'production') {
exports.pool = pool = new pg_1.Pool({
    connectionString: process.env.POSTGRES_URL,
});
