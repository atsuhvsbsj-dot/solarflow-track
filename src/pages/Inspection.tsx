import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Inspection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">QC / Inspection</h2>
        <p className="text-muted-foreground">Quality control and inspection management</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inspection Records</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            View inspection records for individual customers in their detail pages.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inspection;
