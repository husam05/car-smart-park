import { PARKING_CONFIG } from './config';

function formatCurrencyPrint(amount: number): string {
    return amount.toLocaleString('en-US') + ' د.ع';
}

function formatDateArabic(date: Date): string {
    return date.toLocaleDateString('ar-IQ', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTimeArabic(date: Date): string {
    return date.toLocaleTimeString('ar-IQ', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export function printEntryReceipt(details: {
    plate: string;
    entryTime: Date;
    amount: number;
    ticketId: string;
    qrSvg?: string;
}) {
    const win = window.open('', '', 'height=700,width=420');
    if (!win) return;

    const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>وصل دخول - نظام إدارة المواقف الذكي</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
            width: 80mm;
            max-width: 320px;
            margin: 0 auto;
            padding: 12px;
            color: #000;
            background: #fff;
            direction: rtl;
        }
        .receipt {
            padding: 16px;
            position: relative;
        }
        .header {
            text-align: center;
            border-bottom: 2px dashed #999;
            padding-bottom: 14px;
            margin-bottom: 14px;
        }
        .header .logo-box {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border: 2.5px solid #1a1a2e;
            border-radius: 10px;
            margin-bottom: 8px;
            font-size: 22px;
            font-weight: 800;
            color: #1a1a2e;
        }
        .header h1 {
            font-size: 16px;
            font-weight: 800;
            color: #1a1a2e;
            margin: 4px 0 2px;
        }
        .header .en-name {
            font-size: 11px;
            font-weight: 700;
            color: #555;
            letter-spacing: 4px;
            text-transform: uppercase;
        }
        .header .location {
            font-size: 10px;
            color: #888;
            margin-top: 4px;
        }
        .type-badge {
            display: inline-block;
            background: #e8f5e9;
            color: #2e7d32;
            padding: 5px 20px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 14px;
            margin-top: 10px;
            border: 1.5px solid #a5d6a7;
        }
        .plate-box {
            text-align: center;
            background: #f5f5f5;
            border: 2.5px solid #1a1a2e;
            border-radius: 10px;
            padding: 10px 16px;
            margin: 14px 0;
        }
        .plate-box .plate {
            font-size: 24px;
            font-weight: 800;
            letter-spacing: 3px;
            font-family: 'Courier New', monospace;
            direction: ltr;
            color: #1a1a2e;
        }
        .details {
            margin: 14px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 7px 0;
            font-size: 12px;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child { border-bottom: none; }
        .detail-row .label { color: #777; }
        .detail-row .value {
            font-weight: 700;
            font-family: 'Courier New', monospace;
            color: #1a1a2e;
        }
        .amount-section {
            border-top: 2.5px dashed #999;
            border-bottom: 2.5px dashed #999;
            padding: 14px 0;
            margin: 14px 0;
            text-align: center;
        }
        .amount-section .label {
            font-size: 11px;
            color: #777;
            margin-bottom: 4px;
        }
        .amount-section .amount {
            font-size: 26px;
            font-weight: 800;
            color: #2e7d32;
            direction: ltr;
        }
        .info-box {
            background: #f8f9fa;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 10px;
            text-align: center;
            font-size: 10px;
            color: #666;
            margin: 14px 0;
        }
        .info-box p { margin: 3px 0; }
        .info-box strong { color: #333; }
        .qr-section {
            text-align: center;
            margin: 16px 0 10px;
        }
        .qr-section .qr-box {
            display: inline-block;
            border: 2px solid #1a1a2e;
            border-radius: 8px;
            padding: 6px;
            background: white;
        }
        .qr-section .qr-box svg {
            width: 110px;
            height: 110px;
        }
        .qr-section .qr-label {
            font-size: 9px;
            color: #aaa;
            margin-top: 6px;
        }
        .footer {
            text-align: center;
            font-size: 9px;
            color: #aaa;
            border-top: 1px solid #eee;
            padding-top: 10px;
            margin-top: 14px;
        }
        .footer p { margin: 2px 0; }
        .footer .ticket-id {
            font-family: 'Courier New', monospace;
            font-size: 8px;
            color: #ccc;
            margin-top: 6px;
            word-break: break-all;
        }
        @media print {
            body { margin: 0; padding: 8px; }
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <div class="logo-box">P</div>
            <h1>نظام إدارة المواقف الذكي</h1>
            <div class="en-name">SMART PARK</div>
            <div class="location">بغداد - البوابة الرئيسية</div>
            <div class="type-badge">تذكرة دخول</div>
        </div>

        <div class="plate-box">
            <div class="plate">${escapeHtml(details.plate)}</div>
        </div>

        <div class="details">
            <div class="detail-row">
                <span class="label">التاريخ:</span>
                <span class="value">${formatDateArabic(details.entryTime)}</span>
            </div>
            <div class="detail-row">
                <span class="label">وقت الدخول:</span>
                <span class="value">${formatTimeArabic(details.entryTime)}</span>
            </div>
        </div>

        <div class="amount-section">
            <div class="label">رسوم الدخول</div>
            <div class="amount">${formatCurrencyPrint(details.amount)}</div>
        </div>

        <div class="info-box">
            <p><strong>التعرفة:</strong> ${formatCurrencyPrint(PARKING_CONFIG.HOURLY_RATE)} / ساعة</p>
            <p>رسوم التذكرة المفقودة: ${formatCurrencyPrint(PARKING_CONFIG.LOST_TICKET_FEE)}</p>
        </div>

        ${details.qrSvg ? `
        <div class="qr-section">
            <div class="qr-box">${details.qrSvg}</div>
            <div class="qr-label">امسح الرمز لمعرفة مكان سيارتك وحالة التذكرة</div>
        </div>
        ` : ''}

        <div class="footer">
            <p>شكراً لاستخدامكم مواقفنا</p>
            <p>يرجى الاحتفاظ بالتذكرة للخروج</p>
            <div class="ticket-id">${escapeHtml(details.ticketId)}</div>
        </div>
    </div>
</body>
</html>`;

    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 600);
}

export function printFinancialReport(data: {
    totalRevenue: number;
    occupancyRate: number;
    avgTicket: number;
    currentHourlyRunRate: number;
    exitCount: number;
    occupiedCount: number;
    transactions: Array<{
        plate: string;
        time: string;
        amount: number;
        duration: string;
    }>;
}) {
    const win = window.open('', '', 'height=900,width=800');
    if (!win) return;

    const now = new Date();

    const transactionRows = data.transactions.map((t, i) => `
        <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'}">
            <td style="padding:8px 12px;border-bottom:1px solid #eee;direction:ltr;font-family:'Courier New',monospace;font-weight:600;">${escapeHtml(t.plate)}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(t.time)}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(t.duration)}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #eee;direction:ltr;font-weight:700;color:#2e7d32;">${formatCurrencyPrint(t.amount)}</td>
        </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <title>التقرير المالي - نظام إدارة المواقف الذكي</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Cairo', 'Segoe UI', Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 24px;
            color: #1a1a2e;
            background: #fff;
            direction: rtl;
        }
        .report-header {
            text-align: center;
            border-bottom: 3px solid #1a1a2e;
            padding-bottom: 16px;
            margin-bottom: 24px;
        }
        .report-header .logo-box {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
            border: 3px solid #1a1a2e;
            border-radius: 12px;
            font-size: 24px;
            font-weight: 800;
            margin-bottom: 8px;
        }
        .report-header h1 { font-size: 22px; font-weight: 800; margin: 4px 0; }
        .report-header h2 { font-size: 16px; font-weight: 600; color: #3b82f6; margin: 4px 0; }
        .report-header .meta { font-size: 11px; color: #666; margin-top: 8px; }

        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin: 24px 0;
        }
        .kpi-card {
            border: 1.5px solid #e0e0e0;
            border-radius: 10px;
            padding: 14px;
            text-align: center;
        }
        .kpi-card .label { font-size: 10px; color: #666; font-weight: 700; text-transform: uppercase; }
        .kpi-card .value { font-size: 24px; font-weight: 800; margin: 6px 0; direction: ltr; }
        .kpi-card .sub { font-size: 9px; color: #999; }
        .kpi-card.green { border-color: #a5d6a7; }
        .kpi-card.green .value { color: #2e7d32; }
        .kpi-card.blue { border-color: #90caf9; }
        .kpi-card.blue .value { color: #1565c0; }
        .kpi-card.purple { border-color: #ce93d8; }
        .kpi-card.purple .value { color: #7b1fa2; }
        .kpi-card.orange { border-color: #ffcc80; }
        .kpi-card.orange .value { color: #e65100; }

        .occupancy-bar {
            width: 100%;
            height: 18px;
            background: #e0e0e0;
            border-radius: 9px;
            overflow: hidden;
            margin: 16px 0;
        }
        .occupancy-fill {
            height: 100%;
            background: linear-gradient(90deg, #1565c0, #42a5f5);
            border-radius: 9px;
            position: relative;
        }
        .occupancy-fill::after {
            content: '${data.occupancyRate.toFixed(1)}%';
            position: absolute;
            right: 8px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 10px;
            font-weight: 700;
            color: white;
        }

        .section-title {
            font-size: 16px;
            font-weight: 700;
            margin: 28px 0 14px;
            padding-bottom: 8px;
            border-bottom: 2px solid #eee;
            color: #1a1a2e;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 14px 0;
            font-size: 11px;
        }
        th {
            background: #f5f5f5;
            padding: 10px 12px;
            text-align: right;
            font-weight: 700;
            border-bottom: 2.5px solid #ddd;
            font-size: 11px;
        }

        .summary-box {
            background: #f0f7ff;
            border: 1.5px solid #bbdefb;
            border-radius: 10px;
            padding: 16px;
            margin: 24px 0;
        }
        .summary-box h3 { font-size: 14px; margin-bottom: 8px; color: #1565c0; }
        .summary-box p { font-size: 12px; color: #333; line-height: 1.9; }
        .summary-box strong { color: #1a1a2e; }

        .report-footer {
            text-align: center;
            border-top: 3px solid #1a1a2e;
            padding-top: 14px;
            margin-top: 32px;
            font-size: 10px;
            color: #999;
        }
        .report-footer p { margin: 2px 0; }
        .report-footer .system-name {
            font-weight: 700;
            color: #1a1a2e;
            font-size: 11px;
        }

        @media print {
            body { padding: 16px; }
        }
    </style>
</head>
<body>
    <div class="report-header">
        <div class="logo-box">P</div>
        <h1>نظام إدارة المواقف الذكي</h1>
        <h2>التقرير المالي التشغيلي</h2>
        <div class="meta">
            تاريخ التقرير: ${formatDateArabic(now)} &nbsp;|&nbsp; الساعة: ${formatTimeArabic(now)}
        </div>
    </div>

    <div class="kpi-grid">
        <div class="kpi-card green">
            <div class="label">إجمالي الإيرادات</div>
            <div class="value">${formatCurrencyPrint(data.totalRevenue)}</div>
            <div class="sub">اليوم</div>
        </div>
        <div class="kpi-card blue">
            <div class="label">نسبة الإشغال</div>
            <div class="value">${data.occupancyRate.toFixed(1)}%</div>
            <div class="sub">${data.occupiedCount} / ${PARKING_CONFIG.TOTAL_SPOTS} موقف</div>
        </div>
        <div class="kpi-card purple">
            <div class="label">متوسط التذكرة</div>
            <div class="value">${formatCurrencyPrint(data.avgTicket)}</div>
            <div class="sub">لكل مركبة مغادرة</div>
        </div>
        <div class="kpi-card orange">
            <div class="label">الإيراد الساعي</div>
            <div class="value">${formatCurrencyPrint(data.currentHourlyRunRate)}</div>
            <div class="sub">معدل حالي</div>
        </div>
    </div>

    <div class="occupancy-bar">
        <div class="occupancy-fill" style="width: ${Math.min(100, data.occupancyRate)}%"></div>
    </div>

    <h3 class="section-title">المعاملات الأخيرة (${data.exitCount} مغادرة)</h3>

    ${data.transactions.length > 0 ? `
    <table>
        <thead>
            <tr>
                <th>رقم اللوحة</th>
                <th>الوقت</th>
                <th>المدة</th>
                <th>المبلغ</th>
            </tr>
        </thead>
        <tbody>
            ${transactionRows}
        </tbody>
    </table>
    ` : '<p style="text-align:center;color:#999;padding:24px;">لا توجد معاملات مسجلة بعد</p>'}

    <div class="summary-box">
        <h3>ملخص التحليل الذكي</h3>
        <p>
            نسبة الإشغال الحالية: <strong>${data.occupancyRate.toFixed(1)}%</strong> &nbsp;|&nbsp;
            عدد المغادرات: <strong>${data.exitCount}</strong> &nbsp;|&nbsp;
            الإيراد الساعي المتوقع: <strong>${formatCurrencyPrint(data.currentHourlyRunRate)}</strong>
        </p>
    </div>

    <div class="report-footer">
        <p class="system-name">نظام إدارة المواقف الذكي - SMART PARK</p>
        <p>تقرير مولّد تلقائياً | ${formatDateArabic(now)} ${formatTimeArabic(now)}</p>
    </div>
</body>
</html>`;

    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 600);
}
