import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  action?: React.ReactNode;
}

const PageHeader = ({ title, breadcrumbs, action }: PageHeaderProps) => {
  return (
    <div className="page-header">
      <div className="breadcrumb">
        <Link to="/" className="hover:text-foreground transition-colors">
          <Home className="w-3.5 h-3.5" />
        </Link>
        {breadcrumbs.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 breadcrumb-separator" />
            {item.path ? (
              <Link to={item.path} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="page-title">{title}</h1>
        {action && <div className="w-full sm:w-auto">{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
