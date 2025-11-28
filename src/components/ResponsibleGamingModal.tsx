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
                <div>
                  <Label htmlFor="dailyDeposit">Daily Limit ({currency})</Label>
                  <Input id="dailyDeposit" type="number" placeholder="No limit" />
                </div>
                <div>
                  <Label htmlFor="weeklyDeposit">Weekly Limit ({currency})</Label>
                  <Input id="weeklyDeposit" type="number" placeholder="No limit" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="loss">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Set a limit on your net losses to prevent chasing.</p>
                  <div>
                    <Label htmlFor="dailyLoss">Daily Loss Limit ({currency})</Label>
                    <Input id="dailyLoss" type="number" placeholder="No limit" />
                  </div>
                  <div>
                    <Label htmlFor="weeklyLoss">Weekly Loss Limit ({currency})</Label>
                    <Input id="weeklyLoss" type="number" placeholder="No limit" />
                  </div>
                </div>
            </TabsContent>
            <TabsContent value="session">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Get a reminder after a certain amount of time.</p>
                  <div>
                    <Label htmlFor="sessionTime">Session Time Reminder (minutes)</Label>
                    <Input id="sessionTime" type="number" placeholder="No reminder" />
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
