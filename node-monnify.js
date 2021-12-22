const axios = require('axios')
const fs = require('fs')
const httpClient = axios.create();
httpClient.defaults.timeout = 9800000;

const MONNIFY_BASE_API_URL = 'https://api.monnify.com/api';
const DEFAULT_CONTRACT_CODE = process.env.DEFAULT_CONTRACT_CODE || 'CONTRACT_CODE';
const PREFERRED_BANK_CODES = ['232', '50515', '035'];
const API_KEY = process.env.API_KEY || "API_KEY";
const API_SECRET =  process.env.API_SECRET || "API_SECRET";

const encodeAuthenticationCredentials = (apiKey, apiSecret) => {
    const encodedToken = Buffer.from(${apiKey}:${apiSecret}).toString('base64');
    return encodedToken;
}

const retrieveTokenFromMonnifyAPI = async() => {
    try {
        const loginAPI = ${MONNIFY_BASE_API_URL}/v1/auth/login;
        const encodedToken = encodeAuthenticationCredentials(API_KEY, API_SECRET);
        const response = await axios.post(loginAPI, {}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': Basic ${encodedToken}
            }
        })
        const responseBody = response.data && response.data.responseBody;
        if (responseBody) {
            return responseBody.accessToken;
        }
    } catch (ex) {
        console.log("An error occurred while creating reserved account", ex);
        throw ex;
    }

}

const createReservedAccount = async(reservedAccountDTO) => {
    // validateRequest(reservedAccountDTO);
    const bearerToken = await retrieveTokenFromMonnifyAPI();
    if (bearerToken) {
        const reservedAccountAPI = ${MONNIFY_BASE_API_URL}/v2/bank-transfer/reserved-accounts;
        const resrvedAccountRequest = {
            accountReference: reservedAccountDTO.accountReference,
            contractCode: DEFAULT_CONTRACT_CODE,
            currencyCode: 'NGN',
            getAllAvailableBanks: false,
            customerEmail: reservedAccountDTO && reservedAccountDTO.customerEmail,
            accountName: reservedAccountDTO && reservedAccountDTO.accountName,
            customerName: reservedAccountDTO && reservedAccountDTO.customerName,
            preferredBanks: PREFERRED_BANK_CODES
        };

        try {
            const response = await axios.post(reservedAccountAPI, resrvedAccountRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Bearer ${bearerToken}
                }
            })
            const responseBody = response.data && response.data.responseBody;
            if (responseBody) {
                console.log('Successfully created a reserved account ', JSON.stringify(responseBody))
            } else {
                console.log('Empty response body')
            }
        } catch (ex) {
            console.log("An error occurred while creating reserved account", ex);
        }
    }

}

createReservedAccount({
    accountReference: KONGA ${Date.now()},
    customerEmail: 'testEmail@test.com',
    accountName: 'Okunnuga and Friends',
    customerName: 'Okunnuga'
})
