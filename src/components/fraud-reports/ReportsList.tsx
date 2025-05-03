
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { FraudReport } from "@/types/fraudReport";
import FraudReportCard from "./FraudReportCard";

interface ReportsListProps {
  reports: FraudReport[];
  filter?: (report: FraudReport) => boolean;
  title?: string;
}

const ReportsList: React.FC<ReportsListProps> = ({ reports, filter, title }) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredReports = searchQuery
    ? reports.filter(report => 
        (report.upiId && report.upiId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (report.url && report.url.toLowerCase().includes(searchQuery.toLowerCase())) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : reports;

  const finalReports = filter ? filteredReports.filter(filter) : filteredReports;

  return (
    <>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          className="pl-10"
          placeholder={`Search ${title || "reports"}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {finalReports.length > 0 ? (
        <div>
          {finalReports.map(report => (
            <FraudReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No {title?.toLowerCase() || "fraud reports"} found</p>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ReportsList;
