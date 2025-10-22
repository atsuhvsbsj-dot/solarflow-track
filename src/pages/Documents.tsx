import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Documents = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Documents</h2>
        <p className="text-muted-foreground">Manage all project documents</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            View documents for individual customers in their detail pages.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;
