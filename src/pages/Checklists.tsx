import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Checklists = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Checklists</h2>
        <p className="text-muted-foreground">Track project progress checklists</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Process Checklists</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            View checklists for individual customers in their detail pages.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checklists;
