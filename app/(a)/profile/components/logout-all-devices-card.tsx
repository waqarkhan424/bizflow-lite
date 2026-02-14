import { sessions_logoutAll } from "../actions/sessions_logoutAll";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function LogoutAllDevicesCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-muted-foreground" />
          Sessions
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 p-6">
        <p className="text-sm text-muted-foreground">
          If you feel your account is logged in somewhere else, you can sign out
          from all devices (including this one).
        </p>

        <div className="rounded-lg border bg-muted/20 p-4 text-sm">
          <p className="font-medium">This action will:</p>
          <ul className="mt-2 list-disc pl-5 text-muted-foreground space-y-1">
            <li>Logout all active sessions</li>
            <li>Clear your current session</li>
            <li>Redirect you to login</li>
          </ul>
        </div>

        <form action={sessions_logoutAll}>
          <Button type="submit" variant="destructive" className="w-fit">
            Logout from all devices
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
