'use client';

import React, { useState } from 'react';
import { Dialog } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { CreditType } from '@/types';
import { useWalletStore } from '@/store/useWalletStore';
import { useAppStore } from '@/store/useAppStore';
import { PlusCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface MintDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MintDialog({ isOpen, onClose }: MintDialogProps) {
  const { isConnected, publicKey } = useWalletStore();
  const { mintProject, addTransaction, updateTransaction } = useAppStore();

  const [projectName, setProjectName] = useState('Coastal Mangrove Restoration Project');
  const [creditType, setCreditType] = useState<CreditType>('Blue Carbon');
  const [co2Tons, setCo2Tons] = useState(15000);
  const [vintageYear, setVintageYear] = useState(2024);
  const [pricePerTon, setPricePerTon] = useState(15.0);
  const [totalSupply, setTotalSupply] = useState(5000);
  const [certUrl, setCertUrl] = useState('https://ipfs.io/ipfs/QmVerifiedCert...9921');
  const [location, setLocation] = useState('Queensland, Australia');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMint = async () => {
    if (!isConnected || !publicKey) {
      toast.error('Please connect your wallet first!');
      return;
    }

    if (!projectName.trim()) {
      toast.error('Please specify project name');
      return;
    }

    setIsSubmitting(true);
    const txId = addTransaction({
      title: `Mint Soroban Credit: ${projectName}`,
      status: 'pending',
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2500));

      mintProject({
        issuer: publicKey,
        projectName,
        creditType,
        co2Tons,
        vintageYear,
        certificateUrl: certUrl,
        totalSupply,
        pricePerTon,
        isVerified: true,
        location,
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
      });

      const mockTxHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

      updateTransaction(txId, {
        status: 'success',
        hash: mockTxHash,
      });

      toast.success('New verified carbon credit project minted on Stellar!');
      onClose();
    } catch (err: any) {
      updateTransaction(txId, {
        status: 'failed',
        error: err.message || 'Minting contract execution failed',
      });
      toast.error('Failed to mint carbon credit project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Mint Verified Carbon Credit Project"
      description="Issue new verified environmental carbon credits onto the Stellar Soroban blockchain."
    >
      <div className="space-y-3.5 my-3 text-slate-200 text-xs">
        <div>
          <label className="block font-semibold text-slate-300 mb-1">Project Name</label>
          <Input
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. Amazonian Reforestation"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Credit Sector</label>
            <select
              value={creditType}
              onChange={(e) => setCreditType(e.target.value as CreditType)}
              className="w-full h-10 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Reforestation">Reforestation</option>
              <option value="Solar Energy">Solar Energy</option>
              <option value="Blue Carbon">Blue Carbon</option>
              <option value="Direct Air Capture">Direct Air Capture</option>
              <option value="Wind Farm">Wind Farm</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Vintage Year</label>
            <Input
              type="number"
              value={vintageYear}
              onChange={(e) => setVintageYear(parseInt(e.target.value) || 2024)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Total CO2 Impact (Tons)</label>
            <Input
              type="number"
              value={co2Tons}
              onChange={(e) => setCo2Tons(parseInt(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Token Supply Minted</label>
            <Input
              type="number"
              value={totalSupply}
              onChange={(e) => setTotalSupply(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Price per Ton (XLM)</label>
            <Input
              type="number"
              step="0.1"
              value={pricePerTon}
              onChange={(e) => setPricePerTon(parseFloat(e.target.value) || 0)}
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Project Location</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Country / State"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">IPFS Verra Certificate Link</label>
          <Input
            value={certUrl}
            onChange={(e) => setCertUrl(e.target.value)}
            placeholder="https://ipfs.io/ipfs/..."
          />
        </div>

        <Button
          variant="glow"
          onClick={handleMint}
          disabled={isSubmitting || !isConnected}
          className="w-full h-11 text-base gap-2 mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Deploying Credit Record on Soroban...
            </>
          ) : (
            <>
              <PlusCircle className="h-5 w-5" /> Mint & List Carbon Credit
            </>
          )}
        </Button>
      </div>
    </Dialog>
  );
}
