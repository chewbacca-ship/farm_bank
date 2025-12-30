import Dashboard from "./Dashboard";
import FarmerDashboard from "./FarmerDashboard";
import FarmerPortfolio from "./FarmerPortfolio";
import Portfolio from "./Portfolio";
import Opportunities from "./Opportunities";
import FarmerInvestors from "./FarmerInvestors";
import { auth } from "../api/Api";

export const DashboardSelector = () => {
  const storedUser = auth.getUser();
  const role = storedUser?.role || "investor";

  if (role === "farmer") {
    return <FarmerDashboard />;
  }

  return <Dashboard />;
};

export const PortfolioSelector = () => {
  const storedUser = auth.getUser();
  const role = storedUser?.role || "investor";

  if (role === "farmer") {
    return <FarmerPortfolio />;
  }

  return <Portfolio />;
};

export const OpportunitiesSelector = () => {
  const storedUser = auth.getUser();
  const role = storedUser?.role || "investor";

  if (role === "farmer") {
    return <FarmerInvestors />;
  }

  return <Opportunities />;
};

export default DashboardSelector;
