import { sessions_logoutAll } from "../actions/sessions_logoutAll";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LogoutAllDevicesCard() {
  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Sessions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          This will sign you out from all devices (including this one).
        </p>

        <form action={sessions_logoutAll}>
          <Button type="submit" variant="outline">
            Logout from all devices
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
