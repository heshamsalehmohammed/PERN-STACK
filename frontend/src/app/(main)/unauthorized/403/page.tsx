import { Card } from "@/components/ui/card";

export default async function Auth403Page() {
  return (
    <div className="container mx-auto py-10">
      <Card className="p-5 text-center" style={{color:'red'}}>You are not authorized</Card>
    </div>
  );
}
