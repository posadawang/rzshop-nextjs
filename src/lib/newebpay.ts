import crypto from 'crypto';

interface NewebPayParams {
    MerchantID: string;
    RespondType: 'JSON' | 'String';
    TimeStamp: string;
    Version: string;
    MerchantOrderNo: string;
    Amt: number;
    ItemDesc: string;
    Email?: string;
    LoginType?: number;
    ReturnURL?: string;
    NotifyURL?: string;
    ClientBackURL?: string;
}

function genDataChain(tradeInfo: Record<string, any>): string {
    const filtered = Object.entries(tradeInfo).filter(
        ([_, value]) => value !== undefined && value !== null && value !== ''
    );

    // Sort alphabetically
    filtered.sort((a, b) => {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
    });

    // URL Encode values
    return filtered.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&');
}

export function createMpgAesEncrypt(tradeInfo: Record<string, any>): string {
    const key = process.env.NEWEB_HASH_KEY?.trim();
    const iv = process.env.NEWEB_HASH_IV?.trim();

    if (!key || !iv) {
        throw new Error('NEWEB_HASH_KEY or NEWEB_HASH_IV is not set');
    }

    // NewebPay specific requirements: Key=32, IV=16
    if (key.length !== 32) {
        throw new Error(`NEWEB_HASH_KEY length error. Expected 32, got ${key.length}. Did you just copy the placeholder?`);
    }
    if (iv.length !== 16) {
        throw new Error(`NEWEB_HASH_IV length error. Expected 16, got ${iv.length}. Did you just copy the placeholder?`);
    }

    const parameterString = genDataChain(tradeInfo);
    console.log('AES Parameter String:', parameterString); // Debug log

    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(parameterString, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return encrypted;
}

export function createMpgShaEncrypt(aesEncrypt: string): string {
    const key = process.env.NEWEB_HASH_KEY?.trim();
    const iv = process.env.NEWEB_HASH_IV?.trim();

    if (!key || !iv) {
        throw new Error('NEWEB_HASH_KEY or NEWEB_HASH_IV is not set');
    }

    const raw = `HashKey=${key}&${aesEncrypt}&HashIV=${iv}`;
    console.log('SHA Raw String:', raw); // Debug log (Be careful normally, but needed here)

    const sha = crypto.createHash('sha256').update(raw).digest('hex').toUpperCase();

    return sha;
}

export function generateNewebPayForm(order: { id: string; amount: number; email: string; desc: string }) {
    const MerchantID = process.env.NEWEB_MERCHANT_ID?.trim();
    if (!MerchantID) throw new Error('NEWEB_MERCHANT_ID is missing');

    const TimeStamp = Math.round(new Date().getTime() / 1000).toString();

    // Ensure strict types
    const tradeInfo = {
        MerchantID,
        RespondType: 'JSON',
        TimeStamp,
        Version: process.env.NEWEB_VERSION || '2.0',
        MerchantOrderNo: order.id,
        Amt: Math.floor(order.amount), // Ensure integer
        ItemDesc: order.desc,
        Email: order.email,
        LoginType: 0,
        ReturnURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/return`,
        NotifyURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/notify`,
        ClientBackURL: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    };

    const tradeInfoAes = createMpgAesEncrypt(tradeInfo);
    const tradeInfoSha = createMpgShaEncrypt(tradeInfoAes);

    return {
        MerchantID,
        TradeInfo: tradeInfoAes,
        TradeSha: tradeInfoSha,
        Version: tradeInfo.Version,
        Url: process.env.NEWEB_API_URL || 'https://core.newebpay.com/MPG/mpg_gateway',
    };
}
