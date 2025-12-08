import { NextResponse } from 'next/server';
import { generateNewebPayForm } from '@/lib/newebpay'; // 確保引用正確

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { items, email, amount } = body; // 👈 接收 amount

        // 1. 產生訂單編號
        const orderId = `ORDER_${Date.now()}`;

        // 2. 決定最終金額 (雙重保險：如果前端有傳就用前端的，沒傳就自己算)
        let finalAmount = amount;
        if (!finalAmount) {
            finalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
        }

        // 3. 產生商品描述 (藍新限制長度，我們只取前幾個字)
        const itemDesc = items.map((item: any) => item.title).join(', ').slice(0, 45) + '...';

        console.log('📦 準備結帳:', { orderId, finalAmount, email }); // Debug 用

        // 4. 呼叫我們寫好的 NewebPay 函式
        const paymentData = generateNewebPayForm({
            id: orderId,
            amount: finalAmount, // 👈 確保這裡不是 0 或 undefined
            email: email || 'guest@example.com',
            desc: itemDesc,
        });

        return NextResponse.json({
            status: 'success',
            form: {
                MerchantID: paymentData.MerchantID,
                TradeInfo: paymentData.TradeInfo,
                TradeSha: paymentData.TradeSha,
                Version: paymentData.Version,
            },
            url: paymentData.Url,
        });

    } catch (error) {
        console.error('Checkout API Error:', error);
        return NextResponse.json(
            { status: 'error', error: (error as Error).message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

