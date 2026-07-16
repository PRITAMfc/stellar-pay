import { NextRequest, NextResponse } from "next/server";

const HORIZON_URL = process.env.HORIZON_URL || "https://horizon-testnet.stellar.org";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");

  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    const response = await fetch(`${HORIZON_URL}/accounts/${address}`);
    if (!response.ok) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    const data = await response.json();
    const nativeBalance = data.balances?.find(
      (b: { asset_type: string }) => b.asset_type === "native"
    );
    return NextResponse.json({ balance: nativeBalance?.balance || "0" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch balance" }, { status: 500 });
  }
}
