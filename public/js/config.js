// Firebase Configuration
const firebaseConfig = {
    // Replace with your actual Firebase config
    apiKey: "your-api-key-here",
    authDomain: "hopefund-donations.firebaseapp.com",
    projectId: "hopefund-donations",
    storageBucket: "hopefund-donations.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456789012345678",
    measurementId: "G-ABCDEFGHIJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const db = firebase.firestore();
const auth = firebase.auth();
const functions = firebase.functions();

// Google Pay Configuration
const googlepayConfig = {
    environment: 'TEST', // Change to 'PRODUCTION' for live
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [
        {
            type: 'CARD',
            parameters: {
                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA']
            },
            tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                parameters: {
                    gateway: 'razorpay', // or your preferred gateway
                    gatewayMerchantId: 'your-merchant-id' // Replace with actual merchant ID
                }
            }
        },
        {
            type: 'UPI',
            parameters: {
                payeeVpa: 'hopefund@razorpay', // Replace with actual UPI ID
                payeeName: 'HopeFund',
                mcc: '8398', // Merchant Category Code for charity
                tr: '', // Transaction reference (will be set dynamically)
            }
        }
    ],
    merchantInfo: {
        merchantId: 'your-google-pay-merchant-id', // Replace with actual Google Pay merchant ID
        merchantName: 'HopeFund'
    }
};

// Export configurations
window.firebaseConfig = firebaseConfig;
window.googlepayConfig = googlepayConfig;
window.db = db;
window.auth = auth;
window.functions = functions;
