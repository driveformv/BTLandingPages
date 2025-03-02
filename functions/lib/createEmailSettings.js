"use strict";
/**
 * Create Email Settings in Firestore
 *
 * This script creates the email settings document in Firestore using the Firebase Admin SDK.
 * It's meant to be run once to ensure the email settings document exists.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmailSettings = createEmailSettings;
const admin = __importStar(require("firebase-admin"));
// Default email settings
const defaultEmailSettings = {
    to: ["sanhe@m-v-t.com"], // Default to current hardcoded email
    cc: [],
    bcc: []
};
/**
 * Create email settings in Firestore
 */
async function createEmailSettings() {
    try {
        console.log('Checking if email settings document exists...');
        // Check if the document already exists
        const docRef = admin.firestore().collection('settings').doc('emailNotifications');
        const docSnap = await docRef.get();
        if (docSnap.exists) {
            console.log('Email settings document already exists:', docSnap.data());
            return;
        }
        // Create the document with default settings
        console.log('Creating email settings document with default values...');
        await docRef.set(defaultEmailSettings);
        console.log('Email settings created successfully!');
        console.log('Default settings:', defaultEmailSettings);
    }
    catch (error) {
        console.error('Error creating email settings:', error);
    }
}
//# sourceMappingURL=createEmailSettings.js.map