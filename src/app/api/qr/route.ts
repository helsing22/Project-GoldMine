import { NextResponse } from 'next/server';
import shiftsData from '@/data/shifts.json';

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const shift = shiftsData[today as keyof typeof shiftsData] || shiftsData['default'] || { qr: 'default-transfer.png', staff: 'turno' };
  const qrUrl = `/public/qrs/${shift.qr}`;
  return NextResponse.json({ qrUrl, staff: shift.staff || 'turno' });
}
