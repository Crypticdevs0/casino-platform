import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldCheck, LogOut } from 'lucide-react';
import { KycStatusBadge } from '@/components/KycStatusBadge';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
interface SettingsPortalProps {
	kycLevel?: number;
	isBanned?: boolean;
	currency?: string;
}

export function SettingsPortal({ kycLevel, isBanned, currency = 'BTC' }: SettingsPortalProps) {

  const handleSaveChanges = () => {
    alert('Your limits have been saved. Please note that any changes that make your limits more restrictive will be applied immediately, while any changes that make them less restrictive will take 24 hours to come into effect.');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Settings & Responsible Gaming</CardTitle>
            <CardDescription>Manage your account and play safely.</CardDescription>
          </div>
          {typeof kycLevel === 'number' && (
            <div className="flex items-center gap-2 text-xs">
              <KycStatusBadge level={kycLevel} isBanned={isBanned} />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="limits" orientation="vertical" className="flex">
            <TabsList className="w-1/4">
                <TabsTrigger value="limits" className="w-full justify-start">Limits</TabsTrigger>
                <TabsTrigger value="exclusion" className="w-full justify-start">Self-Exclusion</TabsTrigger>
            </TabsList>
            <div className="w-3/4 pl-4">
                <TabsContent value="limits">
                    <Card>
                        <CardHeader>
                            <CardTitle>Financial & Session Limits</CardTitle>
                            <CardDescription>Set limits to control your spending and session time.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="dailyDeposit">Daily Deposit Limit ({currency})</Label>
                                <Input id="dailyDeposit" type="number" placeholder="No limit" />
                            </div>
                            <div>
                                <Label htmlFor="weeklyLoss">Weekly Loss Limit ({currency})</Label>
                                <Input id="weeklyLoss" type="number" placeholder="No limit" />
                            </div>
                             <div>
                                <Label htmlFor="sessionTime">Session Time Reminder (minutes)</Label>
                                <Input id="sessionTime" type="number" placeholder="No reminder" />
                            </div>
                            <Button onClick={handleSaveChanges}>Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="exclusion">
                    <Card>
                        <CardHeader>
                            <CardTitle>Self-Exclusion</CardTitle>
                            <CardDescription>If you need a break, you can temporarily or permanently exclude yourself from playing.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">Self-exclusion is irreversible for the duration you select. Please be sure before you proceed.</p>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive"><LogOut className="mr-2 h-4 w-4" />Initiate Self-Exclusion</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. You will be logged out and unable to access your account for the selected period.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => alert("You have been self-excluded.")}>
                                        Continue
                                    </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                </TabsContent>
            </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
