
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, AlertCircle, Filter } from "lucide-react";
import { FraudReport } from "@/types/fraudReport";
import FraudReportCard from "./FraudReportCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReportsListProps {
  reports: FraudReport[];
  filter?: (report: FraudReport) => boolean;
  title?: string;
  showStatusFilter?: boolean;
}

const ReportsList: React.FC<ReportsListProps> = ({ reports, filter, title, showStatusFilter = false }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "pending">("all");
  
  const filteredBySearch = searchQuery
    ? reports.filter(report => 
        (report.upiId && report.upiId.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (report.url && report.url.toLowerCase().includes(searchQuery.toLowerCase())) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : reports;

  const filteredByStatus = statusFilter === "all" 
    ? filteredBySearch 
    : filteredBySearch.filter(report => report.status === statusFilter);

  const finalReports = filter ? filteredByStatus.filter(filter) : filteredByStatus;

  const verifiedCount = reports.filter(r => r.status === "verified").length;
  const pendingCount = reports.filter(r => r.status === "pending").length;

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

      {showStatusFilter && (
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter:</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
            >
              All ({reports.length})
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "verified" ? "default" : "outline"}
              onClick={() => setStatusFilter("verified")}
              className="flex items-center gap-1"
            >
              <AlertCircle className="h-3 w-3" /> 
              Verified ({verifiedCount})
            </Button>
            <Button
              size="sm"
              variant={statusFilter === "pending" ? "default" : "outline"}
              onClick={() => setStatusFilter("pending")}
            >
              Pending ({pendingCount})
            </Button>
          </div>
        </div>
      )}

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
