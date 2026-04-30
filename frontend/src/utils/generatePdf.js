import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generatePdf(result) {
  const { phoneInfo, pricing, analysis, recommendations } = result;
  const fmt = (n) => '₹' + n.toLocaleString('en-IN');
  const sevColor = (s) => s === 'Critical' ? '#dc2626' : s === 'High' ? '#ea580c' : s === 'Medium' ? '#ca8a04' : '#16a34a';

  // Create off-screen container
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:-9999px;top:0;width:800px;background:#fff;font-family:Inter,system-ui,sans-serif;color:#1a1a2e;padding:40px;';

  container.innerHTML = `
    <div style="border-bottom:3px solid #00d4ff;padding-bottom:20px;margin-bottom:30px;display:flex;align-items:center;justify-content:space-between">
      <div>
        <h1 style="font-size:24px;font-weight:800;margin:0;color:#0a0a0f">TrustLens <span style="color:#00d4ff">AI</span></h1>
        <p style="font-size:11px;color:#666;margin:4px 0 0;letter-spacing:2px;text-transform:uppercase">Price Analysis Report</p>
      </div>
      <div style="text-align:right">
        <p style="font-size:11px;color:#888;margin:0">${new Date(result.timestamp).toLocaleString()}</p>
        <p style="font-size:10px;color:#aaa;margin:2px 0 0">Report ID: TL-${Date.now().toString(36).toUpperCase()}</p>
      </div>
    </div>

    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:12px;padding:16px 20px;margin-bottom:24px;display:flex;gap:12px;flex-wrap:wrap">
      ${[
        ['Brand', phoneInfo.brand],
        ['Model', phoneInfo.model],
        ['Condition', phoneInfo.condition],
        ['Storage', phoneInfo.storage],
        ['RAM', phoneInfo.ram],
      ].map(([k, v]) => `<div style="flex:1;min-width:120px"><p style="font-size:10px;color:#64748b;margin:0 0 2px;text-transform:uppercase;letter-spacing:1px">${k}</p><p style="font-size:14px;font-weight:600;margin:0;color:#0f172a">${v.charAt(0).toUpperCase() + v.slice(1)}</p></div>`).join('')}
    </div>

    <div style="display:flex;gap:16px;margin-bottom:24px">
      <div style="flex:1;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:24px;text-align:center">
        <p style="font-size:12px;font-weight:600;color:#16a34a;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px">Predicted Market Price</p>
        <p style="font-size:13px;color:#94a3b8;text-decoration:line-through;margin:0 0 4px">${fmt(pricing.originalPrice)} MRP</p>
        <p style="font-size:36px;font-weight:800;color:#059669;margin:0">${fmt(pricing.predictedPrice)}</p>
        <p style="font-size:12px;color:#64748b;margin:8px 0 0">Range: ${fmt(pricing.priceLow)} — ${fmt(pricing.priceHigh)}</p>
        <div style="display:flex;gap:12px;margin-top:16px">
          <div style="flex:1;background:#fff;border-radius:8px;padding:10px;border:1px solid #e2e8f0">
            <p style="font-size:10px;color:#94a3b8;margin:0 0 2px">Discount</p>
            <p style="font-size:18px;font-weight:700;color:#ea580c;margin:0">${(pricing.discount * 100).toFixed(0)}%</p>
          </div>
          <div style="flex:1;background:#fff;border-radius:8px;padding:10px;border:1px solid #e2e8f0">
            <p style="font-size:10px;color:#94a3b8;margin:0 0 2px">vs Market</p>
            <p style="font-size:18px;font-weight:700;color:${pricing.marketDiffPercent >= 0 ? '#059669' : '#dc2626'};margin:0">${pricing.marketDiffPercent >= 0 ? '+' : ''}${pricing.marketDiffPercent}%</p>
          </div>
        </div>
      </div>

      <div style="flex:1;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px">
        <p style="font-size:12px;font-weight:600;color:#0ea5e9;margin:0 0 16px;text-transform:uppercase;letter-spacing:1px">Condition Analysis</p>
        <div style="display:flex;align-items:center;gap:20px">
          <div style="text-align:center">
            <div style="width:80px;height:80px;border-radius:50%;border:6px solid ${sevColor(analysis.severityScore > 7 ? 'Critical' : analysis.severityScore > 5 ? 'High' : analysis.severityScore > 2 ? 'Medium' : 'Low')};display:flex;align-items:center;justify-content:center">
              <span style="font-size:24px;font-weight:800;color:#0f172a">${analysis.severityScore}</span>
            </div>
            <p style="font-size:10px;color:#64748b;margin:6px 0 0">Severity /10</p>
          </div>
          <div style="flex:1">
            ${[
              ['Grade', analysis.grade, '#0ea5e9'],
              ['Confidence', analysis.confidenceScore + '%', '#8b5cf6'],
              ['Condition', phoneInfo.condition, '#0f172a'],
            ].map(([k, v, c]) => `<div style="display:flex;justify-content:space-between;padding:8px 12px;background:#fff;border-radius:8px;margin-bottom:6px;border:1px solid #f1f5f9"><span style="font-size:12px;color:#64748b">${k}</span><span style="font-size:13px;font-weight:700;color:${c}">${v}</span></div>`).join('')}
          </div>
        </div>
      </div>
    </div>

    ${analysis.detections.length > 0 ? `
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:20px;margin-bottom:24px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <p style="font-size:12px;font-weight:600;color:#ea580c;margin:0;text-transform:uppercase;letter-spacing:1px">Damage Detection</p>
        <p style="font-size:11px;color:#94a3b8;margin:0">${analysis.imagesAnalyzed} image(s) · ${analysis.totalDamageArea}% total area</p>
      </div>
      ${analysis.detections.map(d => `
        <div style="display:flex;align-items:center;padding:10px 14px;background:#fff;border-radius:8px;margin-bottom:6px;border:1px solid #f1f5f9">
          <div style="width:8px;height:8px;border-radius:50%;background:${sevColor(d.severity)};margin-right:12px"></div>
          <div style="flex:1">
            <span style="font-size:13px;font-weight:600;color:#0f172a">${d.label}</span>
            <span style="font-size:11px;color:#94a3b8;margin-left:12px">Confidence: ${(d.confidence * 100).toFixed(0)}% · Area: ${d.area}%</span>
          </div>
          <span style="font-size:11px;font-weight:600;color:${sevColor(d.severity)};background:${sevColor(d.severity)}15;padding:3px 10px;border-radius:20px">${d.severity}</span>
        </div>
      `).join('')}
    </div>` : `
    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center">
      <p style="font-size:14px;font-weight:600;color:#16a34a;margin:0">✅ No damage detected</p>
      <p style="font-size:11px;color:#94a3b8;margin:4px 0 0">${analysis.imagesAnalyzed} image(s) analyzed by YOLOv8</p>
    </div>`}

    <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:12px;padding:20px;margin-bottom:24px">
      <p style="font-size:12px;font-weight:600;color:#7c3aed;margin:0 0 14px;text-transform:uppercase;letter-spacing:1px">AI Recommendations</p>
      ${recommendations.map(r => `
        <div style="display:flex;align-items:flex-start;gap:10px;padding:10px 14px;background:#fff;border-radius:8px;margin-bottom:6px;border:1px solid #f1f5f9">
          <span style="font-size:16px;flex-shrink:0">${r.icon}</span>
          <p style="font-size:13px;color:#334155;margin:0;line-height:1.5">${r.text}</p>
        </div>
      `).join('')}
    </div>

    <div style="border-top:1px solid #e2e8f0;padding-top:16px;display:flex;justify-content:space-between;align-items:center">
      <p style="font-size:10px;color:#94a3b8;margin:0">Powered by YOLOv8 AI + TrustLens Engine</p>
      <p style="font-size:10px;color:#94a3b8;margin:0">© ${new Date().getFullYear()} TrustLens AI — For informational purposes only</p>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    const imgWidth = 210; // A4 width mm
    const pageHeight = 297; // A4 height mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF('p', 'mm', 'a4');

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = -(imgHeight - heightLeft);
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const brand = phoneInfo.brand.charAt(0).toUpperCase() + phoneInfo.brand.slice(1);
    pdf.save(`TrustLens_Report_${brand}_${phoneInfo.model.replace(/\s+/g, '_')}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
