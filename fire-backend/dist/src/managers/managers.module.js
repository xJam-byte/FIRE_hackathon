"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagersModule = void 0;
const common_1 = require("@nestjs/common");
const managers_service_1 = require("./managers.service");
const managers_controller_1 = require("./managers.controller");
let ManagersModule = class ManagersModule {
};
exports.ManagersModule = ManagersModule;
exports.ManagersModule = ManagersModule = __decorate([
    (0, common_1.Module)({
        controllers: [managers_controller_1.ManagersController],
        providers: [managers_service_1.ManagersService],
        exports: [managers_service_1.ManagersService],
    })
], ManagersModule);
//# sourceMappingURL=managers.module.js.map