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
import { ShieldCheck } from 'lucide-react';

interface ResponsibleGamingModalProps {
  isOpen: boolean;
  onClose: () => void;
  kycLevel?: number;
}

export function ResponsibleGamingModal({ isOpen, onClose, kycLevel }: ResponsibleGamingModalProps) {
  // In a real app, these would be fetched and updated via an API
  const handleSaveChanges = () => {
    alert('Your limits have been saved.');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="text-primary" />
            Responsible Gaming
          </DialogTitle>
          <DialogDescription>
            Manage your limits to ensure you play safely. Changes may take 24 hours to apply.
            {typeof kycLevel === 'number' && (
              <span className="block text-[11px] text-muted-foreground mt-1">
                Current KYC level: {kycLevel}  Certain limit changes may require higher verification in a real deployment.
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
                  <Label htmlFor="dailyDeposit">Daily Limit (ETH)</Label>
                  <Input id="dailyDeposit" type="number" placeholder="No limit" />
                </div>
                <div>
                  <Label htmlFor="weeklyDeposit">Weekly Limit (ETH)</Label>
                  <Input id="weeklyDeposit" type="number" placeholder="No limit" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="loss">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">Set a limit on your net losses to prevent chasing.</p>
                  <div>
                    <Label htmlFor="dailyLoss">Daily Loss Limit (ETH)</Label>
                    <Input id="dailyLoss" type="number" placeholder="No limit" />
                  </div>
                  <div>
                    <Label htmlFor="weeklyLoss">Weekly Loss Limit (ETH)</Label>
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
