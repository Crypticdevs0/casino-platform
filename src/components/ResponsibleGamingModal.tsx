import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, Bitcoin, Info } from 'lucide-react';
import { displaySuccess } from '@/utils/errorHandler';

interface ResponsibleGamingModalProps {
  isOpen: boolean;
  onClose: () => void;
  kycLevel?: number;
  currency?: string;
}

export function ResponsibleGamingModal({ isOpen, onClose, kycLevel, currency = 'BTC' }: ResponsibleGamingModalProps) {
  const isBTC = currency === 'BTC';

  const handleSaveChanges = () => {
    displaySuccess('Limits Saved', 'Your responsible gaming limits have been updated.');
    onClose();
  };

  const formatSatoshis = (btc: number): string => {
    if (!isBTC || !btc) return '';
    const satoshis = Math.round(btc * 100000000);
    return ` (${satoshis.toLocaleString()} sats)`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="text-primary" />
            Responsible Gaming
            {isBTC && <Bitcoin className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
          </DialogTitle>
          <DialogDescription>
            Manage your limits to ensure you play safely. Changes may take 24 hours to apply.
            {isBTC && (
              <span className="block text-[11px] text-muted-foreground mt-1">
                Using Bitcoin for deposits. Limits are expressed in BTC (₿).
              </span>
            )}
            {typeof kycLevel === 'number' && (
              <span className="block text-[11px] text-muted-foreground mt-1">
                Current KYC level: {kycLevel}. Certain limit changes may require higher verification in a real deployment.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="deposit">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="loss">Loss</TabsTrigger>
            <TabsTrigger value="session">Session</TabsTrigger>
          </TabsList>
          <div className="py-4">
            <TabsContent value="deposit">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Set a limit on how much you can deposit in a given period.</p>
                {isBTC && (
                  <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 flex gap-2">
                    <Info className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-orange-700 dark:text-orange-300">Bitcoin values are in BTC. For reference: 1 BTC = 100,000,000 satoshis. You can also think in smaller units like mBTC (millibitcoin) where 0.001 BTC = 1 mBTC.</p>
                  </div>
                )}
                <div>
                  <Label htmlFor="dailyDeposit">Daily Limit ({currency})</Label>
                  <Input
                    id="dailyDeposit"
                    type="number"
                    step={isBTC ? "0.00000001" : "0.01"}
                    placeholder={isBTC ? "e.g., 0.5" : "No limit"}
                    min="0"
                  />
                  {isBTC && (
                    <p className="text-xs text-muted-foreground mt-1">Accepts up to 8 decimal places for satoshi precision</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="weeklyDeposit">Weekly Limit ({currency})</Label>
                  <Input
                    id="weeklyDeposit"
                    type="number"
                    step={isBTC ? "0.00000001" : "0.01"}
                    placeholder={isBTC ? "e.g., 2.0" : "No limit"}
                    min="0"
                  />
                  {isBTC && (
                    <p className="text-xs text-muted-foreground mt-1">Accepts up to 8 decimal places for satoshi precision</p>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="loss">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Set a limit on your net losses to prevent chasing.</p>
                  {isBTC && (
                    <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 flex gap-2">
                      <Info className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-orange-700 dark:text-orange-300">Loss limits are tracked in BTC. Set conservative limits to protect yourself from losing more than you can afford.</p>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="dailyLoss">Daily Loss Limit ({currency})</Label>
                    <Input
                      id="dailyLoss"
                      type="number"
                      step={isBTC ? "0.00000001" : "0.01"}
                      placeholder={isBTC ? "e.g., 0.1" : "No limit"}
                      min="0"
                    />
                    {isBTC && (
                      <p className="text-xs text-muted-foreground mt-1">Accepts up to 8 decimal places for satoshi precision</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="weeklyLoss">Weekly Loss Limit ({currency})</Label>
                    <Input
                      id="weeklyLoss"
                      type="number"
                      step={isBTC ? "0.00000001" : "0.01"}
                      placeholder={isBTC ? "e.g., 0.5" : "No limit"}
                      min="0"
                    />
                    {isBTC && (
                      <p className="text-xs text-muted-foreground mt-1">Accepts up to 8 decimal places for satoshi precision</p>
                    )}
                  </div>
                </div>
            </TabsContent>
            <TabsContent value="session">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Get a reminder after a certain amount of time.</p>
                  {isBTC && (
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex gap-2">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 dark:text-blue-300">Session reminders help you take breaks and maintain responsible gaming habits regardless of your currency choice.</p>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="sessionTime">Session Time Reminder (minutes)</Label>
                    <Input
                      id="sessionTime"
                      type="number"
                      placeholder="No reminder"
                      min="5"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Minimum 5 minutes. Leave empty to disable.</p>
                  </div>
                </div>
            </TabsContent>
          </div>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
