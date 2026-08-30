'use client';

import React, { useState } from 'react';
import { getSEP31RemittanceQuote, executeSEP31Remittance, SUPPORTED_SEP31_CORRIDORS, SEP31CrossBorderTransaction } from '@/lib/sep31';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import {
  Globe,
  ArrowRightLeft,
  Building2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Send,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

export default function CrossBorderPage() {
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'BRL' | 'SGD' | 'GBP'>('EUR');
  const [amount, setAmount] = useState<number>(5000);
  const [senderName, setSenderName] = useState('Siemens Clean Mobility AG');
  const [senderCountry, setSenderCountry] = useState('Germany');
  const [receiverInstitution, setReceiverInstitution] = useState('Amazon Bio-Reserve Sequestration Trust');
  const [receiverCountry, setReceiverCountry] = useState('Brazil');
  const [isExecuting, setIsExecuting] = useState(false);
  const [settledTx, setSettledTx] = useState<SEP31CrossBorderTransaction | null>(null);

  const quote = getSEP31RemittanceQuote(currency, 'CARBON-CREDIT', amount);

  const handleExecuteRemittance = (e: React.FormEvent) => {
    e.preventDefault();
    setIsExecuting(true);
    setTimeout(() => {
      const tx = executeSEP31Remittance(senderName, senderCountry, receiverInstitution, receiverCountry, quote);
      setSettledTx(tx);
      setIsExecuting(false);
      toast.success(`Cross-Border SEP-31 Remittance Settled in 4.5s! ${quote.receiveAmount} Carbon Credits dispatched.`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 border-b border-emerald-500/20 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-emerald-950/60 text-emerald-400 border-emerald-500/40 gap-1.5 px-3 py-1">
              <Globe className="h-3.5 w-3.5" />
              Stellar Level 6 Advanced Feature
            </Badge>
            <Badge variant="secondary" className="bg-teal-950 text-teal-300 border border-teal-500/30">
              SEP-31 Cross-Border Rails
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
            SEP-31 Cross-Border Remittances & Anchor Insetting
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Execute direct institutional cross-border fiat settlement between global corporations and local climate projects using regulated Stellar SEP-31 Anchor payment corridors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Corridor Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-xl text-white font-bold flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5 text-emerald-400" />
                  Initiate Cross-Border Remittance
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Institutional multi-currency settlement via Stellar DEX and Anchor rails.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleExecuteRemittance} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Source Fiat Currency</label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as any)}
                        className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs font-bold focus:border-emerald-500"
                      >
                        <option value="EUR">EUR (€) - European Union</option>
                        <option value="USD">USD ($) - United States</option>
                        <option value="BRL">BRL (R$) - Brazil</option>
                        <option value="SGD">SGD (S$) - Singapore</option>
                        <option value="GBP">GBP (£) - United Kingdom</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Send Amount ({currency})</label>
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="bg-slate-950 border-slate-800 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Sender Organization</label>
                      <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} className="bg-slate-950 border-slate-800 text-white text-xs" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Receiver Climate Project</label>
                      <Input value={receiverInstitution} onChange={(e) => setReceiverInstitution(e.target.value)} className="bg-slate-950 border-slate-800 text-white text-xs" />
                    </div>
                  </div>

                  {/* Real-Time Quote Summary Box */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Anchor Conversion Rate:</span>
                      <span className="font-mono text-white font-bold">1 {currency} = {quote.exchangeRate} Carbon Credits</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Anchor Protocol Fee (0.25%):</span>
                      <span className="font-mono text-white font-bold">{quote.anchorFee} {currency}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Stellar On-Chain Fee:</span>
                      <span className="font-mono text-emerald-400 font-bold">0.0000100 XLM (~$0.000001)</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2 text-sm">
                      <span className="font-bold text-white">Project Receives:</span>
                      <span className="font-mono text-emerald-400 font-extrabold text-base">{quote.receiveAmount.toLocaleString()} Credits / Tons CO2</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isExecuting}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-6 gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <Send className="h-5 w-5" />
                    {isExecuting ? 'Routing via Stellar Anchor Payment Rails...' : `Settle ${amount.toLocaleString()} ${currency} Cross-Border Remittance`}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Right: Settlement Status */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-slate-900/80 border-slate-800 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-lg text-white font-bold flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-teal-400" />
                  SEP-31 Settlement Proof
                </CardTitle>
                <CardDescription className="text-slate-400 text-xs">
                  Instant ISO-20022 compliant settlement status.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {settledTx ? (
                  <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-emerald-500/40 text-xs animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/50">
                        {settledTx.status}
                      </Badge>
                      <span className="font-mono text-[10px] text-slate-500">4.5s Settlement</span>
                    </div>
                    <p className="font-semibold text-white">{settledTx.senderName} ({settledTx.senderCountry}) → {settledTx.receiverInstitution}</p>
                    <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-emerald-300 break-all">
                      Tx: {settledTx.settlementTxHash}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-xs text-slate-400">
                    <Globe className="h-8 w-8 text-slate-600 mx-auto mb-2" />
                    <p>No active cross-border transfer</p>
                    <p className="text-[11px] text-slate-500 mt-1">Submit remittance form to trigger instant on-chain settlement.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
