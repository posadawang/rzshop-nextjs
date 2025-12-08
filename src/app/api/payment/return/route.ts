import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        // 1. 接收藍新傳回來的資料 (Form Data)
        const formData = await request.formData();
        const tradeInfo = formData.get('TradeInfo') as string;
        // const tradeSha = formData.get('TradeSha') as string; // 目前暫時不需要驗證 SHA

        if (!tradeInfo) {
            return NextResponse.redirect(new URL('/', request.url)); // 沒資料就回首頁
        }

        // 2. 解密 TradeInfo
        const key = process.env.NEWEB_HASH_KEY?.trim() || '';
        const iv = process.env.NEWEB_HASH_IV?.trim() || '';

        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
        decipher.setAutoPadding(false); // 我們手動處理 Padding
        let decrypted = decipher.update(tradeInfo, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        // 3. 去除 Padding (藍新使用 PKCS7)
        const padding = decrypted.charCodeAt(decrypted.length - 1);
        const cleanData = decrypted.slice(0, -padding);

        // 4. 解析 JSON
        const data = JSON.parse(cleanData);
        console.log('✅ 藍新回傳解密資料:', data);

        // 5. 判斷交易狀態
        if (data.Status === 'SUCCESS') {
            // 交易成功 -> 導向成功頁面
            // 這裡你可以把 data.Result.MerchantOrderNo 拿去資料庫更新訂單狀態
            return NextResponse.redirect(new URL('/success', request.url));
        } else {
            // 交易失敗 -> 導向首頁或錯誤頁
            console.error('交易失敗:', data.Message);
            return NextResponse.redirect(new URL('/?error=payment_failed', request.url));
        }

    } catch (error) {
        console.error('Return API Error:', error);
        return NextResponse.redirect(new URL('/', request.url));
    }
}
