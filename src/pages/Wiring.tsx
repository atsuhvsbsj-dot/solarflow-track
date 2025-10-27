import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Wiring = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Wiring & Technical</h2>
        <p className="text-muted-foreground">Manage wiring and technical details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wiring Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            View wiring details for individual customers in their detail pages.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Wiring;
