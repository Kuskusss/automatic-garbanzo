"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowRefService = void 0;
function getWindow() {
    return typeof window !== 'undefined' ? window : null;
}
class WindowRefService {
    get nativeWindow() {
        return getWindow();
    }
}
exports.WindowRefService = WindowRefService;
