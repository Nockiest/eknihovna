import '@testing-library/jest-dom';
import { JSDOM } from "jsdom";

const config = {
    url: "https://localhost:3000/",
    domain: "eknihovna.vercel.app",
};
const dom = new JSDOM("", config);
global.document = dom.window.document;
global.document.domain = config.domain;
global.window = dom.window as Window & typeof globalThis;
global.location = dom.window.location;