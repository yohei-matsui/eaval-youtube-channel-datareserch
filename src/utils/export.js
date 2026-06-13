import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function fmt(n) {
  if (n >= 100000000) return `${(n / 100000000).toFixed(1)}億`;
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`;
  return n.toLocaleString();
}

function fmtDate(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
}

function fmtRatio(longForm, shorts) {
  const total = longForm + shorts;
  if (total === 0) return '-';
  const l = Math.round((longForm / total) * 100);
  const s = Math.round((shorts / total) * 100);
  return `${l}% : ${s}%`;
}

const HEADERS = [
  'チャンネル名', 'URL', '開設日', '登録者数', '累計再生回数',
  '動画総数', '平均再生数(長尺)', '中央値(長尺)', '長尺:ショート',
];

function toRow(ch) {
  return [
    ch.title,
    ch.url,
    fmtDate(ch.publishedAt),
    fmt(ch.subscriberCount),
    fmt(ch.viewCount),
    ch.videoCount.toLocaleString(),
    fmt(ch.avgViews),
    fmt(ch.medianViews),
    fmtRatio(ch.longForm, ch.shorts),
  ];
}

export function exportCSV(channels, filename = 'channels') {
  const rows = [HEADERS, ...channels.map(toRow)];
  const bom = '﻿'; // Excel用BOM
  const csv = bom + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportPDF(channels, title = 'YouTubeチャンネルデータ分析', filename = 'channels') {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // タイトル（英字フォントのみ使用）
  doc.setFontSize(13);
  doc.text('YouTube Channel Data Report', 14, 15);
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(`Exported: ${new Date().toLocaleDateString('ja-JP')}  /  ${channels.length} channels`, 14, 22);

  autoTable(doc, {
    startY: 27,
    head: [['Channel', 'URL', 'Since', 'Subscribers', 'Total Views', 'Videos', 'Avg Views', 'Median', 'L:S Ratio']],
    body: channels.map(ch => [
      ch.title,
      ch.url,
      fmtDate(ch.publishedAt),
      fmt(ch.subscriberCount),
      fmt(ch.viewCount),
      ch.videoCount.toLocaleString(),
      fmt(ch.avgViews),
      fmt(ch.medianViews),
      fmtRatio(ch.longForm, ch.shorts),
    ]),
    styles: { fontSize: 7, cellPadding: 2 },
    headStyles: { fillColor: [220, 38, 38], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [255, 245, 245] },
    columnStyles: { 1: { cellWidth: 45 } },
  });

  doc.save(`${filename}.pdf`);
}
